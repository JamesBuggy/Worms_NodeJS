'use strict'

// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var config = require('./config');
var express = require("express");
var socketIO = require('socket.io');

var serverList = {};

// Routing
var router = express.Router();

// Test route
router.get("/", function(req, res) {
    res.json({ message: 'Success!' });
});

// Middleware to use for all requests
router.use(function(req, res, next) {
    console.log("Recieved request");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});

// Get all servers
router.route('/servers')
    .get(function(req, res) {
        try {
            var serverData = Object.values(serverList);
            res.status(200).json({
                success: true,
                content: serverData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Something went wrong! Please try again'
            });
        }
    });

// Get one server by name
router.route('/servers/:name')
    .get(function(req, res) {
        try {
            var serverData = Object.values(serverList);
            res.status(200).json({
                success: true,
                content: serverData.find((s) => {
                    return s.name === req.params.name;
                })
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Something went wrong! Please try again'
            });
        }
    });

// Initialize express
// Setup middleware
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', router);

// Start http/https server
let server = undefined;
if(config.use_https) {
    let privateKey  = fs.readFileSync('ssl/server.key', 'utf8');
    let certificate = fs.readFileSync('ssl/server.crt', 'utf8');
    server = https.createServer({ key: privateKey, cert: certificate }, app);
}
else {
    server = http.createServer(app);
}
server.listen(config.port, () => {
    // Initialize socket io
    var io = socketIO(server);
    io.on('connection', function(socket) {

        socket.on('register', function (serverInfo, callback) {
            serverList[socket.id] = serverInfo;
            serverList[socket.id].host = socket.request.connection.remoteAddress.replace('::ffff:', '');
            console.log('Registered game server: ' + socket.id);
            callback();
        });
    });
    // Regenerate the cached server list and meta data every second
    setInterval(buildServerList, 1000);
    function buildServerList() {
        var cachedIds = Object.keys(serverList);
        var activeIds = Object.keys(io.sockets.sockets);
        cachedIds.forEach(id => {
            if(activeIds.includes(id) == false) {
                console.log('Removed game server: ' + id);
                delete serverList[id];
            }
        });
    }
    console.log("Server running on port " + config.port.toString());
});

