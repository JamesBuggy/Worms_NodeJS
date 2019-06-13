var { validationResult } = require('express-validator/check')
var authValidators = require('./internal/authValidators');
var matchValidators = require('./internal/matchValidators');
var profileValidators = require('./internal/profileValidators');
var teamValidators = require('./internal/teamValidators');

// Export valiators for each route 'domain'
exports.auth = authValidators;
exports.match = matchValidators;
exports.profile = profileValidators;
exports.team = teamValidators;

// Returns a 422 error status if any validation errors are found
exports.resultHandler = (req, res, next) => {    
    var errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        console.log(JSON.stringify(errors.mapped()));
        return res.status(422).json({
            success: false,
            message: 'Invalid request'
        });
    }
}
