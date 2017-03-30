var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    userId: String,
    highScore: Number
})