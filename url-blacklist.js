// ------------------------------------------------------------
// app setup
// ------------------------------------------------------------

var express = require('express'),
  path = require('path'),
  http = require('http');

var app = express();
app.use(express.bodyParser());

var config = require('./config').settings;
var URLProvider = require('./lib/db').URLProvider;
var url_provider = new URLProvider();

app.configure(function () {
  app.set('port', process.env.PORT || config.server_port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// ------------------------------
// endpoints
// ------------------------------

// TODO: add a delete endpoint for removing a url
// TODO: handle different versions of the endpoint

// get a specific host_and_port + url resource from the db
// return 404 if not found
app.get('/urlinfo/:version/:host_and_port/:url', function(req, res) {
  var version = req.params.version,
    host_and_port = req.params.host_and_port,
    url = req.params.url;

  url_provider.findOne(host_and_port, url,
    function (result) { // success
      var body = JSON.stringify(result);
      console.log('body: %s', body);
      if (result.length > 0) {
        sendJSONResult(res, body);
      } else {
        sendPlainTextResult(res, 404);
      }
    },
    function (err) { // failure
      console.error(err.stack);
      sendPlainTextResult(res, err);
    });
});

// list all the url models from the db
app.get('/urlinfo/:version', function(req, res) {
  var urls = url_provider.findAll(
    function (result) { // success
      var body = JSON.stringify(result);
      sendJSONResult(res, body);
    },
    function (err) {  // failure
      console.error(err.stack);
      sendPlainTextResult(res, err);
    });
});

// add a new model to the database, return the newly created model
// TODO: add param validation return malformed request when params not present, etc.
app.post('/urlinfo/:version/:host_and_port/:url', function(req, res){
  var version = req.params.version,
    host_and_port = req.params.host_and_port,
    url = req.params.url;

  url_provider.createUrl(host_and_port, url,
    function (result) { //success
      var body = JSON.stringify(result);
      sendJSONResult(res, body);
    },
    function (err) { // failure
      res.setHeader('Content-Type', 'text/plain');
      console.error(err.stack);
      res.send(err);
    });
});

// ------------------------------
// wrappers for sending response
// ------------------------------
sendPlainTextResult = function(res, body) {
  res.setHeader('Content-Type', 'text/plain');
  res.send(body);
};

sendJSONResult = function(res, body) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.send(body);
};

// ------------------------------
// create the server object
// ------------------------------
http.createServer(app).listen(app.get('port'), function () {
  console.log("...server listening on port %s", app.get('port'));
  console.log('settings: %s', JSON.stringify(config));
});