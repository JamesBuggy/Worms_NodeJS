// Dependencies
var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require("express");
var mongoSanitize = require('express-mongo-sanitize');
var path = require("path");
var config = require('./config');
var authRouting = require('./app/routing/authRouting');
var profileRouting = require('./app/routing/profileRouting');
var imageRouting = require('./app/routing/imageRouting');
var teamRouting = require('./app/routing/teamRouting');
var matchRouting = require('./app/routing/matchRouting');
var dao = require('./app/data/dataAccess');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});

// Add routing
authRouting.addTo(router);
profileRouting.addTo(router);
imageRouting.addTo(router);
teamRouting.addTo(router);
matchRouting.addTo(router);

// Setup middleware
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use('/resource', express.static(path.join(__dirname, 'public')));
app.use('/api/v1', router);

// Connect to datasource
dao.connect(config.use_mocks, config.db_auth).then(() => {
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
        console.log("Server running on port " + config.port.toString());
    });
}).catch((error) => {
    console.log(error);
});
