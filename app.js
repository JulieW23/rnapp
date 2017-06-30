var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var session = require('express-session');

var http = require('http');
var url = require('url');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var trello_oauth = require("./login/trello_oauth.js");

// ***********************************
var routes = require('./routes/index');
var trello = require('./routes/trello');

var app = express();

// app.use(session({secret: 'rnsecret', resave: false}));

// var sess;

app.get("/trelloLogin", function(request, response) {
    console.log('GET trelloLogin');
    trello_oauth.login(request, response);
});

app.get("/trello", function(request, response) {
    if (trello_oauth.callback_check == 1){
      console.log('GET trello callback');
      trello_oauth.callback(request, response);
    }
    response.render('trello', { title: 'Trello Report' });
});

// =================================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ***********************************
app.use('/', routes);
app.use('/trello', trello);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
});


module.exports = app;
