var socketIO = require('socket.io');
var socketIOJwt = require("socketio-jwt");
var jwtAuth = require('../authentication/jwtAuthentication');
var events = require('./internal/events');
var gameController = require('../controllers/gameController');

class Server {

    constructor() {
        this._io = undefined;
    }

    init(httpServer) {
        this._io = socketIO(httpServer);
        this._io.on('connection', socketIOJwt.authorize({
            secret: jwtAuth.apiPublicKey,
            timeout: jwtAuth.apiAuthTimeout
        })).on('authenticated', function(socket) {

            var isPlayer = gameController.authenticated(socket.id, socket.decoded_token);
            socket.emit('role', isPlayer);

            socket.on('disconnect', function () {
                console.log('Player disconnected');
                gameController.disconnect(socket.id);
            });
            socket.on('ready', function () {
                gameController.ready(socket.id);
            });
            socket.on('input', function (data) {
                gameController.input(socket.id, data);
            });
        });

        setInterval(() => {
            this._io.sockets.emit('state', gameController.getState());
        }, 1000 / 60);
    }

    send(event, data) {
        this._io.sockets.emit(event, data);
    }

    closeAllConnections() {
        Object.keys(this._io.sockets.sockets).forEach((s) => {
            this._io.sockets.sockets[s].disconnect();
        });
    }
}

module.exports = new Server();
module.exports.events = events;