'use strict'

// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var config = require('./config');
var express = require("express");
var portfinder = require('portfinder');
var apiClient = require('./src/network/apiClient');
var ioClient = require('./src/network/ioClient');
var ioServer = require('./src/network/ioServer');
var game = require('./src/game/game');
var GameInstance = require('./src/game/gameInstance');

var serverData = {};
serverData.name = "GameServer-";
serverData.port = undefined;

// Routing
var router = express.Router();
router.use(function(req, res, next) {
    console.log("Recieved request");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});
router.get("/", function(request, response) {
    response.json({
        serverName: serverData.name,
        game: game.getInstance().getGameInfo()
    });
});

var app = express();
app.use('/api/v1', router);

// Find an open port, start by checking the default port
portfinder.getPort({ port: config.port }, (err, port) => {
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
    server.listen(port, () => {
        serverData.name = serverData.name+port;
        serverData.port = port;
        game.init(new GameInstance());
        apiClient.init(config.apiHost, config.apiPort);
        ioClient.init(config.masterHost, config.masterPort, serverData);
        ioServer.init(server);
        console.log("Server running on port " + port.toString());
    });
});
