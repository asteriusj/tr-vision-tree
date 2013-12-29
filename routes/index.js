var OAuthRoutes = require('./OAuth'),
    SpreadsheetRoutes = require('./Spreadsheet');

/** Homepage */
exports.index = function(req, res) {
  var viewData = {
    title: 'Testerroonie',
    authenticated: req.session.oauth_access_token ? true : false
  };
  res.render(viewData.authenticated ? 'index-auth' : 'index', viewData);
};


/** OAuth/login handlers */
exports.login = OAuthRoutes.login;
exports.logout = OAuthRoutes.logout;
exports.oauth_login = OAuthRoutes.oauth_login;
exports.oauth_callback = OAuthRoutes.oauth_callback;

/** Google Docs Spreadsheet handlers */
exports.spreadsheet_create = SpreadsheetRoutes.create;
exports.spreadsheet_list = SpreadsheetRoutes.list;
exports.spreadsheet_worksheets = SpreadsheetRoutes.worksheets;
exports.spreadsheet_worksheet = SpreadsheetRoutes.worksheet;
