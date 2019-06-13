var jwtService = require('./internal/jwtService');

/**
 * Valid roles to provide to 'hasRole'
 */
var roles = Object.freeze({
    /**
     * User of the Angular client
     */
    user: 'user', 

    /**
     * Game server
     */
    server: 'server'
})

/**
 * Middleware which can be added to a route to specify who is authorized to use the route.
 * @param {string[]} authorizedRoles - Array of roles authorized to use this route
 */
var hasRole = (authorizedRoles) => {

    return function(req, res, next) {
        var result = false;
        var authHeader = req.get('Authorization');
        if(authHeader) {
            var authToken = authHeader.replace('Bearer ', '');
            for(var i = 0; i < authorizedRoles.length; i++) {
                var role = authorizedRoles[i];
                switch (role) {
                    case roles.user:
                        var decodedToken = jwtService.decode(authToken);
                        result = jwtService.verifyUser(authToken, { subject: decodedToken.payload.sub });
                        break;
                    case roles.server:
                        result = jwtService.verifyServer(authToken);
                        break;
                    default:
                        console.log('Invalid role: ' + role);
                        break;
                }

                // If the current role is valid for the provided token break from the loop
                // No need to check other roles. Otherwise continue to check the other specified roles.
                if(result) {
                    break;
                }
            }
        }

        // If the provided JWT matches an authorized role for the route, continue to the next middleware.
        // Otherwise, return a forbidden error.
        if (result) {
            next();
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Forbidden!'
            });;
        }
    }
}

/**
 * Verifies the username in a request matches the user that the provided JWT was signed for.
 * Used to protect routes such as /profiles/<username> PUT/DELETE/etc.
 */
module.exports.verifyUser = (req, res, next) => {
    
    var result = false;
    var authHeader = req.get('Authorization');
    if(authHeader) {
        var authToken = authHeader.replace('Bearer ', '');
        var decodedToken = jwtService.decode(authToken);
        result = (decodedToken.payload.sub == req.params.username);
    }

    if(result) {
        next();
    }
    else {
        return res.status(403).json({
            success: false,
            message: 'Forbidden!'
        });
    }
}

/**
 * Create a JWT for the specified user
 * @param {string} username - Username of the user for which the token should be created
 */
module.exports.createToken = (username) => {
    return jwtService.create({}, { subject: username });
}

module.exports.hasRole = hasRole;
module.exports.roles = roles;