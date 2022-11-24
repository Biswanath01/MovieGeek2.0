var mongoose = require("mongoose");

const profileModel = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    publicName: {
        type: String,
        required: true
    },
    tag: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    likedGenres: {
        type: Array,
        required: true
    },
    profilePic: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model("profileModel", profileModel);