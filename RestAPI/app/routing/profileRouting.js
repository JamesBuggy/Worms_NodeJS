var auth = require('../authentication/authentication');
var profileController = require('../controllers/profileController');
var validation = require('../validation/validation');

/**
 * Adds profile routes the the given router
 * @param {Router} router - ExpressJS router
 */
module.exports.addTo = (router) => {

    router.route('/profiles')
        .get(auth.hasRole([auth.roles.user]),
                validation.profile.validate('getProfiles'),
                validation.resultHandler,
                profileController.getProfiles);

    router.route('/profiles/:username')
        .get(auth.hasRole([auth.roles.user]),
                validation.profile.validate('getProfile'),
                validation.resultHandler,
                profileController.getProfile)
        .put(auth.hasRole([auth.roles.user]),
                auth.verifyUser,
                validation.profile.validate('updateProfile'),
                validation.resultHandler,
                profileController.updateProfile)
        .delete(auth.hasRole([auth.roles.user]),
                auth.verifyUser,
                validation.profile.validate('deleteProfile'),
                validation.resultHandler,
                profileController.deleteProfile);
}
