var mongoose = require('mongoose');
var validator = require('validator');

let teamSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: (value) => {
            return true;
        }
    },
    name: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    worms: {
        type: Array,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    }
});

module.exports = mongoose.model('Team', teamSchema, 'teams')