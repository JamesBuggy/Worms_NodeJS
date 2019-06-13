var Arsenal = require('./weapons/arsenal');
var apiClient = require('../../network/apiClient');

module.exports = class Team {

    constructor() {
        this._activeWorm = -1;
        this._name = '';
        this._worms = [];
        this._player = undefined;
        this._controllers = {};
        this._arsenal = new Arsenal();
        this._defaultName = 'Warlords';
        this._deafualtWorms = [
            { name: 'Hannibal' }, 
            { name: 'Ghengis' }, 
            { name: 'Ming' }, 
            { name: 'Attila' }
        ];
    }

    update(dt) {
        this._arsenal.update(dt);
        for(var i = 0; i < this._worms.length; i++) {
            this._worms[i].update(dt);
        }
    }

    getArsenal() {
        return this._arsenal;
    }

    getPlayer() {
        return this._player;
    }

    activeWorm() {
        return this._worms[this._activeWorm];
    }
    
    nextWorm() {
        this._activeWorm = (this._activeWorm+1)%this._worms.length;
        var wormsChecked = 1;
        while(!this.activeWorm().isAlive() && wormsChecked <= this._worms.length) {
            this._activeWorm = (this._activeWorm+1)%this._worms.length;
            wormsChecked++;
        }
    }

    addWorm(worm) {
        worm.setTeam(this);
        this._worms.push(worm);
    }

    addPlayer(playerId, playerUsername) {
        this._player = playerId;
        apiClient.getTeam(playerUsername, (team) => {
            if(team) {
                this._name = team.name;
                for (let i = 0; i < team.worms.length; i++) {
                    const worm = team.worms[i];
                    this._worms[i].setName(worm.name);
                }
            }
            else {
                this._name = this._defaultName
                for (let i = 0; i < this._deafualtWorms.length; i++) {
                    const worm = this._deafualtWorms[i];
                    this._worms[i].setName(worm.name);
                }
            }
        });
    }

    removePlayer(player) {
        if(this._player === player) {
            for(var i = 0; i < this._worms.length; i++) {
                this._worms[i].hit(999, null);
            }
        }
    }

    isDefeated() {
        return this._worms.filter(function (worm) {
            return worm.isAlive();
        }).length === 0;
    }

    getState() {
        var state = {};
        state.arsenal = this._arsenal.getState();
        state.worms = [];
        for(var i = 0; i < this._worms.length; i++) {
            var wormState = this._worms[i].getState();
            wormState.active = i === this._activeWorm;
            state.worms.push(wormState);
        }
        return state;
    }
}