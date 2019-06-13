var physics = require('../../physics');
var weaponEffects = require('./weaponEffects');
var weaponCodes = require('./weaponsCodes');
var Weapon = require('./weapon');

module.exports = class Dynomite extends Weapon {

    constructor() {
        super(weaponCodes.shotgun);

        this._hitRadius = 1.5;
        this._hitForce = 10;
        this._shootRadius = 600;
        this._damage = 20;
    }

    activate(worm) {
        super.activate(worm);

        var wormPos = this._worm.getPosition();
        var wormTargetDir = this._worm.getTarget();
        var direction = physics.Vec2.add(wormPos, wormTargetDir.mul(physics.pixelsToMeters(this._shootRadius)));

        physics.raycastResult.reset();
        physics.world.rayCast(wormPos, direction, physics.raycastResult.closestCallback);
        if (physics.raycastResult.hit) {
            let hitPoint = physics.raycastResult.point;
            weaponEffects.explosion(hitPoint.x, hitPoint.y, this._hitRadius, this._damage, this._hitForce);
            this.deactivate(true);
        }
        this.deactivate(false);
    }

    update(dt) {
        super.update(dt);
    }

    getState() {
        return super.getState();
    }
}