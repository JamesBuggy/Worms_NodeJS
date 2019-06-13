var RealData = require('./internal/realData');
var FakeData = require('./internal/fakeData');

class DataAccess {

    constructor() {
        this._datasource = undefined;
    }

    /**
     * Connects to a datasource
     * @param {boolean} mock - Use real or fake mock source
     * @param {boolean} auth - Use user authentication when connecting to MongoDB
     */
    connect(mock, auth) {
        if(mock) {
            console.log('Using mock datasource');
            this._datasource = new FakeData();
        }
        else {
            console.log('Using real datasource');
            this._datasource = new RealData();
        }
        return this._datasource.connect(auth);
    }

    getLogin(username) {
        return this._datasource.getLogin(username);
    }

    saveLogin(username, pwdHash, pwdSalt) {
        return this._datasource.saveLogin(username, pwdHash, pwdSalt);
    }

    getProfiles(search) {
        return this._datasource.getProfiles(search);
    }

    getProfile(username) {
        return this._datasource.getProfile(username);
    }

    createProfile(profile) {
        return this._datasource.createProfile(profile);
    }

    updateProfile(profile) {
        return this._datasource.updateProfile(profile);
    }

    deleteProfile(username) {
        return this._datasource.deleteProfile(username);
    }

    getTeam(username) {
        return this._datasource.getTeam(username);
    }

    createTeam(team) {
        return this._datasource.createTeam(team);
    }

    updateTeam(team) {
        return this._datasource.updateTeam(team);
    }

    deleteTeam(username) {
        return this._datasource.deleteTeam(username);
    }

    getMatches(count) {
        return this._datasource.getMatches(count);
    }

    getMatchesForUser(username) {
        return this._datasource.getMatchesForUser(username);
    }

    saveMatch(match) {
        return this._datasource.saveMatch(match);
    }
}

module.exports = new DataAccess();