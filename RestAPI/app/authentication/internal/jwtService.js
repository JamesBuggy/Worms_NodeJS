var fs = require('fs');
var jwt = require('jsonwebtoken');

var ttl = 21600; // 6 hours
var algorithm = 'RS256';
var issuer = 'wormsRestApi';
var audience = 'https://wormsClient.com';
var privateKEY  = fs.readFileSync('./app/authentication/keys/api_private_2048.key', 'utf8');
var publicKEY  = fs.readFileSync('./app/authentication/keys/api_public_2048.key', 'utf8');
var serverPublicKEY  = fs.readFileSync('./app/authentication/keys/server_public_2048.key', 'utf8');

/**
 * Create JSON web tokens
 */
module.exports.create = (payload, options) => {
    var signOptions = {
        issuer: issuer,
        subject: options.subject,
        audience: audience,
        expiresIn:  ttl,
        algorithm: algorithm    
    };
    return {
        token: jwt.sign(payload, privateKEY, signOptions),
        expires: ttl
    }
}

/**
 * Verify a user token
 */
module.exports.verifyUser = (token, options) => {
    var verifyOptions = {
        issuer: issuer,
        subject: options.subject,
        audience: audience,
        expiresIn: ttl,
        algorithm: [algorithm]
    };
    try {
        return jwt.verify(token, publicKEY, verifyOptions);
    }
    catch (err) {
        return false;
    }
}

/**
 * Verify a game server token
 */
module.exports.verifyServer = (token) => {
    var verifyOptions = {
        issuer: "wormsGameServer",
        subject: "wormsGameServer",
        audience: 'https://wormsGameServer.com',
        expiresIn: 120,
        algorithm: [algorithm]
    };
    try {
        return jwt.verify(token, serverPublicKEY, verifyOptions);
    }
    catch (err) {
        return false;
    }
}

/**
 * Decode a given token
 */
module.exports.decode = (token) => {
    return jwt.decode(token, { complete: true });
}