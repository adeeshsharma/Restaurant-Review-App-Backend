// main passport authentication module
// just has to be required in app.js

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Dishes = require('../models/dishes');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('../config');
const { NotExtended } = require('http-errors');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

//because we are using sessions. provided by passport-local-mongoose in the user model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user){
    return jwt.sign(user, config.secretkey, {expiresIn: '10d'});
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretkey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done)=>{
    console.log("PAYLOAD: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user)=>{
        if(err){
            return done(err, false);
        }
        else if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    });
}));

//uses the token that comes in the authentication header
exports.verifyUser = passport.authenticate('jwt', {session:false});

exports.verifyAdmin = function(){
    return function(req,res,next){
        if(req.user.admin === true){
            next();
        }
        else{
            var err = new Error('You must be an admin to access this resource!');
            res.statusCode= 403;
            res.json({ status: false, err: err.message});
        }
    }
}

exports.commentPrevilage = function(){
    return function(req,res,next){
        Dishes.findById(req.params.dishId)
        .then((dish)=>{
            if(dish.comments.id(req.params.commentId).author._id.equals(req.user._id)){
                next();
            }
            else{
                var err = new Error('You cannot modify this comment!');
                res.statusCode= 403;
                res.json({ status: false, err: err.message});
            }
        } , (err)=>next(err))
        .catch((err) => next(err));
    }
}
