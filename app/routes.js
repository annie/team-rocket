var path = require("path");

var User = require("./models/User");

module.exports = function(app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "index.html"));
    });

    app.post("/", function (req, res) {
        var score = {
            userId: req.body.userId,
            val: req.body.val
        }
        console.log("score: " + score.val);
    });

    app.listen(3000, function() {
        console.log("listening on port 3000");
    });

};