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

exports.create_url = function(_host_and_port, _url, success_callback, error_callback) {
  var BlackListedUrl = get_blacklistedurl_model();
  var create_date = new Date();
  var u = new BlackListedUrl({
    url: _url,
    host_and_port: _host_and_port,
    date: create_date
  });

  u.save(function(err, new_url) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.dir(new_url);
    success_callback(new_url);
  });
};

exports.find_one = function(_host_and_port, _url, success_callback, error_callback) {
  var BlackListedUrl = get_blacklistedurl_model();
  BlackListedUrl.find({
    url: _url,
    host_and_port: _host_and_port
  }, function(err, url) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[] url: ' + JSON.stringify(url));
    success_callback(url);
  });
};

exports.find_all = function(success_callback, error_callback) {
  var BlackListedUrl = get_blacklistedurl_model();
  BlackListedUrl.find(function(err, urls) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[] urls: ' + JSON.stringify(urls));
    success_callback(urls);
  });
};

