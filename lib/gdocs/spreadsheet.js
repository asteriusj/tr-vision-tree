var googleapis = require('googleapis')
    models = require('../../models')

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
    });

    cb(null, worksheet);
  });
}