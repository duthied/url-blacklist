// ----------------------------------------------------------------------
// test interaction w/ the model
// ----------------------------------------------------------------------

var config = require('../config').settings,
  mongoose = require('./helpers/mongoose_test_wrapper'),
  BlackListedUrl = require('../models/blacklistedurl');

// this is executed prior to a test run
exports.setUp = function(callback) {
  mongoose.connect('mongodb://localhost/' + config.test_db_db);
  BlackListedUrl.remove({}, function(err) {
    callback();
  });
};

// this is executed after a test run
exports.tearDown = function(callback) {
  mongoose.disconnect();
  callback();
};

exports['model'] = function (test) {
  test.expect(2);

  var _host_and_port = 'foo.com',
    _url = 'a_test';

  var blacklisted_url = new BlackListedUrl({
    host_and_port: _host_and_port,
    url: _url
  });

  test.equal(_host_and_port, blacklisted_url.host_and_port);
  test.equal(_url, blacklisted_url.url);

  test.done();
};