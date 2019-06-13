var physics = require('./physics');
var game = require('../game');
var Worm = require('./worm');

/**
 * Used to kill worms if they leave the level/game space
 */
module.exports = class LevelBoundary {

    constructor(position, extents) {
        this._body = physics.world.createBody({
            type: physics.STATIC,
            fixedRotation: true,
            position: physics.Vec2(physics.pixelsToMeters(position.x), physics.pixelsToMeters(position.y)),
            userData: this
        });
        this._body.createFixture({
            shape: physics.Box(physics.pixelsToMeters(extents.x), physics.pixelsToMeters(extents.y)),
            isSensor: true
        });
    }

    beginContact(contact) {
        // Get game objects for each body involved in the collision
        var objectA = contact.getFixtureA().getBody().getUserData();
        var objectB = contact.getFixtureB().getBody().getUserData();

        // If one of them is a worm, kill it
        if(objectA && objectA instanceof Worm) {
            objectA.hit(999, null);
            contact.getFixtureA().getBody().setGravityScale(0);
            game.getInstance().nextTurn();
        }
        else if (objectB && objectB instanceof Worm) {
            objectB.hit(999, null);
            contact.getFixtureB().getBody().setGravityScale(0);
            game.getInstance().nextTurn();
        }
    }

    endContact(contact) {

    }

    preSolve(contact, oldManifold) {

    }

    postSolve(contact, impulse) {
        
    }
}