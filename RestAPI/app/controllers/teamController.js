var TeamFacade = require('../facades/teamFacade');
var ApiResponse = require('../models/contracts/apiResponse');

exports.getTeam = (req, res, next) => {
    var facade = new TeamFacade();
    facade.getTeam(req.params.username).then((team) => {
        if(team) {
            return res.status(200).json(new ApiResponse(true, 'Loaded team', team));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not load team', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.createTeam = (req, res, next) => {
    var facade = new TeamFacade();
    facade.createTeam(req.params.username, req.body).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Team created', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not create team', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.updateTeam = (req, res, next) => {
    var facade = new TeamFacade();
    facade.updateTeam(req.params.username, req.body).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Team updated', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not update team', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.deleteTeam = (req, res, next) => {
    var facade = new TeamFacade();
    facade.deleteTeam(req.params.username).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Team deleted', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not delete team', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}