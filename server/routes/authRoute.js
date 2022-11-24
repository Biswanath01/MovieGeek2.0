const express = require("express");
const router = express.Router();
const AuthModel = require("../models/authModel");
const uuid = require("uuid");

router.post("/register/", (req, res) => {
    const { userName, email, password } = req.body;
    AuthModel.findOne({
        userName: userName,
        email: email
    }, (err, loginData) => {
        if(err){
            return res.send({
                success: false,
                message: `Update Internal Server Error ${err}`
            });
        }
        console.log(loginData);

        if(loginData !== null){
            return res.status(200).send({
                message: "An account with the given credentials already exists!"
            });
        } 

        const newModel = new AuthModel;
        newModel.userId = uuid.v4();
        newModel.userName = userName;
        newModel.email = email;
        newModel.password = password;
        newModel.createdAt = Date.now();

        newModel.save((error, data) => {
            if(error){
                console.log(`This is for save: ${error}`);
                return res.json({
                    success: false,
                    message: `Save Internal Server Error ${error}`
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Added user to db",
                data: {
                    userName: data.userName,
                    userId: data.userId,
                    createdAt: data.createdAt,
                    email: data.email
                }
                //data: data
            });
        });
    });
});

router.post("/login/", (req, res) => {
    const { userName, password } = req.body;

    AuthModel.findOne({
        userName: userName,
        password: password
    }, (err, loginData) => {
        if(err){
            return res.send({
                success: false,
                message: `Internal Server Error ${err}`
            });
        }
        console.log(loginData);

        if(loginData == null){
            res.status(200).send({
                message: "No User Found with given credentials"
            });
        } else {
            res.send({
                success: true,
                message: "Logged in successfully",
                data: {
                    userName: loginData.userName,
                    userId: loginData.userId,
                    createdAt: loginData.createdAt,
                    email: loginData.email
                }
                //data: loginData
            });
        }
    });
});

module.exports = router;