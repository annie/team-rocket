// setup
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var path = require("path");
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 8080;

// mongoose.Promise = global.Promise;



// var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

// var userSchema = new Schema({
// 	username: String,
//   	password: String
//   });

// userSchema.plugin(passportLocalMongoose);	

// var User = mongoose.model('User', userSchema);
// module.exports = User;

// config
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


// passport config
// var user = require('./app/models/User.js');
// passport.use(new LocalStrategy({
//    usernameField: 'email'
// }, function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.verifyPassword(password)) { return done(null, false); }
//       console.log("in the local strategy ");
//       return done(null, user);
//     });
//   }
//   ));

var User = require('./app/models/User.js');

passport.use(new LocalStrategy(
	function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
	));


// passport.use('local-signup', new LocalStrategy(
// // {
// // 	usernameField: 'username',
// // 	passwordField: 'password',
// // 	passReqToCallback: true
// // }
// // function(username, password, done) {
// // 	process.nextTick(function () { 
// // 		User.findOne({'username' : username}, function(err, user) {
// // 			if (err)
// // 				return done(err);
// // 			if (user) {
// // 				return done(err);
// // 			} else {
// // 				var newUser = new User();

// // 				newUser.username = username;
// // 				newUser.password = newUser.generateHash(password);
// // 			}

// // 		})
// // 	})
// // }
// 	function(username, password, done) {
// 	console.log("in the local strategy func");
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// 	));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// create db
mongoose.connect("mongodb://localhost/test");
var db = mongoose.connection;
db.once("open", function () {
    console.log("connected to db!");
});

// routes
require("./app/routes.js")(app);
// require('./node_modules/passport')(passport);


// start app
app.listen(PORT);
console.log("App listening on port " + PORT);	
