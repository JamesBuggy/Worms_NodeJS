var physics = require('../../physics');
var weaponEffects = require('./weaponEffects');
var weaponCodes = require('./weaponsCodes');
var Throwable = require('./throwable');

module.exports = class Rocket extends Throwable {

    constructor() {
        super(weaponCodes.rocket, 15);

        this._ttlo = 2000;
        this._ttl = this._ttlo;
        this._shouldDetonate = false;
        this._detonationRadius = 2;
        this._detonationForce = 13;
        this._damage = 20;
        this._fixtureRadius = 5;

        this._bodyDef = {
            type: physics.DYNAMIC,
            allowSleep: false,
            fixedRotation: false,
            position: physics.Vec2.zero(),
            gravityScale: 0,
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
        this._shouldDetonate = false;
        this._worm.unlock();
        super.deactivate(endTurn);
    }

    update(dt) {
        super.update(dt);
        this._ttl = this._ttl - dt;
        if(this._shouldDetonate || this._ttl <= 0) {
            this._detonate();
            this.deactivate(true);
        }

        // Set body rotation to match its velocity
        var velocity = this._body.getLinearVelocity();
        var angle = Math.atan2(velocity.y, velocity.x);
        this._body.setAngle(angle);
    }

    beginContact(contact) {
        this._shouldDetonate = true;
    }

    getState() {
        return super.getState();
    }

    _detonate() {
        var position = this._body.getPosition();
        weaponEffects.explosion(position.x, position.y, this._detonationRadius, this._damage, this._detonationForce);
        this._destroyBody();
    }
}