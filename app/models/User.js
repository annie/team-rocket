const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	username: String,
  	password: String
  });

userSchema.plugin(passportLocalMongoose);	

var User = mongoose.model('User', userSchema);
module.exports = User;
