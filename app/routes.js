var path = require("path");

var User = require("./models/User");

module.exports = function(app) {

    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "kirby.html"));
    });

    app.post("/", function (req, res) {
        var newUser = new User({
            userId: "23875840",
            highScore: 0
        });

        newUser.save(function (err, newUser, numAffected) {
            if (err) {
                console.log("there was an error");
            }
            console.log("newUser: " + newUser.userId);
            console.log("numAffected: " + numAffected);
        });
    });

    app.listen(3000, function() {
        console.log("listening on port 3000");
    });

};