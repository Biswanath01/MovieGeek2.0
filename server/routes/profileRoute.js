const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const ProfileModel = require("../models/profileModel");
const AuthModel = require("../models/authModel");
const path = require("path");
const time = Date.now();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

let upload = multer({
    storage,
    fileFilter
});

router.post('/create-profile/:userId/', upload.single('image'), (req, res) => {
    const { dp, name, age, likedGenres } = req.body;

    const userId = req.params.userId;
    const newModel = new ProfileModel;
    newModel.userId = userId;
    newModel.tag = Math.floor(1000 + Math.random() * 9000);
    newModel.profilePic = {
        data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
        contentType: req.file.mimetype
    }
    newModel.publicName = name;
    newModel.age = age;
    JSON.parse(likedGenres).map((genre) => newModel.likedGenres.push(genre));

    newModel.save((err, data) => {
        if(err){
            res.send({
                success: "False",
                message: "An error occurred",
                error: err
            });
        }

        res.status(200).send({
            success: "Added to db and created profile",
            data: {
                tag: data.tag,
                userId: data.userId,
                name: data.publicName
            }
        });
    });

    const dirPath = path.join(__dirname, '../uploads/');
    fs.readdir(dirPath, (err, images) => {
        if (err) {
            console.log('Unable to scan directory: ' + err);
        } 

        images.forEach((image) => {
            fs.unlink(dirPath + image, (e) => console.log(e));
        });
    });
});

router.post('/get-profile-data/', (req, res) => {
    const { userId } = req.body;
    ProfileModel.findOne({
        userId: userId
    }, (err, profileData) => {
        if(err){
            return res.send({
                message: err
            });
        }

        if(profileData){
            const b64 = Buffer.from(profileData.profilePic.data).toString('base64');
            const mimeType = profileData.profilePic.contentType;

            return res.status(200).send({
                profile: {
                    publicName: profileData.publicName,
                    tag: profileData.tag,
                    dp: `data:${mimeType};base64,${b64}`
                }
            });
        } else {
            return res.send({
                message: "No existing profile for this userId"
            });
        }
    });
});

module.exports = router;