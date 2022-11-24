var mongoose = require("mongoose");

const authModel = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
    }
});

module.exports = mongoose.model("authModel", authModel);