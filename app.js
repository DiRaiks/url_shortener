var express = require('express');
var app = express();
var path = require('path'); //относительный путь
var bodyParser = require('body-parser'); //промежуточный обработчик json. Преобразовывает данные и передает управление обработчикам
var mongoose = require('mongoose');
var base58 = require('./base58.js'); //подключение кодера/декодера
var Url = require('./Shema'); //подключение моедли схемы

app.use(express.static(path.join(__dirname, 'view')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// подключение к монго и вывод сообщения
var db = mongoose.createConnection('mongodb://localhost/url_shortener');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('connection!')
});


app.get('/', function(req, res) {
    //маршрут галвной страницы
    res.sendFile(path.join(__dirname, 'view/index.html'));
});

app.post('/api_short', function(req, res) {
    //создание и возврат укороченного url
    longUrl = req.body.url;
    shortUrl = '';
    console.log(longUrl);

    // поиск одного совпадения
    Url.findOne({long_url: longUrl}, function(err, item) {
        if (item) {
            shortUrl = 'http://localhost:8080/' + base58.encode(item._id); //берет номер записи из бд и кодирует
            res.send({'shortUrl': shortUrl}); //отвечает наденным url
            console.log("kek" + item);
        } else {
            var newUrl = Url;
            var newUrl = Url({
                long_url: longUrl,
                short_url: shortUrl
            }); //экземпляр для модели

            //сохранение в бд
            newUrl.save(function(err) {
                if (err) {
                    console.log(err);
                }


                shortUrl = 'http://localhost:8080/' + base58.encode(newUrl._id); //берет новый номер из бд и кодирует
                var col = db.collection("urls");
                col.findOneAndUpdate({
                        long_url: longUrl
                    }, // критерий выборки
                    {$set: {short_url: shortUrl}
                    } // параметр обновления
                );
                res.send({'shortUrl': shortUrl}); //отвечает полученным сокращенным url
            });
        }
    })

});

app.get('/', function(req, res) {
    //маршрут перенаправления с укороченного


});

var server = app.listen(8080, function() {
    console.log('Server listen on 8080');
    console.log(mongoose.version);
});
