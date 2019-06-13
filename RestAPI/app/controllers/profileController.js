var ProfileFacade = require('../facades/profileFacade');
var ApiResponse = require('../models/contracts/apiResponse');

exports.getProfiles = (req, res, next) => {
    var search = req.query.search != undefined ? req.query.search.trim() : undefined;
    search = search == "" ? undefined : search;

    var facade = new ProfileFacade();
    facade.getProfiles(search).then((profiles) => {
        if(profiles) {
            return res.status(200).json(new ApiResponse(true, 'Loaded profiles', profiles));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not load profile list', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.getProfile = (req, res, next) => {
    var facade = new ProfileFacade();
    facade.getProfile(req.params.username).then((profile) => {
        if(profile) {
            return res.status(200).json(new ApiResponse(true, 'Loaded profile', profile));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not load profile', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.updateProfile = (req, res, next) => {
    var facade = new ProfileFacade();
    facade.updateProfile(req.params.username, req.body).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Profile updated', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not update profile', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}

exports.deleteProfile = (req, res, next) => {
    var facade = new ProfileFacade();
    facade.deleteProfile(req.params.username).then((result) => {
        if(result) {
            return res.status(200).json(new ApiResponse(true, 'Profile deleted', undefined));
        }
        else {
            return res.status(200).json(new ApiResponse(false, 'Could not delete profile', undefined));
        }
    }).catch((error) => {
        console.log(error);
        return res.status(500).json(new ApiResponse(false, 'Something went wrong! Please try again', undefined));
    });
}