var mongoose = require('mongoose');
var config = require('./config'); //файл конфигурации
var db = mongoose.createConnection('mongodb://' + config.db.host + '/' + config.db.name);

//первый счетчик - для удобство поиска по базе и обнавления значения.
var counterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  count: {type: Number, default: 0}
});
var counter = db.model("counter", counterSchema);

var urlSchema = new mongoose.Schema( {
  _id: {type: Number, index: true},
  long_url: String,
  short_url: String,
  created_at: Date
});

urlSchema.pre('save', function(next){
  var item = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {count: 1}}, function(error, counter) {
    if (error){
      return next(error);
    }
    item._id = counter.count;
    item.created_at = new Date();
    next();
  });
});

var Url = db.model("Url", urlSchema);//создание модели по схеме
module.exports = Url;
