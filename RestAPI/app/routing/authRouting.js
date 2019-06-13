var authController = require('../controllers/authController');
var validation = require('../validation/validation');

/**
 * Adds registration/login routes the the given router
 * @param {any} router - ExpressJS router
 */
module.exports.addTo = (router) => {

    router.route('/registration')
        .post(validation.auth.validate('validateRegistration'),
                validation.resultHandler,
                authController.validateRegistration)
        .put(validation.auth.validate('register'),
                validation.resultHandler,  
                authController.register);

    router.route('/login')
        .post(validation.auth.validate('login'),
                validation.resultHandler,    
                authController.login);
}