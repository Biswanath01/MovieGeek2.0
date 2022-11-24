var mongoose = require("mongoose");

const watchlistModel = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    moviesToWatch: {
        type: Array
    },
    moviesWatched: {
        type: Array
    },
    favourites: {
        type: Array
    }
});

module.exports = mongoose.model("watchlistModel", watchlistModel);