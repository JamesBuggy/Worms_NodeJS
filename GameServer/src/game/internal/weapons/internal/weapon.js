var game = require('../../../game');

module.exports = class Weapon {

    constructor(weapondCode) {
        this._code = weapondCode;
        this._worm = undefined;
        this._isActive = false;
    }

    activate(worm) {
        this._worm = worm;
        this._isActive = true;
    }

    deactivate(endTurn) {
        this._isActive = false;
        if(endTurn) {
            game.getInstance().nextTurn();
        }
    }

    update(dt) {

    }

    isActive() {
        return this._isActive;
    }

    getState() {
        return {};
    }
}