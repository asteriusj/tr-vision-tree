var Spreadsheets = require('../lib/gdocs/spreadsheet'),
    googleapis = require('googleapis');

exports.create = function(req, res) {
  Spreadsheets.create(req.body.title,req.OAuthClient,function(err, body, resp) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    return res.redirect("/spreadsheets/");
  });
};

exports.list = function(req, res) {
  console.log("Spreadsheet.list");
  Spreadsheets.list(req.OAuthClient,function(err, spreadsheets) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Spreadsheets',
      authenticated: req.session.oauth_access_token ? true : false,
      spreadsheets:spreadsheets
    };

    return res.render('spreadsheet-list', viewData);
  });
};

exports.worksheets = function(req, res) {
  console.log('worksheets');

  var spreadsheetId = req.params.spreadsheetId;

  Spreadsheets.getWorksheets(spreadsheetId, req.OAuthClient,function(err, worksheets) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Worksheets',
      authenticated: req.session.oauth_access_token ? true : false,
      spreadsheetId:spreadsheetId,
      worksheets:worksheets
    };

    return res.render('worksheet-list', viewData);
  });
};

exports.worksheet = function(req, res) {
  var spreadsheetId = req.params.spreadsheetId;
  var worksheetId = req.params.worksheetId;

  Spreadsheets.getWorksheet(spreadsheetId, worksheetId, req.OAuthClient, function(err, worksheet) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Rows',
      authenticated: req.session.oauth_access_token ? true : false,
      spreadsheetID:spreadsheetId,
      worksheetId:worksheetId,
      worksheet: worksheet
    };

    return res.render('worksheet-data', viewData);
  });
};

exports.worksheet_calsync = function(req, res) {
  var spreadsheetId = req.params.spreadsheetId;
  var worksheetId = req.params.worksheetId;

  Spreadsheets.getWorksheet(spreadsheetId, worksheetId, req.OAuthClient, function(err, worksheet) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    Spreadsheets.calsync(worksheet,req.OAuthClient,function(err, eventId) {
      if (err) {
        console.log('error', err);
        return res.send(err);
      }

      return res.redirect("/spreadsheets/" + spreadsheetId + "/" + worksheetId);
    });
  });
};
