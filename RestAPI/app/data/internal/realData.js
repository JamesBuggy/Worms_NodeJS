var mongoose = require('mongoose');
var LoginModel = require('./dataModels/login');
var MatchModel = require('./dataModels/match');
var ProfileModel = require('./dataModels/profile');
var TeamModel = require('./dataModels/team');

module.exports = class RealData {

    constructor() {
        this._user = 'restApi';
        this._password = 'Arml1bB4tMida';
        this._server = '127.0.0.1:27017';
        this._db = 'wormsdb';
        this._dbo = undefined;
    }

    connect(auth) {
        let connString = auth ? 
            `mongodb://${this._user}:${this._password}@${this._server}/${this._db}` : 
            `mongodb://${this._server}/${this._db}`;

        return mongoose.connect(connString, { useNewUrlParser: true }).then(() => {
            console.log(`connected to: mongodb://${this._server}/${this._db}`);
        });
    }

    getLogin(username) {
        var projection = {
            _id: 0,
            __v: 0
        }
        return LoginModel.findOne({ username: username }, projection).exec();
    }

    saveLogin(username, pwdHash, pwdSalt) {
        var login = new LoginModel({
            username: username,
            pwdHash: pwdHash,
            pwdSalt: pwdSalt
        });
        return login.save();
    }

    getProfiles(search) {
        var query = { 
            username: new RegExp(search, 'i') 
        };
        var projection = {
            _id: 0,
            __v: 0,
            location: 0,
            description: 0,
            name: 0
        }
        return ProfileModel.find(query, projection).exec();
    }

    getProfile(username) {
        var projection = {
            _id: 0,
            __v: 0
        }
        return ProfileModel.findOne({ username: username }, projection).exec();
    }

    createProfile(profile) {
        var profileModel = new ProfileModel({
            username: profile.username, 
            name: profile.name, 
            image: profile.image, 
            location: profile.location, 
            description: profile.description 
        });
        return profileModel.save();
    }

    updateProfile(profile) {
        return ProfileModel.findOne({ username: profile.username }).then((p) => {
            p.name = profile.name;
            p.image = profile.image;
            p.location = profile.location;
            p.description = profile.description;
            return p.save();
        });
    }

    deleteProfile(username) {
        return ProfileModel.deleteOne({ username: username }).then(() => {
            return LoginModel.deleteOne({ username: username }).then(() => {
                return TeamModel.deleteOne({ username: username }).then(() => {
                    return MatchModel.deleteMany({ username: username }).exec();
                });
            });
        });
    }

    getTeam(username) {
        var projection = {
            _id: 0,
            "worms._id": 0,
            __v: 0
        }
        return TeamModel.findOne({ username: username }, projection).exec();
    }

    createTeam(team) {
        var teamModel = new TeamModel({
            username: team.username,
            name: team.name,
            worms: team.worms
        });
        return teamModel.save();
    }

    updateTeam(team) {
        return TeamModel.findOne({ username: team.username }).then((t) => {
            t.name = team.name;
            t.worms = team.worms;
            return t.save();
        });
    }

    deleteTeam(username) {
        var query = { username: username };
        return TeamModel.deleteOne(query).exec();
    }

    getMatches(count) {
        var projection = {
            _id: 0,
            __v: 0
        }
        if(count) {
            return MatchModel.find({}, projection).sort({ score : -1 }).limit(parseInt(count, 10)).exec();
        }
        else {
            return MatchModel.find({}, projection).exec();
        }
    }

    getMatchesForUser(username) {
        var projection = {
            _id: 0,
            __v: 0
        }
        return MatchModel.find({ username: username }, projection).exec();
    }

    saveMatch(match) {
        var matchModel = new MatchModel({
            username: match.username,
            won: match.won,
            vs: match.vs,
            score: match.score
        });
        return matchModel.save();
    }
}