var express = require('express');
var app = express();
var fs = require('fs');
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var dbstat = "error";
var dbitems = "";

// Connect to the db
MongoClient.connect("mongodb://dbuser:123456@ds043082.mongolab.com:43082/restaurants", function(err, db) {
    if(err) {
        return console.dir(err);
    }

    dbstat = "connected";
    //db.createCollection('restaurants', function(err, collection) {});
    var car = {name:"Shelis", location:"Netivot", Type:"Halavit"};
    //db.restaurants.insert(car);
    //dbitems = db.restaurants.find();

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
        response.write("<html><body>" + dbstat +"<br><br>" + dbitems + "</body></html>");
        response.end();
    })

    .get('/dbstat', function(request, response) {

    })

    .get('/:name',function(request, response) {
        response.write("Hello " + request.params.name);
        response.end();
    });

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

