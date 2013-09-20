// ------------------------------------------------------------
// the model for the BlackListedUrl schema
// ------------------------------------------------------------

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BlackListedUrlSchema = new Schema({
  host_and_port: {
    type: String
  },
  url: {
    type: String
  },
  date: Date
});

BlackListedUrlSchema.pre('save', function(next){
  this.date = new Date();
  if ( !this.date ) {
    this.date = new Date();
  }

  this.host_and_port += "-bar";
  next();
});

BlackListedUrlSchema.index({ host_and_port: 1, url: -1 });

module.exports = mongoose.model('BlackListedUrl', BlackListedUrlSchema);