var express = require('express');
var app = express();
var path = require('path'); //относительный путь
var mysql = require('mysql');

var connection = mysql.createConnection

app.get('/', function(req, res) {
  //маршрут галвной страницы
  res.sendFile(path.join(__dirname, 'view/index.html'));
});

app.post('/', function(req,res) {
  //создание и возврат укороченного url
});

app.get('/', function(req,res) {
  //маршрут перенаправления с укороченного
});

var server = app.listen(8080, function() {
  console.log('Server listen on 8080');
  console.log(mongoose.version);
});
