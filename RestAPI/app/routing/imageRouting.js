var auth = require('../authentication/authentication');
var imageController = require('../controllers/imageController');

/**
 * Adds image routes the the given router
 * @param {Router} router - ExpressJS router
 */
module.exports.addTo = (router) => {

    router.route('/images')
        .get(auth.hasRole([auth.roles.user]), imageController.getImages);
}