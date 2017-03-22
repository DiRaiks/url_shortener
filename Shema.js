var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema( {
  count: {type: Number, default: 0, index: true},
  long_url: String,
  short_url: String,
  created_at: Date
});

var Url = mongoose.model('Url', urlSchema);//создание модели по схеме
module.exports = Url;
