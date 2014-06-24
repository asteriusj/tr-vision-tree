var express = require('express')
  , path = require('path')
  , routes = require('./routes')
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



app.listen(port, host);
console.log('Listening on port http://' + host + ':' + port);
