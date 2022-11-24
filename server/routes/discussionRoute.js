const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const DiscussionModel = require("../models/discussionModel");
const ProfileModel = require("../models/profileModel");

router.post('/add-comment/', (req, res) => {
    const { userId, movieId, message } = req.body;

    const newModel = new DiscussionModel;
    newModel.authorId = userId;
    newModel.movieId = movieId;
    newModel.commentId = uuid.v4();
    newModel.createdAt = Date.now();
    newModel.message = message;

    newModel.save((saveErr, data) => {
        if(saveErr){
            return res.status(500).send({
                error: saveErr
            });
        } else {
            return res.status(200).send({
                message: "Successfully added comment",
                data: data
            });
        }
    });
});

router.post('/get-comments/', async (req, res) => {
    const { movieId } = req.body;
    const commentData = await DiscussionModel.find({ 
        movieId: movieId 
    });
    if (commentData.length === 0) {
        return res.status(400).send({
            message: 'No comments found for this movie',
        });
    }

    const data = [];
    for (const p of commentData) {
        console.log(p.authorId);
        var ddd = await ProfileModel.findOne({
            userId: p.authorId,
        });

        let b_dp64 = Buffer.from(ddd.profilePic.data).toString('base64');
        let dpMimeType = ddd.profilePic.contentType;
        let dpUrl = `data:${dpMimeType};base64,${b_dp64}`;

        const obj = {
            authorId: p.authorId,
            commentId: p.commentId,
            dp: dpUrl,
            comment: {
                authorName: ddd.publicName,
                creationDate: p.createdAt,
                message: p.message,
            },
        };

        data.push(obj);
    }

    return res.status(200).send({
        comments: data,
    });
});


module.exports = router;