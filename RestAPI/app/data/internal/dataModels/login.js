var mongoose = require('mongoose');
var validator = require('validator');

let loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    pwdHash: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    pwdSalt: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    }
});

module.exports = mongoose.model('Login', loginSchema, 'logins')