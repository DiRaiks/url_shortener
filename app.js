var express = require('express');
var app = express();
var path = require('path'); //относительный путь
var mongoose = require('mongoose');
var base58 = require('./base58');//подключение кодера/декодера
var Url = require('./Shema');//подключение моедли схемы

//подключение к монго и вывод сообщения
var db = mongoose.createConnection('mongodb://localhost/url_shortener');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('connection!')
});

app.get('/', function(req, res) {
  //маршрут галвной страницы
  res.sendFile(path.join(__dirname, 'view/index.html'));
});

app.post('/', function(req,res) {
  //создание и возврат укороченного url
  longUrl = qqqqqq;
  //поиск одного совпадения
Url.findOne({long_url: longUrl}, function(err, item) {
  console.log(item);
})
});

app.get('/', function(req,res) {
  //маршрут перенаправления с укороченного
});

var server = app.listen(8080, function() {
  console.log('Server listen on 8080');
  console.log(mongoose.version);
});
