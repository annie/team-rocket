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
        var score = {
            userId: req.body.userId,
            val: req.body.val
        }
        // console.log("score: " + score.val);
        // console.log("user: " + score.userId);
    });

    app.get("/signup", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "signup.html"));
        
    });

    app.post("/signup", function (req, res) {
        // alert(req.body.userId);
        var user = {
            userId: req.body.userId,
            score: req.body.score
        }
        console.log("User: hello " + user.userId);
        console.log("Score: " + user.score);
        
    });

    app.listen(3000, function() {
        console.log("listening on port 3000");
    });

};