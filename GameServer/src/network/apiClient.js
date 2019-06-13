var config = require('../../config');
var jwtAuth = require('../authentication/jwtAuthentication');
var request = require('request');

class ApiClient {

    constructor() {
        this._host = undefined;
        this._port = undefined;
        this._protocol = config.use_https ? 'https' : 'http';
    }

    init(host, port) {
        this._host = host;
        this._port = port;
    }

    getTeam(username, callback) {
        var options = {
            json: true,
            headers: {
                'Authorization': "Bearer " + jwtAuth.create({})
            },
            rejectUnauthorized: false, // Needed due to self signed cert being rejected
        }
        request.get(`${this._protocol}://${config.apiHost}:${config.apiPort}/api/v1/teams/${username}`, options, (error, response, body) => {
            if(error) {
                console.error(error)
                return callback(undefined);
            }
            else if (response.statusCode === 200 && body.success) {
                return callback(body.content);
            }
            else {
                return callback(undefined);
            }
        });
    }

    saveMatch(match, callback) {
        var data = JSON.stringify(match);
        var options = {
            json: match,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': "Bearer " + jwtAuth.create({})
            },
            rejectUnauthorized: false, // Needed due to self signed cert being rejected
        }
        request.post(`${this._protocol}://${config.apiHost}:${config.apiPort}/api/v1/matches/${match.username}`, options, (error, response, body) => {
            if(error) {
                console.error(error)
                return callback(false);
            }
            else if (response.statusCode === 200 && body.success) {
                return callback(true);
            }
            else {
                return callback(false);
            }
        });
    }
}

module.exports = new ApiClient();