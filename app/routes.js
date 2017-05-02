var path = require("path");
var express = require('express');
var passport = require('passport');
var Map = require("../app/models/Map.js");
var User = require("../app/models/User.js")

module.exports = function(app) {

    // app.get("/", function (req, res) {
    //     res.sendFile(path.join(__dirname, "../public", "kirby.html"));
    // });

    // app.post("/", function (req, res) {
    //     var newUser = new User({
    //         userId: "23875840",
    //         highScore: 0
    //     });

    //     newUser.save(function (err, newUser, numAffected) {
    //         if (err) {
    //             console.log("there was an error");
    //         }
    //         console.log("newUser: " + newUser.userId);
    //         console.log("numAffected: " + numAffected);
    //     });

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "login.html"));
    });

    app.get("/login", function (req, res) {

        res.sendFile(path.join(__dirname, "../public", "login.html"));
        // console.log("hello");
    });

  //   app.post('/login',
  // passport.authenticate('local', function(req, res){
  //   console.log("passport user", req);}
                                   
  //                       ));

     app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/maps' }
                                   
                        ));


    // app.post("/login", passport.authenticate('local'), function (req, res) {
    //     console.log("in the login post!");
    //     res.redirect('/game');
    // });

    app.get("/game", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "home.html"));
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
        console.log("in signup function get");
        res.sendFile(path.join(__dirname, "../public", "signup.html"));
        
    });

     app.post("/signup", function (req, res) {
        //res.redirect('/login');
        console.log("in signup function post " + req.body.userId);
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
    //     user.save();
    //     // user.save(function(err) {
    //     //     if (err) throw err;

    //     //     console.log('User ' + user.usrName + ' saved successfully!');
    //     // });
    //     console.log("json " + JSON.stringify(user));
    // });
        

    // app.post("/signup", passport.authenticate('local-signup', {
    //     successRedirect : '/game', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    // }));

    // //     function (req, res) {
    // //     console.log("in signup function post");
    // //     User.register(new User({ username : req.body.usrName }), req.body.password, function(err, user) {
    // //     if (err) {
    // //         return res.render('register', { user : user });
    // //     }

    // //     passport.authenticate('local')(req, res, function () {
    // //         res.session.save();
    // //         res.redirect('/login');
    // //     });
    // // });
    //     //console.log("checking if req works " + req.body.usrName);
    //     // var userConsole = req.body;
    //     // var userConsole = {
    //     //     usrName: req.body.usrName,
    //     //     email: req.body.email,
    //     //     userId: req.body.userId,
    //     //     password: req.body.password,
    //     //     score: req.body.score
    //     // }
    //     // var user = new User ({ 
    //     //     usrName: req.body.usrName,
    //     //     email: req.body.email,
    //     //     userId: req.body.userId,
    //     //     password: req.body.password,
    //     //     score: req.body.score
    //     // });
    //     // user.save();
    //     // user.save(function(err) {
    //     //     if (err) throw err;

    //     //     console.log('User ' + user.usrName + ' saved successfully!');
    //     // });
    //     // console.log("json " + JSON.stringify(user));
        
    // // });

    app.post("/save", function (req, res) {
        console.log("saving map!!");
        console.log(req.body.new_map_name);
        console.log(req.body.new_serialized_map);

        // var map = JSON.parse(req.body.serialized_map);
        var newMap = new Map({
            mapId: req.body.new_map_name,
            userId: req.body.new_user,
            entities: req.body.new_serialized_map
        });
        newMap.save(function (err, doc, rows) {
            if (err) {
                console.log("error code: " + err.code);
                console.log("error saving newMap");
            }
        });
    });

    app.get("/maps", function (req, res) {
        res.sendFile(path.join(__dirname, "../public", "maps.html"));
    })

    app.get("/:mapId", function (req, res) {
        // console.log(req.params);
        // console.log()
        res.sendFile(path.join(__dirname, "../public", "game_map.html"));
    });

    app.get("/maps/loadAllMaps", function (req, res) {
        Map.find({}, function (err, docs) {
            if (err) {
                console.log("load all maps error");
            }
            else {
                res.send(JSON.stringify(docs));
            }
        });
    });

    app.get("/load/:mapIdToGet", function (req, res) {
        console.log("sending a map to load!");
        Map.findOne({mapId: req.params["mapIdToGet"]}, function (err, doc) {
            if (err) {
                console.log("find error");
            }
            else {
                console.log(doc);
                res.contentType('json');
                if (req.params["mapIdToGet"] == "game") {
                    res.send(JSON.stringify([]));
                }
                else {
                    res.send(doc.entities);
                }
            }
        });

    });

    app.listen(3000, function() {
        console.log("listening on port 3000");
    });

};