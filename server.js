/**
 * Node.js server that demonstrates AsteriusGDocs library (server and client).
 */
var express = require('express')
  , path = require('path')
  , routes = require('./routes')
  , TR = require('./testerroonie')
  , app = express()
  , host = process.env.IP || 'localhost'
  , port = process.env.PORT || 5000;

// setup EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.configure(function(){
  app.use(express.urlencoded());
  // add session
  app.use(express.cookieParser('somethingsupersecret'));
  app.use(express.session());

  // serve static files
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', routes.index);

app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/oauth/oauth-login', routes.oauth_login);
app.get('/oauth/oauth-callback', routes.oauth_callback);

app.post('/spreadsheets/create', [TR.OAuth.RequireOAuth, routes.spreadsheet_create]);
app.get('/spreadsheets', [TR.OAuth.RequireOAuth, routes.spreadsheet_list]);
app.get('/spreadsheets/:spreadsheetId', [TR.OAuth.RequireOAuth, routes.spreadsheet_worksheets]);
app.get('/spreadsheets/:spreadsheetId/:worksheetId', [TR.OAuth.RequireOAuth, routes.spreadsheet_worksheet]);

app.listen(port, host);
console.log('Listening on port http://' + host + ':' + port);
