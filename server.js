var express = require('express')
  , path = require('path')
  , routes = require('./routes')
  , OAuth = require('./lib/oauth')
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

app.post('/spreadsheets/create', [OAuth.RequireOAuth, routes.spreadsheet_create]);
app.get('/spreadsheets', [OAuth.RequireOAuth, routes.spreadsheet_list]);
app.get('/spreadsheets/:spreadsheetId', [OAuth.RequireOAuth, routes.spreadsheet_worksheets]);
app.get('/spreadsheets/:spreadsheetId/:worksheetId', [OAuth.RequireOAuth, routes.spreadsheet_worksheet]);

app.get('/calendars', [OAuth.RequireOAuth, routes.calendar_list]);
app.post('/calendars/create', [OAuth.RequireOAuth, routes.calendar_create]);
app.get('/calendars/:calendarId', [OAuth.RequireOAuth, routes.event_list]);

app.listen(port, host);
console.log('Listening on port http://' + host + ':' + port);
