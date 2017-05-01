var path = require("path");
var express = require('express');
var passport = require('passport');
// var User = require("./app/models/User.js");

module.exports = function(app) {

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "login.html"));
    });

    app.get("/login", function (req, res) {

        res.sendFile(path.join(__dirname, "../public", "login.html"));
        // console.log("hello");
    });

    app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/game' }
                                   
                        ));

    // app.post("/login", passport.authenticate('local'), function (req, res) {
    //     console.log("in the login post!");
    //     res.redirect('/game');
    // });

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
        console.log("in signup function post");
        res.sendFile(path.join(__dirname, "../public", "signup.html"));
        
    });

    app.post("/signup", function (req, res) {
        console.log("in signup function post");
        User.register(new User({ username : req.body.usrName }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.session.save();
            res.redirect('/login');
        });
    });
        //console.log("checking if req works " + req.body.usrName);
        // var userConsole = req.body;
        // var userConsole = {
        //     usrName: req.body.usrName,
        //     email: req.body.email,
        //     userId: req.body.userId,
        //     password: req.body.password,
        //     score: req.body.score
        // }
        // var user = new User ({ 
        //     usrName: req.body.usrName,
        //     email: req.body.email,
        //     userId: req.body.userId,
        //     password: req.body.password,
        //     score: req.body.score
        // });
        user.save();
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