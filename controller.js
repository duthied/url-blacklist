// ------------------------------------------------------------
// this file can be replaced with some other ORM/db wrapper
// ------------------------------------------------------------

var config = require('./config').settings,
  mongoose = require('mongoose'),
  BlackListedUrl = require('./models/blacklistedurl');

mongoose.set('debug', true);

Controller = function() {
  this.mongoose = mongoose;
  this.mongoose.connect(config.db_host + ":" + config.db_port + "/" + config.db_db);

  this.connection = mongoose.connection;
  this.connection.on('error', console.error);
  that = this;

  this.connection.once('open', function() {
    that.BlackListedUrl = BlackListedUrl;
  });
};

// --------------------------------------------------------------
// create a url object and return it if it doesn't already exist
// --------------------------------------------------------------
Controller.prototype.create = function(_host_and_port, _url, success_callback, error_callback) {
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
        var BlackListedUrl = that.BlackListedUrl;
        var u = new BlackListedUrl({
          url: _url,
          host_and_port: _host_and_port
        });

        u.save(function(err, new_url) {
          if (err)  {
            console.error(err);
            error_callback(err);
          }
          console.log('[controller] new url: %s', JSON.stringify(new_url));
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
Controller.prototype.findOne = function(_host_and_port, _url, success_callback, error_callback) {
  this.BlackListedUrl.find({
    url: _url,
    host_and_port: _host_and_port
  }, function(err, url) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[controller] urls: %s', JSON.stringify(url));
    success_callback(url);
  });
};

// ----------------------------------------------
// get all url objects in the db and return them
// ----------------------------------------------
Controller.prototype.findAll = function(success_callback, error_callback) {
  this.BlackListedUrl.find(function(err, urls) {
    if (err)  {
      console.error(err);
      error_callback(err);
    }
    console.log('[controller] urls: %s', JSON.stringify(urls));
    success_callback(urls);
  });
};

exports.Controller = Controller;
