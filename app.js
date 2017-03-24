var express = require('express');
var app = express();
var path = require('path'); //относительный путь
var bodyParser = require('body-parser'); //промежуточный обработчик json. Преобразовывает данные и передает управление обработчикам
var mongoose = require('mongoose');
var base58 = require('./base58.js'); //подключение кодера/декодера
var config = require('./config'); //файл конфигурации
var Url = require('./Shema'); //подключение моедли схемы
var request = require('request');

app.use(express.static(path.join(__dirname, 'view')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// подключение к монго и вывод сообщения
var db = mongoose.createConnection('mongodb://' + config.db.host + '/' + config.db.name);
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
    longUrl = req.body.url; //данные поля с длинным url
    input_short = req.body.input_short; //данные поля с коротким url
    shortUrl = '';
    //проверка на валидность url
    request(longUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // поиск одного совпадения
            Url.findOne({
                long_url: longUrl
            }, function(err, item) {
                if (item) //если длинный url  найден
                {
                    if (input_short) {
                        res.send({'shortUrl': "url уже в базе: " + config.webhost + item.short_url});
                    } else {
                        res.send({'shortUrl': "url уже в базе: " + config.webhost + item.short_url}); //отвечает найденным url
                    }
                } else //Длинный url не найден
                {
                    var newUrl = Url;
                    var newUrl = Url({
                        long_url: longUrl,
                        short_url: shortUrl
                    }); //экземпляр для модели

                    if (input_short) //если поле с коротким url заполнено
                    {
                        var col = db.collection("urls");
                        //поиск короткого url по базе
                        col.findOne({short_url: input_short}, function(err, word) {
                            if (word) //короткий url найден
                            {
                                res.send({'shortUrl': "имя занято"}); //отвечает, что имя занято, сохранение не просиходит
                            } else {
                                shortUrl = input_short; // присваивает значение из поля короткого url
                                //сохранение в бд
                                newUrl.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    var col = db.collection("urls");
                                    // поиск в только что сохраненной коллекции и добавление короткого url. Сделано так, потому что перед сохранением просиходят определенные оперции в Shema.js
                                    col.findOneAndUpdate({long_url: longUrl}, // критерий выборки
                                        {$set: {short_url: shortUrl}} // параметр обновления
                                    );
                                    res.send({'shortUrl': config.webhost + shortUrl}); //отвечает полученным сокращенным url
                                });
                            }
                        });


                    } else //поле с коротким url незаполнено
                    {

                        //сохранение в бд
                        newUrl.save(function(err) {
                            if (err) {
                                console.log(err);
                            }
                            shortUrl = base58.encode(newUrl._id); //берет новый номер из бд и кодирует
                            var col = db.collection("urls");
                            col.findOneAndUpdate({long_url: longUrl}, // критерий выборки
                                {$set: {short_url: shortUrl}} // параметр обновления
                            );
                            res.send({'shortUrl': config.webhost + shortUrl}); //отвечает полученным сокращенным url
                        });

                    }
                }
            })

        } else //url недействителен
        {
            res.send({'shortUrl': "недействительный url"});
        }
    });

});

app.get('/:encoded_id', function(req, res) {
    //маршрут перенаправления с укороченного
    var base58ID = req.params.encoded_id;

    //поиск короткого url  без декодирования (если задавался личный)
    Url.findOne({short_url: base58ID}, function(err, item) {
        if (item) {
            res.redirect(item.long_url);
        } else //если не найден - деодирование и поиск по _id
        {
            var id = base58.decode(base58ID);
            Url.findOne({_id: id}, function(err, item) {
                if (item) {
                    //redirect - перенаправление на long_url
                    res.redirect(item.long_url);
                } else {
                    console.log('not found');
                }
            });
        }
    });
});
var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
    console.log('Server listen on 8080');
    console.log(mongoose.version);
});
