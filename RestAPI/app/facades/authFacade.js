var encryption = require('../authentication/encryption');
var auth = require('../authentication/authentication');
var dao = require('../data/dataAccess');

module.exports = class AuthFacade {

    constructor() {

    }

    /**
     * Validates the registration form fields. Eg. { username: 'ExampleUser' }
     * @param {any} fields - Fields to validate
     */
    validateRegistration(fields) {
        return dao.getProfile(fields.username).then((profile) => {
            var validationResult = {
                result: true,
                fields: {
                    username: true
                }
            }
            if(profile) {
                validationResult.result = false;
                validationResult.fields.username = false;
            }
            return validationResult;
        });
    }

    /**
     * Registers a user
     * @param {string} username - Username to save
     * @param {string} password - Password to save
     */
    register(username, password) {
        // Check if a profile exists with the given username and register if none found
        return dao.getProfile(username).then((profile) => {
            if(!profile) {
                // Hash the password and save the login details
                var encPwd = encryption.hash(password, encryption.createSalt());
                return dao.saveLogin(username, encPwd.hash, encPwd.salt);
            }
            else {
                return false;
            }
        }).then((result) => {
            // If the user was registered, create a blank profile for them
            if(result) {
                var profile = { username: username, image: "default", name: "", location: "", description: "" };
                return dao.createProfile(profile);
            }
            else {
                return false;
            }
        });
    }

    /**
     * Logs a user in
     * @param {string} username - User to login
     * @param {string} password - Password to use
     */
    login(username, password) {
        return dao.getLogin(username).then((login) => {
            var token = undefined;
            if(login) {
                // Hash the given password and compare the hash to what was saved at registration
                var encPwd = encryption.hash(password, login.pwdSalt);
                if(login.pwdHash == encPwd.hash) {
                    token = auth.createToken(username);
                }
            }
            return token;
        });
    }
}