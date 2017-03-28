// setup
var express = require("express");
var path = require("path");
var app = express();

var PORT = process.env.PORT || 8080;

// config
app.use(express.static(path.join(__dirname, 'public')));

// routes
require("./app/routes.js")(app);

// start app
app.listen(PORT);
console.log("App listening on port " + PORT);