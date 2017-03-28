// setup
var express = require("express");
var app = express();

var PORT = process.env.PORT || 8080;

// routes
require("./app/routes.js")(app);

// start app
app.listen(PORT);
console.log("App listening on port " + PORT);