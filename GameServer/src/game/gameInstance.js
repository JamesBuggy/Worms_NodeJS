var config = require('./internal/configs/gameConfig');
var physics = require('./internal/physics');
var ioServer = require('../network/ioServer');
var apiClient = require('../network/apiClient');
var Level = require('./internal/level');
var Team = require('./internal/team');
var Worm = require('./internal/worm');

var GameStates = Object.freeze({ 
    "lobby": 1, 
    "game": 2,
    "end": 3
})

module.exports = class GameInstance {

    constructor() {
        this._teams = [];
        this._activeTeam = -1;
        this._players = {};
        this._minPlayers = config.min_players;
        this._maxPlayers = config.max_players;
        this._level = undefined;
        this._state = GameStates.lobby;
        this._lastUpdate = Date.now();
        this._levelUpdateTime = 0;
        this._updateInterval = undefined;
        this._changingTurn = false;
        this._winner = undefined;
        this._winnerScore = 0;
    }

    addPlayer(playerId, decodedToken) {
        console.log('Game.addPlayer - Start');
        var isPlayer = false;
        var playerCount = Object.keys(this._players).length;
        if(playerCount < config.min_players) {
            this._players[playerId] = {
                ready: false,
                token: decodedToken
            };
            isPlayer = true;
        }
        console.log('Game.addPlayer - End');
        return isPlayer;
    }

    readyPlayer(playerId) {
        var player = this._players[playerId];
        if(player) {
            player.ready = true;
            var playerCount = Object.keys(this._players).length;
            if(this._minPlayers == playerCount) {
                var players = Object.values(this._players);
                for(var i = 0; i < playerCount; i++) {
                    if(players[i].ready == false) {
                        // Return of not all players are ready
                        return;
                    }
                }
                // Start if all players are ready
                this._startGame();
            }
        }
    }

    removePlayer(playerId) {
        console.log('Game.removePlayer - Start');
        if(this._state == GameStates.game) {
            for(var i = 0; i < this._teams.length; i++) {
                this._teams[i].removePlayer(playerId);
            }
        }
        else if(this._state == GameStates.lobby) {
            delete this._players[playerId];
        }
        console.log('Game.removePlayer - End');
    }

    isAcceptingInput() {
        if(this._state == GameStates.game && !this._changingTurn) {
            return true;
        }
        return false;
    }

    nextTurn() {

        if(this._changingTurn) {
            return;
        }

        this._changingTurn = true;
        setTimeout(() => {
            if(this._state == GameStates.game) {
                this._activeTeam = (this._activeTeam+1)%this._teams.length;
                this._teams[this._activeTeam].nextWorm();
            }
            this._changingTurn = false;
        }, 3000);
    }

    getActiveWorm() {
        if(this._state != GameStates.game) {
            return null;
        }

        return {
            worm: this._teams[this._activeTeam].activeWorm(),
            ownerId: this._teams[this._activeTeam].getPlayer()
        }
    }

    getLevel() {
        return this._level;
    }

    getGameState() {
        var state = {};
        state.state = this._state;
        if(this._state == GameStates.lobby) {

        }
        else if(this._state == GameStates.game) {
            state.teams = [];
            for(var i = 0; i < this._teams.length; i++) {
                var teamState = this._teams[i].getState();
                teamState.active = i === this._activeTeam;
                state.teams.push(teamState);
            }
            
            if(config.debug) {
                state.debug = {};
                state.debug.physics = physics.getDebugInfo();
            }
        }
        else if(this._state == GameStates.end) {
            state.winner = this._winner;
            state.score = this._winnerScore;
        }
        return state;
    }

    getGameInfo() {
        return {
            level: config.level,
            state: this._getStateFriendlyName(),
            players: {
                current: Object.keys(this._players).length,
                max: this._maxPlayers
            }
        }
    }

    _update() {
        if(this._state == GameStates.game) {
            var now = Date.now();
            var dt = now - this._lastUpdate - this._levelUpdateTime;
            this._lastUpdate = now;
            physics.world.step((1/500)*dt);
            for(var i = 0; i < this._teams.length; i++) {
                this._teams[i].update(dt);
            }
            this._levelUpdateTime = this._level.update();

            for(var i = 0; i < this._teams.length; i++) {
                if(this._teams[i].isDefeated()) {
                    var winningTeam = (i+1)%this._teams.length;
                    var winningPlayer = this._teams[winningTeam].getPlayer();
                    var winnerUsername = this._players[winningPlayer].token.sub;
                    var loserPlayer = this._teams[i].getPlayer();
                    var loserUsername = this._players[loserPlayer].token.sub;
                    this._endGame(winnerUsername, loserUsername, 5000);
                    break;
                }
            }
        }
        else if(this._state == GameStates.lobby) {

        }
        else if(this._state == GameStates.end) {

        }
    }

    _reset() {
        console.log('Game._reset - Start');
        this._teams = [];
        this._activeTeam = -1;
        this._players = {};
        this._level = undefined;
        this._state = GameStates.lobby;
        this._lastUpdate = Date.now();
        this._levelUpdateTime = 0;
        this._winner = undefined;
        this._winnerScore = 0;
        clearInterval(this._updateInterval);
        console.log('Game._reset - End');
    }

    _startGame() {
        console.log('Game._startGame - Start');
        physics.init();
        this._level = new Level(config.level, () => {
            this._buildTeams();
            this._activeTeam = 0;
            this._teams[this._activeTeam].nextWorm();
            this._state = GameStates.game;
            this._lastUpdate = Date.now();
            clearInterval(this._updateInterval);
            this._updateInterval = setInterval(() => {
                this._update();
            }, 0);
            console.log('Game started!');
        });
        console.log('Game._startGame - End');
    }

    _endGame(winner, loser, score) {
        this._state = GameStates.end;
        this._winner = winner;
        this._winnerScore = score;
        apiClient.saveMatch({
            username: winner,
            vs: loser,
            won: true,
            score: score
        }, () => {});

        apiClient.saveMatch({
            username: loser,
            vs: winner,
            won: false,
            score: Math.floor(score/2)
        }, () => {});
        ioServer.send(ioServer.events.codes.gameOver, this.getGameState());
        ioServer.closeAllConnections();
        this._reset();
    }

    _buildTeams() {
        this._teams = [];
        for(var i = 0; i < config.teams; i++) {
            this._teams.push(new Team());
        }

        var spawnPoints = this._level.spawnPoints();
        for(var i = 0, n = 0; i < this._teams.length*config.team_size; i++) {
            this._teams[n].addWorm(new Worm(i, spawnPoints[i]));
            n = (n+1)%this._teams.length;
        }

        var playerIds = Object.keys(this._players);
        if(playerIds.length == 1) {
            for(var i = 0; i < this._teams.length; i++) {
                this._teams[i].addPlayer(playerIds[0], this._players[playerIds[0]].token.sub);
            }
        }
        else {
            for(var i = 0, n = 0; i < playerIds.length; i++) {
                this._teams[n].addPlayer(playerIds[i], this._players[playerIds[i]].token.sub);
                n = (n+1)%this._teams.length;
            }
        }
    }

    _getStateFriendlyName() {
        switch (this._state) {
            case GameStates.lobby:
                return 'Lobby';
            case GameStates.game:
                return 'In Game';
            case GameStates.end:
                return 'Game Over';
            default:
                return '';
        }
    }
}