var MatchFacade = require('../facades/matchFacade');
var ApiResponse = require('../models/contracts/apiResponse');

exports.getMatches = (req, res, next) => {
    var top = req.query.top;
    var facade = new MatchFacade();
    facade.getMatches(top).then((matches) => {
        if(matches) {
            res.status(200).json(new ApiResponse(true, 'Loaded matches', matches));
        }
        else {
            res.status(200).json(new ApiResponse(false, 'Could not load matches', undefined));
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.getMatchesForUser = (req, res, next) => {
    var facade = new MatchFacade();
    facade.getMatchesForUser(req.params.username).then((matches) => {
        if(matches) {
            return res.status(200).json(new ApiResponse(true, 'Loaded matches', matches));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not load matches', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.saveMatch = (req, res, next) => {
    var facade = new MatchFacade();
    facade.saveMatch(req.params.username, req.body).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Match saved', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not save match', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}