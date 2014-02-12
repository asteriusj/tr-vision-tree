var googleapis = require('googleapis')
    models = require('../../models'),
    GCal = require('../gcalendar')
    config = require('../config');

exports.create = function(title, OAuthClient, cb) {
  googleapis.discover('drive', 'v2').execute(function(err, client) {
    client.drive.files.insert({
        title: title,
        mimeType: 'application/vnd.google-apps.spreadsheet'
    })
    .withAuthClient(OAuthClient)
    .execute(cb);
  });
}

/** lList spreadsheets using the Drive v2 Discovery API */
exports.drive_list = function(OAuthClient, cb) {
  googleapis.discover('drive', 'v2').execute(function(err, client) {
    client.drive.files.list()
    .withAuthClient(OAuthClient)
    .execute(function(err, body, resp) {
        if (err) {
          console.log('error', err);
          cb(err);
        }

        // filter down to google spreadsheets
        var spreadsheets = [];
        for(var i=0; i<body.items.length; i++) {
          var file = body.items[i];
          if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
            spreadsheets[spreadsheets.length] = file;
          }
        }

        cb(null,spreadsheets);
      });
  });
}

exports.list = function(OAuthClient, cb) {
  var opts = {
    url: 'https://spreadsheets.google.com/feeds/spreadsheets/private/full?alt=json'
  };

  OAuthClient.request(opts, function(err, body, resp) {
    if (err) {
      console.log('error', err);
      cb(err);
    }

    var spreadsheets = [];
    for(var i=0; i<body.feed.entry.length; i++) {
      var spreadsheet = body.feed.entry[i];
      var spreadsheetIdUrl = spreadsheet.id['$t'];
      spreadsheets[spreadsheets.length] = {
        id: spreadsheetIdUrl.substr(spreadsheetIdUrl.lastIndexOf('/')+1),
        title: spreadsheet.title['$t'],
        iconLink: 'https://ssl.gstatic.com/docs/doclist/images/icon_11_spreadsheet_list.png' // taken from drive_list
      };
    }

    cb(null, spreadsheets);
  });
}

exports.getWorksheets = function(spreadsheetId, OAuthClient, cb) {
  var opts = {
    url: 'https://spreadsheets.google.com/feeds/worksheets/' + spreadsheetId + '/private/full?alt=json'
  };

  // seems to be no spreadsheet api in the discovery service :(

  OAuthClient.request(opts, function(err, body, resp){
    if (err) {
      console.log('error', err);
      cb(err);
    }

    var worksheets = [];
    if (body.feed.entry) {
      for (var i=0; i<body.feed.entry.length; i++) {
        var worksheet = body.feed.entry[i];
        var worksheetIdUrl = worksheet.id['$t'];
        worksheets[worksheets.length] = {
          id: worksheetIdUrl.substr(worksheetIdUrl.lastIndexOf('/')+1),
          title: worksheet.title['$t']
        };
      }
    }

    cb(null, worksheets);
  });
}

exports.getWorksheet = function(spreadsheetId, worksheetId, OAuthClient, cb) {
  var opts = {
    url: 'https://spreadsheets.google.com/feeds/list/' + spreadsheetId + '/' + worksheetId + '/private/full?alt=json'
  };

  OAuthClient.request(opts, function(err, body, resp){
    if (err) {
      console.log('error', err);
      cb(err);
    }

    //var worksheet = new models.Worksheet({googleBody:body});
    var worksheet = new models.Worksheet({
      SpreadsheetID: spreadsheetId,
      WorksheetID: worksheetId,
      googleBody: body,
      CalSyncCalendarID: config.SpreadsheetCalSync[spreadsheetId + '/' + worksheetId]
    });

    cb(null, worksheet);
  });
}

exports.calsync = function(worksheet, OAuthClient, cb) {

  for(var i = 0; i < worksheet.data.length; i++) {
    var row = worksheet.data[i];

    // if row does not contain a CREATED date, it needs to be created
    if (!row[worksheet.columns.indexOf('created')]) {
      // add event to calendar
      var start = new Date(row[worksheet.columns.indexOf('dtstart')]);
      var end = new Date(row[worksheet.columns.indexOf('dtend')]);

      var event = new models.Event({
        summary: row[worksheet.columns.indexOf('summary')],
        location: row[worksheet.columns.indexOf('location')],
        start: row[worksheet.columns.indexOf('dtstart')],
        end: row[worksheet.columns.indexOf('dtend')],
      });

      GCal.Events.add(worksheet.CalSyncCalendarID, event, OAuthClient,
        function(err, eventId) {
          if (err) {
            console.log('error', err);
            cb(err);
          }

          // put CREATED date and event id in spreadsheet
          var now = new Date();
          row[worksheet.columns.indexOf('created')] = now.toISOString();
          row[worksheet.columns.indexOf('last-modified')] = now.toISOString();
          row[worksheet.columns.indexOf('eventid')] = eventId;

          // update spreadsheet
          var entryXml = '<entry xmlns="http://www.w3.org/2005/Atom" xmlns:gsx="http://schemas.google.com/spreadsheets/2006/extended">' +
                         '<id>' + row['_'].id + '</id>' +
                         '<updated>' + row['_'].updated + '</updated>' +
                         '<category scheme="http://schemas.google.com/spreadsheets/2006" term="http://schemas.google.com/spreadsheets/2006#list"/>' +
                         '<title type="text">' + row['_'].title + '</title>' +
                         '<content type="text">' + row['_'].content + '</content>';
          for (var linkI=0; linkI < row['_'].links.length; linkI++) {
            var link = row['_'].links[linkI];
            entryXml += '<link rel="'+link.rel+'" type="'+link.type+'" href="'+link.href+'"/>';
          }
          for (var colI = 0; colI < worksheet.columns.length; colI++) {
            var colName = worksheet.columns[colI];
            var el = 'gsx:'+colName;
            entryXml += '<'+el+'>'+row[colI]+'</'+el+'>';
          }
          entryXml += '</entry>';

          OAuthClient.request({
            url: row['_'].editUrl,
            method: 'PUT',
            headers: {
              'Content-type': 'application/atom+xml'
            },
            body: entryXml
          }, function(err,body,resp) {
            if (err) {
              console.log('error', err);
              cb(err);
            }
          });
      });
    }
  }
  cb();
}
