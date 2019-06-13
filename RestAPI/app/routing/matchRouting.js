var auth = require('../authentication/authentication');
var matchController = require('../controllers/matchController');
var validation = require('../validation/validation');

/**
 * Adds match routes the the given router
 * @param {Router} router - ExpressJS router
 */
module.exports.addTo = (router) => {

    router.route('/matches')
        .get(auth.hasRole([auth.roles.user]), 
                validation.match.validate('getMatches'),
                validation.resultHandler,
                matchController.getMatches);

    router.route('/matches/:username')
        .get(auth.hasRole([auth.roles.user]), 
                validation.match.validate('getMatchesForUser'),
                validation.resultHandler,
                matchController.getMatchesForUser)
        .post(auth.hasRole([auth.roles.server]), 
                validation.match.validate('saveMatch'),
                validation.resultHandler,
                matchController.saveMatch);
}