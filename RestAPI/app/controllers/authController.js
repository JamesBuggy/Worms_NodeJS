var AuthFacade = require('../facades/authFacade');
var ApiResponse = require('../models/contracts/apiResponse');

exports.validateRegistration = (req, res, next) => {
    var facade = new AuthFacade();
    facade.validateRegistration(req.body.fields).then((validation) => {
        return res.status(200).json(new ApiResponse(true, 'Validation successful!', validation));
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.register = (req, res, next) => {
    var facade = new AuthFacade();
    facade.register(req.body.username, req.body.password).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Registration successful!', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Registration failed!', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.login = (req, res, next) => {
    var facade = new AuthFacade();
    facade.login(req.body.username, req.body.password).then((token) => {
        if(token) {
            return res.status(200).json(new ApiResponse(true, 'Authentication successful!', token));
        }
        else {
            return res.status(401).json(new ApiResponse(false, 'Incorrect username or password', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}