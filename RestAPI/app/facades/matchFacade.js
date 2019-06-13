var dao = require('../data/dataAccess');

module.exports = class MatchFacade {

    constructor() {
        
    }

    /**
     * Returns a list of matches
     * @param {number} count - Number of matches to retrieve
     */
    getMatches(count) {
        return dao.getMatches(count);
    }

    /**
     * Returns a list of matches for a user
     * @param {string} username - User to retrieve matches for
     */
    getMatchesForUser(username) {
        return dao.getMatchesForUser(username);
    }

    /**
     * Saves a match result
     * @param {string} username - User to save the match for
     * @param {any} match - Match info
     */
    saveMatch(username, match) {
        match.username = username;
        return dao.saveMatch(match);
    }
}