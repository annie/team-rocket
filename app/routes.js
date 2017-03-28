module.exports = function(app) {

    app.get("/", function (req, res) {
        res.send("Hello world");
    });

    app.listen(3000, function() {
        console.log("sup");
    });

};