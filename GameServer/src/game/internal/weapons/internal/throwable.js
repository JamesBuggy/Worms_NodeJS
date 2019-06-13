var physics = require('../../physics');
var Weapon = require('./weapon');

module.exports = class Throwable extends Weapon {

    constructor(weapondCode, throwForce) {
        super(weapondCode);
        this._body = undefined;
        this._bodyDef = undefined;
        this._fixtureDef = undefined;
        this._throwForce = throwForce;
    }

    activate(worm) {
        super.activate(worm);
    }

    deactivate(endTurn) {
        super.deactivate(endTurn);
        this._destroyBody();
    }

    update(dt) {
        super.update(dt);
    }

    getState() {
        var state = super.getState();
        var position = this._body.getPosition();
        state.position = {
            x: physics.metersToPixels(position.x),
            y: physics.metersToPixels(position.y)
        };
        state.rotation = this._body.getAngle();
        return state;
    }

    beginContact(contact) {
        
    }

    endContact(contact) {

    }

    preSolve(contact, oldManifold) {

    }

    postSolve(contact, impulse) {
        
    }

    _createBody() {
        var wormPos = this._worm.getPosition();
        var wormTargetDir = this._worm.getTarget();
        var spawnPos = physics.Vec2.add(wormPos, wormTargetDir.mul(physics.pixelsToMeters(30)));
        physics.raycastResult.reset();
        physics.world.rayCast(wormPos, spawnPos, physics.raycastResult.anyCallback);
        if (!physics.raycastResult.hit) {
            this._bodyDef.position = spawnPos;
            this._body = physics.world.createBody(this._bodyDef);
            this._body.createFixture(this._fixtureDef);
            return true;
        }
        else {
            return false;
        }
    }

    _destroyBody() {
        if(this._body) {
            physics.world.destroyBody(this._body);
        }
    }

    _throw() {
        if (this._createBody()) {
            this._body.setLinearVelocity(this._worm.getTarget().mul(this._throwForce));
            return true;
        }
        else {
            return false;
        }
    }
}