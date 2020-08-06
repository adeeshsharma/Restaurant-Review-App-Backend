var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../middlewares/authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req,res)=>{ res.sendStatus(200); });

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin(), (req, res, next) =>{
  User.find({})
  .then((dishes)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dishes);
  },(err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup', cors.corsWithOptions, (req, res, next)=>{
  User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname) user.firstname = req.body.firstname;
      if(req.body.lastname) user.lastname = req.body.lastname;

      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return;
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success:true,
            status: 'Registration successful!',
          });
        });
      });
    }
  });
});

//passport.authenticate is coming from authentication.js where we mentioned exports.local
router.post('/login', cors.corsWithOptions, (req, res, next)=>{

  passport.authenticate('local', (err, user, info) =>{
    if(err){
      return next(err);
    }

    // if username or pass is incorrect, comes here
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success:false,
        status: 'Login Unsuccessful!',
        err: info
      });
    }

    // when no error and user is not null
    req.logIn(user, (err)=>{
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success:false,
          status: 'Logged in Unsuccessful!',
          err: 'Could not login user!'
        });
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        token: token,
        status: 'You have successfully logged in!',
      });
    });
  }) (req,res,next); 
});

router.get('/logout', (req, res, next)=>{
  //session must exist
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    res.statusCode = 400;
    next(err);
  }
});

router.get('/checkjwttoken', cors.corsWithOptions, (req,res,next)=>{
  passport.authenticate('jwt', {session:false}, (err,user, info)=>{
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode=401;
      res.setHeader("Content-Type","application/json");
      return res.json({status:'JWT invalid',success: false, err: info});
    }
    else{
      res.statusCode=200;
      res.setHeader("Content-Type","application/json");
      return res.json({status:'JWT Valid',success: false, user: user});
    }
  })(req, res);
})

module.exports = router;
