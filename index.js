var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var restaurants = "";

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app
    .get('/', function(request, response) {
        fs.readFile('./index.html', function(err, contents) {
            response.write(contents);
            response.end();
        });
    })

    .get('/add', function(request, response) {
        var gname = request.param("name");
        var glocation = request.param("location");
        var gtype = request.param("type");
        MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
            if (err) {
                response.write("שגיאה");
                response.end();
                return console.dir(err);
            }
            var collection = db.collection('restaurants');
            var item = {name:gname, location:glocation, type:gtype};
            collection.insert(item);
            //response.redirect("/add-item?added=true");
            response.send("נוסף בהצלחה");
        });
    })

    .get('/remove', function(request, response) {
        var gid = request.param("id");
        MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
            if (err) {
                return console.dir(err);
            }
            var collection = db.collection('restaurants');
            collection.remove({_id: new mongodb.ObjectID(gid)});
            collection.find().toArray(function(err, items) {
                restaurants = JSON.stringify(items);
                response.write(restaurants);
                response.end();
            });
        });
    })

    .get('/shalev', function(request, response) {
        var options = {
            host: 'www.sdarot.pm',
            path: '/series'
        };

        callback = function(res) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            res.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            res.on('end', function () {
                var list = str.getElementsByClassName("category_box");
                list.forEach(function(series){
                    var obj = {Name:series.getElementsByClassName("lazy")[0].alt, Link:series.getElementsByTagName("a")[0].href, Image:series.getElementsByClassName("lazy")[0].src};
                    response.write(JSON.stringify(obj));
                });
                response.end();
            });
        };

        http.request(options, callback).end();
    })

    .get('/restaurants',function(request, response) {
        MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
            if (err) {
                return console.dir(err);
            }
            var collection = db.collection('restaurants');
            collection.find().toArray(function(err, items) {
                restaurants = JSON.stringify(items);
                response.write(restaurants);
                response.end();
            });
        });
    });

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

