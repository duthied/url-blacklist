/*
  this file can be replaced with some other ORM/db wrapper
*/

// TODO: get values from config file/module
var uri = "localhost:27017/url-info-1";
var mongoose = require('mongoose');
mongoose.set('debug', true);
var db = mongoose.connection;
var BlackListedUrl;
var BlackListedUrlSchema;

db.on('error', console.error);
db.once('open', function() {
  this.BlackListedUrlSchema = new mongoose.Schema({
    host_and_port: { type: String, index: true, required : true },
    url: { type: String, index: true, required : true },
    date: Date
  });

  this.BlackListedUrl = mongoose.model('BlackListedUrl', this.BlackListedUrlSchema);
});

mongoose.connect(uri);

get_blacklistedurl_model = function() {
  return mongoose.model('BlackListedUrl', this.BlackListedUrlSchema);
};

exports.create_url = function(_host_and_port, _url, callback) {
  // var BlackListedUrl = mongoose.model('BlackListedUrl', this.BlackListedUrlSchema);
  var BlackListedUrl = get_blacklistedurl_model();
  var create_date = new Date();
  var u = new BlackListedUrl({
    url: _url,
    host_and_port: _host_and_port,
    date: create_date
  });
  // u.url = _url;
  // u.host_and_port = host_and_port;
  // u.date = new Date();
  u.save(function(err, new_url) {
    if (err) return console.error(err);
    console.dir(new_url);
    callback(new_url);
  });
};

exports.find_one = function(_host_and_port, _url, callback) {
  var BlackListedUrl = get_blacklistedurl_model();
  BlackListedUrl.find({
    url: _url,
    host_and_port: _host_and_port
  }, function(err, url) {
    if (err) {
      return err;
    }
    console.log('[] url: ' + JSON.stringify(url));
    callback(url);
  });
};

exports.find_all = function(callback) {
  var BlackListedUrl = get_blacklistedurl_model();
  BlackListedUrl.find(function(err, urls) {
    if (err) {
      return err;
    }
    console.log('[] urls: ' + JSON.stringify(urls));
    callback(urls);
  });
};

