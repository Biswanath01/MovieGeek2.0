const express = require("express");
const router = express.Router();
const WatchListModel = require("../models/watchlistModel");

router.post(`/add-to-watchlist/`, (req, res) => {
    const { userId, movie } = req.body;

    WatchListModel.findOne({
        userId: userId
    }, (findErr, data) => {
        if(findErr){
            return res.send({
                err: findErr
            });
        }

        if(data === null){
            const newModel = new WatchListModel;
            newModel.userId = userId;
            newModel.moviesToWatch = [movie]
            newModel.moviesWatched = []
            newModel.favourites = []

            newModel.save((saveErr, watchData) => {
                if(saveErr){
                    return res.send({
                        err: saveErr
                    });
                }

                return res.status(200).send({
                    success: "True",
                    message: "Added movie to watchlist",
                    data: watchData
                });
            });
        } else {
            WatchListModel.findOneAndUpdate({
                userId: userId
            }, {
                $push: { "moviesToWatch": movie }
            }, (updateErr, watchData) => {
                if(updateErr){
                    return res.send({
                        err: updateErr
                    });
                }
    
                return res.status(200).send({
                    success: "True",
                    message: "Added movie to watchlist",
                    data: watchData
                });
            });
        }
    });
});

router.post('/remove-from-watchlist/', (req, res) => {
    const { userId, movie } = req.body;

    WatchListModel.findOneAndUpdate({
        userId: userId
    }, {
        $pull: { "moviesToWatch": movie },
        $push: { "moviesWatched": movie }
    }, (deleteErr, watchData) => {
        if(deleteErr){
            return res.send({
                err: deleteErr
            });
        }

        return res.status(200).send({
            message: "Successfully removed from watchlist",
            data: watchData
        });
    });
});

router.post('/add-to-favourites/', (req, res) => {
    const { userId, movie } = req.body;

    WatchListModel.findOne({
        userId: userId
    }, (findErr, data) => {
        if(findErr){
            return res.send({
                err: findErr
            });
        }

        if(data === null){
            const newModel = new WatchListModel;
            newModel.userId = userId;
            newModel.moviesToWatch = [];
            newModel.moviesWatched = [];
            newModel.favourites = [movie];

            newModel.save((saveErr, favData) => {
                if(saveErr){
                    return res.send({
                        err: saveErr
                    });
                } else {
                    return res.status(200).send({
                        success: "True",
                        message: "Added movie to favourites",
                        data: favData
                    });
                }
            });
        } else {
            WatchListModel.findOneAndUpdate({
                userId: userId
            }, {
                $push: { "favourites": movie }
            }, (updateErr, favData) => {
                if(updateErr){
                    return res.send({
                        err: updateErr
                    });
                } else {
                    return res.status(200).send({
                        success: "True",
                        message: "Added movie to favourites",
                        data: favData
                    });
                }
            });
        }
    });
});

router.post('/remove-from-favourites/', (req, res) => {
    const { userId, movie } = req.body;

    WatchListModel.findOneAndUpdate({
        userId: userId
    }, {
        $pull: { "favourites": movie }
    }, (updateErr, favData) => {
        if(updateErr){
            return res.send({
                err: updateErr
            });
        }

        return res.status(200).send({
            success: "True",
            message: "Removed movie from favourites",
            data: favData
        });
    });
});

router.post("/get-favourites/", (req, res) => {
    const { userId } = req.body;

    WatchListModel.findOne({
        userId: userId
    }, (findErr, favData) => {
        if(findErr){
            return res.send({
                success: "False",
                error: findErr
            });
        }

        if(favData === null){
            return res.send({
                success: "False",
                message: "Empty Favourites for this user"
            });
        } 

        return res.status(200).send({
            success: "False",
            data: favData
        });
    });
});

router.post("/get-watchlist/", (req, res) => {
    const { userId } = req.body;

    WatchListModel.findOne({
        userId: userId
    }, (findErr, favData) => {
        if(findErr){
            return res.send({
                success: "False",
                error: findErr
            });
        }

        if(favData === null){
            return res.send({
                success: "False",
                message: "Empty Watchlist for this user"
            });
        } 

        return res.status(200).send({
            success: "False",
            data: favData
        });
    });
});

module.exports = router;