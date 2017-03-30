// setup
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 8080;

// create db
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;
db.once("open", function () {
    console.log("connected to db!");
});

// config
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes
require("./app/routes.js")(app);

// start app
app.listen(PORT);
console.log("App listening on port " + PORT);