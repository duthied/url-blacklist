// ------------------------------------------------------------
// this file can be replaced with some other ORM/db wrapper
// ------------------------------------------------------------

var config = require('../config').settings;
var mongoose = require('mongoose');
mongoose.set('debug', true);

URLProvider = function() {
  this.mongoose = mongoose;
  this.mongoose.connect(config.db_host + ":" + config.db_port + "/" + config.db_db);

  this.connection = mongoose.connection;
  this.connection.on('error', console.error);
  that = this;

  this.connection.once('open', function() {
    that.BlackListedUrlSchema = new mongoose.Schema({
      host_and_port: {
        type: String
      },
      url: {
        type: String
      },
      date: Date
    });
    that.BlackListedUrlSchema.index({ host_and_port: 1, url: -1 });
    that.BlackListedUrl = mongoose.model('BlackListedUrl', that.BlackListedUrlSchema);
  });
};

// --------------------------------------------------------------
// create a url object and return it if it doesn't already exist
// --------------------------------------------------------------
URLProvider.prototype.createUrl = function(_host_and_port, _url, success_callback, error_callback) {
  that = this;
  // until I can get indexes working correctly, manually check for a dupe before creating
  this.findOne(_host_and_port, _url,
    function (result) { // success
      var body = JSON.stringify(result);
      console.log('body: %s', body);
      if (result.length > 0) {
        // entry already exists...
        err = 'this entry already exists, not adding';
        console.error(err);
        error_callback(err);
      } else {
        // not found, create
        var BlackListedUrl = that.mongoose.model('BlackListedUrl', this.BlackListedUrlSchema);
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
          console.log('[db.js] new url: %s', JSON.stringify(new_url));
          success_callback(new_url);
        });
      }
    },
    function (err) { // failure
      console.error(err.stack);
      sendPlainTextResult(res, err);
    }
  );
};

// ----------------------------------
// find one url object and return it
// ----------------------------------
URLProvider.prototype.findOne = function(_host_and_port, _url, success_callback, error_callback) {
  this.BlackListedUrl.find({
    url: _url,
    host_and_port: _host_and_port
  }, function(err, url) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[db.js] urls: %s', JSON.stringify(url));
    success_callback(url);
  });
};

// ----------------------------------------------
// get all url objects in the db and return them
// ----------------------------------------------
URLProvider.prototype.findAll = function(success_callback, error_callback) {
  this.BlackListedUrl.find(function(err, urls) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[db.js] urls: %s', JSON.stringify(urls));
    success_callback(urls);
  });
};

exports.URLProvider = URLProvider;