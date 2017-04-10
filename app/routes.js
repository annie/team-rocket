var path = require("path");

var User = require("./models/User");

module.exports = function(app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "login.html"));
        // console.log("hello");
    });

    app.post("/", function (req, res) {
        // var score = {
        //     userId: req.body.userId,
        //     val: req.body.val
        // }
        // console.log("score: " + score.val);
        // console.log("user: " + score.userId);
    });

    app.get("/game", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "smth.html"));
        // console.log("hello");
    });

    app.post("/game", function (req, res) {
        // var score = {
        //     userId: req.body.userId,
        //     val: req.body.val
        // }
        // console.log("score: " + score.val);
        // console.log("user: " + score.userId);
    });

    app.get("/signup", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "signup.html"));
        
    });

    app.post("/signup", function (req, res) {
        //console.log("checking if req works " + req.body.usrName);
        var userConsole = req.body;
        // var userConsole = {
        //     usrName: req.body.usrName,
        //     email: req.body.email,
        //     userId: req.body.userId,
        //     password: req.body.password,
        //     score: req.body.score
        // }
        var user = new User (userConsole);
        // user.save(function(err) {
        //     if (err) throw err;

        //     console.log('User ' + user.usrName + ' saved successfully!');
        // });
        console.log("json " + JSON.stringify(user));
        
    });

    app.listen(3000, function() {
        console.log("listening on port 3000");
    });

};