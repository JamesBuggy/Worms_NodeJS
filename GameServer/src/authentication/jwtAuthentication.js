var fs = require('fs');
var jwt = require('jsonwebtoken');

var ttl = 120;
var algorithm = 'RS256';
var issuer = 'wormsGameServer';
var subject = "wormsGameServer";
var audience = 'https://wormsGameServer.com';
var privateKEY  = fs.readFileSync('./src/authentication/keys/server_private_2048.key', 'utf8');
var publicKEY  = fs.readFileSync('./src/authentication/keys/server_public_2048.key', 'utf8');
var apiPublicKey = fs.readFileSync('./src/authentication/keys/api_public_2048.key', 'utf8');

module.exports.apiPublicKey = apiPublicKey
module.exports.apiAuthTimeout = 15000;

module.exports.create = (payload) => {
    var signOptions = {
        issuer: issuer,
        subject: subject,
        audience: audience,
        expiresIn:  ttl,
        algorithm: algorithm    
    };
    return jwt.sign(payload, privateKEY, signOptions);
}