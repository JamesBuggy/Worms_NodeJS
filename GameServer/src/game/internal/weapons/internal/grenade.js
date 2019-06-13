var physics = require('../../physics');
var weaponEffects = require('./weaponEffects');
var weaponCodes = require('./weaponsCodes');
var Throwable = require('./throwable');

module.exports = class Grenade extends Throwable {

    constructor() {
        super(weaponCodes.grenade, 10);

        this._ttlo = 3000;
        this._ttl = this._ttlo;
        this._detonationRadius = 2;
        this._detonationForce = 10;
        this._damage = 15;
        this._fixtureRadius = 10;

        this._bodyDef = {
            type: physics.DYNAMIC,
            allowSleep: false,
            fixedRotation: false,
            position: physics.Vec2.zero(),
            userData: this
        }
        this._fixtureDef = {
            shape: physics.Circle(physics.pixelsToMeters(this._fixtureRadius)),
            density: 5,
            friction: 0.5,
            restitution: 0.8
        }
    }

    activate(worm) {
        super.activate(worm);
        this._worm.lock();
        this._ttl = this._ttlo;
        var thrown = this._throw();
        if (!thrown) {
            this.deactivate(false);
        }
    }

    deactivate(endTurn) {
        this._worm.unlock();
        super.deactivate(endTurn);
    }

    update(dt) {
        super.update(dt);
        this._ttl = this._ttl - dt;
        if(this._ttl <= 0) {
            this._detonate();
            this.deactivate(true);
        }
    }

    getState() {
        return super.getState();
    }

    _detonate() {
        var position = this._body.getPosition();
        weaponEffects.explosion(position.x, position.y, this._detonationRadius, this._damage, this._detonationForce);
    }
}