var config = require('../../config');
var socketIOClient = require('socket.io-client');

class Client {

    constructor() {
        this._socket = undefined;
        this._serverInfo = undefined;
    }

    init(host, port, serverInfo) {
        let protocol = config.use_https ? 'https' : 'http';
        this._serverInfo  = serverInfo;
        this._socket = socketIOClient(`${protocol}://${host}:${port}`, { rejectUnauthorized: false });
        this._socket.on('connect', () => {
            this._socket.emit('register', this._serverInfo, () => {
                console.log('Registered with the master server!');
            });
        });
    }
}

module.exports = new Client();