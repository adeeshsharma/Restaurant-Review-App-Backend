const express = require('express');
const promoRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../middlewares/authenticate');
const cors = require('./cors');
const Promos = require('../models/promotions');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) =>{
    Promos.find(req.query)
    .then((promotion)=>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },
    (err) => next(err))
    .catch((err) => next(err));  
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Promos.create(req.body)
    .then((promotion)=>{
        console.log("promotion created", promotion);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },
    (err)=>next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 400;
    res.end('PUT operation not supported on /promotions!');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next) =>{
    Promos.remove({})
    .then((resp)=>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },
    (err)=>next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) =>{
    Promos.findById(req.params.promoId)
    .then((promotion) =>{
     res.statusCode =200;
     res.setHeader('Content-Type', 'application/json');
     res.json(promotion);
 },
 (err)=>next(err))
 .catch((err) => next(err));
 })
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 400;
    res.end('POST operation not supported on /promotions/'+req.params.promoId+'!');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Promos.findByIdAndUpdate(req.params.promoId, {$set: req.body},{ new :true})
    .then((promotion) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },
    (err)=>next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next) =>{
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },
    (err)=>next(err))
    .catch((err) => next(err));});

module.exports = promoRouter;