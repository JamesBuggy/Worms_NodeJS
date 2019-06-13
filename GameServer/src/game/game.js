
class Game {

    constructor() {
        this._gameInstance = undefined;
    }

    init(gameInstance) {
        this._gameInstance = gameInstance;
    }

    getInstance() {
        return this._gameInstance;
    }
}

module.exports = new Game();