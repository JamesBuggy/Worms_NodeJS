var dao = require('../data/dataAccess');

module.exports = class TeamFacade {

    constructor() {
        
    }

    /**
     * Returns the team of a user
     * @param {string} username - Owner of the team
     */
    getTeam(username) {
        return dao.getTeam(username);
    }

    /**
     * Creates a team for a user
     * @param {string} username - Username of the profile to retrieve
     * @param {any} team - Team info
     */
    createTeam(username, team) {
        team.username = username;
        return dao.createTeam(team);
    }

    /**
     * Updates the team of a user
     * @param {string} username - Owner of the team
     * @param {any} team - Team info
     */
    updateTeam(username, team) {
        team.username = username;
        return dao.updateTeam(team);
    }

    /**
     * Deletes the team of a user
     * @param {string} username - Owner of the team to delete
     */
    deleteTeam(username) {
        return dao.deleteTeam(username);
    }
}