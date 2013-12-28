/**
 * Handlers for all samples.
 */
var TR = require('../testerroonie'),
    googleapis = require('googleapis');

exports.create = function(req, res) {
  TR.Spreadsheets.create(req.body.title,req.OAuthClient,function(err, body, resp) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    return res.redirect("/spreadsheets/");
  });
};

exports.list = function(req, res) {
  console.log("Spreadsheet.list");
  TR.Spreadsheets.list(req.OAuthClient,function(err, spreadsheets) {
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

  TR.Spreadsheets.getWorksheets(spreadsheetId, req.OAuthClient,function(err, worksheets) {
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
  console.log('worksheet');

  var spreadsheetId = req.params.spreadsheetId;
  var worksheetId = req.params.worksheetId;

  TR.Spreadsheets.getWorksheetRows(spreadsheetId, worksheetId, req.OAuthClient, function(err, rows) {
    if (err) {
      console.log('error', err);
      return res.send(err);
    }

    var viewData = {
      title: 'Rows',
      authenticated: req.session.oauth_access_token ? true : false,
      spreadsheetID:spreadsheetId,
      worksheetId:worksheetId,
      rows: rows
    };

    return res.render('worksheet-data', viewData);
  });
};