// ------------------------------------------------------------
// required to ensure the models and schema get reset
//  between test runs (for use w/ grunt, etc.)
// ------------------------------------------------------------

var mongoose = require('mongoose');
mongoose.resetSchemas = function() {
  this.modelSchemas = {};
  this.models = {};
};
module.exports = mongoose;