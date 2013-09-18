var express = require('express'),
  path = require('path'),
  http = require('http');

var app = express();
app.use(express.bodyParser());

var config = require('./config').settings;
var db = require('./lib/db');  // db is required/defined in the models

app.configure(function () {
  app.set('port', process.env.PORT || config.server_port);
});

// endpoints

// TODO: add a delete endpoint for removing a url
// TODO: handle different versions of the endpoint

// get a specific host_and_port + url resource from the db
// return 404 if not found
app.get('/urlinfo/:version/:host_and_port/:url', function(req, res) {
  var version = req.params.version,
    host_and_port = req.params.host_and_port,
    url = req.params.url;

  db.find_one(host_and_port, url,
    function (url) { // success
      console.log('url: ' + JSON.stringify(url));
      if (url.length > 0) {
        res.send(JSON.stringify(url));
      } else {
        res.send(404);
      }
    },
    function (err) { // failure
      res.send(err);
    });
});

// list all the url models from the db
app.get('/urlinfo/:version', function(req, res) {
  var urls = db.find_all(
    function (urls) { // success
      console.log('urls: ' + JSON.stringify(urls));
      res.send(JSON.stringify(urls));
    },
    function (err) {  // failure
      res.send(err);
    });
});

// add a new model to the database, return the newly created model
// TODO: add param validation return malformed request when params not present, etc.
app.post('/urlinfo/:version/:host_and_port/:url', function(req, res){
  var version = req.params.version,
    host_and_port = req.params.host_and_port,
    url = req.params.url;

  db.create_url(host_and_port, url, 
    function (new_url) { //success
      console.log('created url: ' + JSON.stringify(new_url));
      res.send(JSON.stringify(new_url));
    },
    function (err) { // failure
      res.send(err);
    });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("...server listening on port " + app.get('port'));
  console.log('settings: ' + JSON.stringify(config));
});