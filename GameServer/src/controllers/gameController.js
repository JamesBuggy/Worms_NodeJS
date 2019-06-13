var game = require('../game/game');

module.exports.getState = () => {
    return game.getInstance().getGameState();
}

module.exports.authenticated = (socketId, decodedToken) => {
    return game.getInstance().addPlayer(socketId, decodedToken);
}

module.exports.disconnect = (socketId) => {
    game.getInstance().removePlayer(socketId);
}

module.exports.ready = (socketId) => {
    game.getInstance().readyPlayer(socketId);
}

module.exports.input = (socketId, input) => {

    var activeWorm = game.getInstance().getActiveWorm();

    if(!activeWorm || activeWorm.ownerId != socketId || !game.getInstance().isAcceptingInput()) {
        return;
    }

    if (input.action == "MOVE") {
        if(input.data.direction < 0) {
            activeWorm.worm.move(-1);
        }
        else {
            activeWorm.worm.move(1);
        }
    }
    else if (input.action == "TARGET") {
        activeWorm.worm.setTarget(input.data);
    }
    else if (input.action == "WEAPON") {
        activeWorm.worm.selectWeapon(input.data);
    }
    else if (input.action == "JUMP") {
        activeWorm.worm.jump();
    }
    else if (input.action == "SHOOT") {
        activeWorm.worm.shoot();
    }
}