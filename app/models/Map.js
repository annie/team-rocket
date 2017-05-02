var mongoose = require("mongoose");

module.exports = mongoose.model("Map", {
    mapId: String,
    userId: String,
    entities: String
})