var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    userId: String,
    map: String
})