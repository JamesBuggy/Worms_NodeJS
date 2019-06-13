var auth = require('../authentication/authentication');
var teamController = require('../controllers/teamController');
var validation = require('../validation/validation');

/**
 * Adds team routes the the given router
 * @param {Router} router - ExpressJS router
 */
module.exports.addTo = (router) => {

    router.route('/teams/:username')
        .get(auth.hasRole([auth.roles.user, auth.roles.server]),
                validation.team.validate('getTeam'),
                validation.resultHandler,
                teamController.getTeam)
        .post(auth.hasRole([auth.roles.user]),
                auth.verifyUser,
                validation.team.validate('createTeam'),
                validation.resultHandler,
                teamController.createTeam)
        .put(auth.hasRole([auth.roles.user]),
                auth.verifyUser,
                validation.team.validate('updateTeam'),
                validation.resultHandler,
                teamController.updateTeam)
        .delete(auth.hasRole([auth.roles.user]),
                auth.verifyUser,
                validation.team.validate('deleteTeam'),
                validation.resultHandler,
                teamController.deleteTeam);
}