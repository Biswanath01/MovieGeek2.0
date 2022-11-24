var mongoose = require("mongoose");

const discussionModel = new mongoose.Schema({
    authorId: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    message: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("discussionModel", discussionModel);