var express = require('express');
var app = express();
var fs = require('fs');
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var dbstat = "error";

// Connect to the db
MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
    if(err) {
        return console.dir(err);
    }
    dbstat = "connected";
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app
    .get('/', function(request, response) {
        fs.readFile('./index.html', function(err, contents) {
            response.write(contents);
            response.end();
        });
    })

    .get('/dbstat', function(request, response) {
        response.write(dbstat);
        response.end();
    })

    .get('/add', function(request, response) {
        var gname = request.param("name");
        var glocation = request.param("location");
        var gtype = request.param("type");
        MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
            if (err) {
                return console.dir(err);
            }
            var collection = db.collection('restaurants');
            var item = {name:gname, location:glocation, type:gtype};
            collection.insert(item);
        });
        response.write("added");
        response.end();
    })

    .get('/restaurants',function(request, response) {
        var restaurants = "";
        MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
            if (err) {
                return console.dir(err);
            }
            var collection = db.collection('restaurants');
            collection.find().toArray(function(err, items) {restaurants = JSON.stringify(items);});
        });
        response.write(restaurants);
        response.end();
    })

    .get('/:name',function(request, response) {
        response.write("Hello " + request.params.name);
        response.end();
    });

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

