const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type: String,
        default:''
    },
    lastname:{
        type: String,
        default:''
    },
    admin:{
        type: Boolean,
        default: false
    }
});

// adds username and password to the model
User.plugin(passportLocalMongoose);

const userModel = mongoose.model('User', User);

module.exports = userModel;