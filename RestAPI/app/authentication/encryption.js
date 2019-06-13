var crypto = require('crypto');

var saltBytes = 32;
var encoding = 'base64';
var algorithm = 'sha256';

/**
 * Create a salt of length saltBytes
 */
module.exports.createSalt = () => {
    var salt = crypto.randomBytes(Math.ceil(saltBytes/2)).toString(encoding);
    return salt.slice(0, saltBytes);
}

/**
 * Hash a password
 * @param {string} password - Password to hash
 * @param {string} salt - Salt to use with hash
 */
module.exports.hash = (password, salt) => {
    var hmac = crypto.createHmac(algorithm, salt);
    hmac.update(password);
    var hash = hmac.digest(encoding);
    return {
        salt: salt,
        hash: hash
    }
}