var mongoose = require('mongoose');
var validator = require('validator');

let matchSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    won: {
        type: Boolean,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    vs: {
        type: String,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    },
    score: {
        type: Number,
        required: true,
        unique: false,
        validate: (value) => {
            return true;
        }
    }
});

module.exports = mongoose.model('Match', matchSchema, 'matches')