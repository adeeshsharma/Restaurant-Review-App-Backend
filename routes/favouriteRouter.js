const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../middlewares/authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourite');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
        .populate('user')
        .populate('dishes')
        .then((favourites) => {
            // extract favourites that match the req.user.id
            if (favourites) {
                user_favourites = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
                if(!user_favourites) {
                    var err = new Error('You have no favourites!');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(user_favourites);
            } else {
                var err = new Error('There are no favourites');
                err.status = 404;
                return next(err);
            }
            
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id}, (err,favourite)=>{
        if(err) return next(err);

        if(!favourite){
            Favourites.create({user:req.user._id})
            .then((favourite)=>{
                for(i=0;i<req.body.length;i++)
                    if(favourite.dishes.indexOf(req.body[i]._id)< 0)
                        favourite.dish.push(req.body[i]);
                favourite.save()
                .then((favourite)=>{
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite)=>{
                        res.statusCode=200;
                        res.setHeader("Content-Type","application/json");
                        res.json(favourite)
                    })
                })
                .catch((err) =>{ return next(err) });
            })
            .catch((err) =>{ return next(err) });
        }
        else{
            for(i=0;i<req.body.length;i++)
                if(favourite.dishes.indexOf(req.body[i]._id)<0)
                    favourite.dishes.push(req.body[i]);
            favourite.save()
            .then((favourite) =>{
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite)=>{
                    res.statusCode=200;
                    res.setHeader("Content-Type","application/json");
                    res.json(favourite)
                })
            })
            .catch((err) =>{ return next(err) });
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favourites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.find({})
        .populate('user')
        .populate('dishes')
        .then((favourites) => {
            var favToRemove;
            if (favourites) {
                favToRemove = favourites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            } 
            if(favToRemove){
                favToRemove.remove()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));
                
            } else {
                var err = new Error('You do not have any favourites');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favourites) => {
            if(!favourites){
                res.statusCode = 200;
                res.setHeader("Content-Type", 'application/json');
                return res.json({"exists": false, "favourites": favourites});
            }
            else{
                if(favourites.dishes.indexOf(req.params.dishId) < 0){
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({"exists":false, "favourites":favourites});
                }
                else{
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    return res.json({"exists":true, "favourites":favourites});
                }
            }
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourites.findOne({user: req.user._id}, (err,favourite)=>{
        if(err) return next(err);

        if(!favourite){
            Favourites.create({user: req.user._id})
            .then((favourite)=>{
                favourite.dishes.push({"_id":req.params.dishId});
                favourite.save()
                .then((favourite)=>{
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite)=>{
                        res.statusCode=200;
                        res.setHeader("Content-Type","application/json");
                        res.json(favourite)
                    })
                })
                .catch((err)=>{
                    return next(err);
                });
            })
            .catch((err)=>{
                return next(err);
            })
        }
        else {
            if(favourite.dishes.indexOf(req.params.dishId) < 0){
                favourite.dishes.push({"_id":req.params.dishId});
                favourite.save()
                .then((favourite)=>{
                    Favourites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite)=>{
                        res.statusCode=200;
                        res.setHeader("Content-Type","application/json");
                        res.json(favourite)
                    })
                })
                .catch((err)=>{
                    return next(err);
                })
            }
            else {
                res.statusCode =403;
                res.setHeader("Content-Type","application/json");
                res.end('Dish ' + req.params.dishId + " already in favourites!");
            }
        }
    });
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favourites/:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Favourites.findOne({user: req.user._id}, (err,favourite)=>{
       if(err) return next(err);

       var index = favourite.dishes.indexOf(req.params.dishId);
       if(index >=0){
           favourite.dishes.splice(index,1);
           favourite.save()
           .then((favourite)=>{
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite)=>{
                    res.statusCode=200;
                    res.setHeader("Content-Type","application/json");
                    res.json(favourite)
                })
            })
            .catch((err)=>{
                return next(err);
            })
       }
       else{
           res.statusCode =404;
           res.setHeader("Content-Type","application/json");
           res.end("Dish "+ req.params.dishId +" not in your favourites!");
       }
   });
});

module.exports = favouriteRouter;