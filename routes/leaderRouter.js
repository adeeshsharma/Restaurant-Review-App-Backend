const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../middlewares/authenticate');
const cors = require('./cors');
const Leader = require('../models/leaders');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) =>{
    Leader.find(req.query)
    .then((leader)=>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },
     (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Leader.create(req.body)
    .then((leader)=>{
        console.log('leader created ',leader);
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },
    (err)=>next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 400;
    res.end('PUT operation not supported on /leaders!');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next) =>{
    Leader.remove({})
    .then((resp)=>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },
    (err)=>next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) =>{
    Leader.findById(req.params.leaderId)
    .then((leader) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },
    (err)=>next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    res.statusCode = 400;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId+'!');
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.leaderId, {$set: req.body},{ new :true})
    .then((leader) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    },
    (err)=>next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin(),(req,res,next) =>{
    Dishes.findByIdAndRemove(req.params.leaderId)
    .then((resp) =>{
        res.statusCode =200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },
    (err)=>next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;