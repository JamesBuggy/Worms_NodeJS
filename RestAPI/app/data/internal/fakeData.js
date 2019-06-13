var mocks = require('./mocks.json');
module.exports = class FakeData {

    constructor() {
        
    }

    async connect(auth) {
        
    }

    async getLogin(username) {
        var login = mocks.logins.find((user) => {
            return user.username === username;
        });
        return login;
    }

    async saveLogin(username, pwdHash, pwdSalt) {
        return true;
    }

    async getProfiles(search) {
        var profiles = [];
        if(search == undefined) {
            mocks.profiles.forEach(profile => {
                profiles.push({
                    username: profile.username,
                    image: parseInt(profile.image, 10)
                });
            });
        }
        else {
            mocks.profiles.forEach(profile => {
                if(profile.username.includes(search)) {
                    profiles.push({
                        username: profile.username,
                        image: parseInt(profile.image, 10)
                    });
                }
            });
        }
        return profiles;
    }

    async getProfile(username) {
        var profile = mocks.profiles.find(profile => {
            return profile.username === username;
        });
        //profile.image = mocks.images.find(image => {
        //   return image._id === parseInt(profile.image, 10);
        //})
        return profile;
    }

    async createProfile(profile) {
        return true;
    }

    async updateProfile(profile) {
        return true;
    }

    async deleteProfile(username) {
        return true;
    }

    async getTeam(username) {
        var team = mocks.teams.find(team => {
            return team.username === username;
        });
        return team;
    }

    async createTeam(team) {
        return true;
    }

    async updateTeam(team) {
        return true;
    }

    async deleteTeam(username) {
        return true;
    }

    async getMatches(count) {
        return [];
    }

    async getMatchesForUser(username) {
        return [];
    }

    async saveMatch(match) {
        return true;
    }
}