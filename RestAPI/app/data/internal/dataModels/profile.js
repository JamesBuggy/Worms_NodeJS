var mongoose = require('mongoose');
var validator = require('validator');

let profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return true;
        }
    },
    image: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    name: {
        type: String,
        required: false,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    location: {
        type: String,
        required: false,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    description: {
        type: String,
        required: false,
        unique: false,
        validate: (value) => {
            return true;
        }
    }
});

module.exports = mongoose.model('Profile', profileSchema, 'profiles')