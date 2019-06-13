var path = require("path");
var dao = require('../data/dataAccess');

module.exports = class ProfileFacade {

    constructor() {
        
    }

    /**
     * Returns a user profile
     * @param {string} username - Username of the profile to retrieve
     */
    getProfile(username) {
        return dao.getProfile(username).then((profile) => {
            if(profile) {
                // Build profile image url
                profile.image = '/resource/image/profile/' + profile.image + '.png';
            }
            return profile;
        });
    }

    /**
     * Returns a list of profiles
     * @param {string} search - Criteria to apply to the search
     */
    getProfiles(search) {
        return dao.getProfiles(search).then((profiles) => {
            if(profiles) {
                for(var i = 0; i < profiles.length; i++) {
                    // Build profile image url
                    profiles[i].image = '/resource/image/profile/' + profiles[i].image + '.png';
                }
            }
            return profiles;
        });
    }

    /**
     * Creates a blank user profile
     * @param {string} username - Username to give to the new profile
     */
    createProfile(username) {
        var profile = { username: username, image: "default", name: "", location: "", description: "" };
        return dao.createProfile(profile);
    }

    /**
     * Updates a profile
     * @param {string} username - Username of profile to update
     * @param {any} profile - Profile info
     */
    updateProfile(username, profile) {
        profile.username = username;
        // Only save the name of the profile image (Strip url/directory info)
        profile.image = path.posix.basename(profile.image, '.png');
        return dao.updateProfile(profile);
    }

    /**
     * Deletes a profile
     * @param {string} username - Username of profile to delete
     */
    deleteProfile(username) {
        return dao.deleteProfile(username);
    }
}