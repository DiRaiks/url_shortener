var express = require('express');
var app = express();

app.get('/', function(req,res) {
  //маршрут галвной страницы
  res.send('Hello world');
});

app.post('/', function(req,res) {
  //создание и возврат укороченного url
});

app.get('/', function(req,res) {
  //маршрут перенаправления с укороченного
});

var server = app.listen(8080, function() {
  console.log('Server l on 8080');
});
