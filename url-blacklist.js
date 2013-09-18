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

// TODO: add a post endpoint for adding url
// TODO: add a delete endpoint for removing a url

app.get('/urlinfo/:version/:host_name/:lookup', function(req, res) {
  var version = req.params.version,
    host_name = req.params.host_name,
    lookup = req.params.lookup;

  console.log("version: " + version + ", host name: " + host_name + ", lookup: " + lookup);

  // TODO: handle different versions of the endpoint

  res.send('not implemented yet');
});

app.get('/urlinfo/:version', function(req, res) {
  var urls = db.find_all(function (urls) {
    console.log('urls: ' + JSON.stringify(urls));
    res.send(JSON.stringify(urls));
  });
});

app.post('/urlinfo/:version', function(req, res){
  db.create_url(req.query.url, function(new_url) {
    console.log('created url: ' + JSON.stringify(new_url));
    res.send(JSON.stringify(new_url));
  });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("...server listening on port " + app.get('port'));
  console.log('settings: ' + JSON.stringify(config));
});