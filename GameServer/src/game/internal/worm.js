var physics = require('./physics');

module.exports = class Worm {

    constructor(id, pos) {
        this._id = id;
        this._name = '';
        this._health = 20;
        this._team = undefined;
        this._locked = false;
        this._alive = true;
        this._target = physics.Vec2(1, 0);
        this._fixtureRadius = 15;
        this._jumpForce = physics.Vec2(1, -6);
        this._body = physics.world.createBody({
            type: physics.DYNAMIC,
            allowSleep: false,
            fixedRotation: true,
            position: physics.Vec2(physics.pixelsToMeters(pos.x), physics.pixelsToMeters(pos.y)),
            userData: this
        });
        this._body.createFixture({
            shape: physics.Circle(physics.pixelsToMeters(this._fixtureRadius)),
            density: 15,
            friction: 1.0,
            restitution: 0.1
        });
        this._direction = 1;
        this._speed = 2;
    }

    update(dt) {
        
    }

    move(direction) {
        if(this._locked)
            return;

        this._direction = direction;
        this._target.x = Math.abs(this._target.x) * this._direction;

        //var linearVelocity = this._body.getLinearVelocity();
        //this._body.setLinearVelocity(physics.Vec2(physics.pixelsToMeters(this._speed)*direction, linearVelocity.y));
        
        var position = this._body.getPosition();
        this._body.setPosition(physics.Vec2(position.x + (physics.pixelsToMeters(this._speed)*direction), position.y));
    }

    jump() {
        if(this._locked) {
            return;
        }

        var wormPos = this.getPosition();
        var castRadius = physics.pixelsToMeters(this._fixtureRadius + 7);
        physics.raycastResult.reset();
        physics.world.rayCast(wormPos, physics.Vec2(wormPos.x, wormPos.y + castRadius), physics.raycastResult.anyCallback);
        if (physics.raycastResult.hit) {
            this._body.setLinearVelocity(physics.Vec2(this._jumpForce.x * this._direction, this._jumpForce.y));
        }
    }

    shoot() {
        var arsenal = this._team.getArsenal();
        arsenal.useSelected(this);
    }

    hit(damage, force) {
        if(this._alive) {
            this._health -= damage;

            if(force) {
                this._body.setLinearVelocity(force);
            }

            if(this._health <= 0) {
                this._alive = false;
            }
        }
    }

    isAlive() {
        return this._alive;
    }

    getPosition() {
        return this._body.getPosition();
    }

    getDirection() {
        return this._direction;
    }

    getTarget() {
        this._target.normalize();
        return this._target;
    }

    setTarget(direction) {
        this._target.x = direction.x;
        this._target.y = direction.y;
        this._target.normalize();
        this._direction = this._target.x < 0 ? -1 : 1;
    }

    selectWeapon(weapon) {
        var arsenal = this._team.getArsenal();
        arsenal.setSelectedWeapon(weapon);
    }

    lock() {
        this._locked = true;
    }

    unlock() {
        this._locked = false;
    }
    
    setTeam(team) {
        this._team = team;
    }

    setName(name) {
        this._name = name;
    }

    beginContact(contact) {
        
    }

    endContact(contact) {

    }

    preSolve(contact, oldManifold) {

    }

    postSolve(contact, impulse) {
        
    }

    getState() {
        var position = this._body.getPosition();
        return {
            position: {
                x: physics.metersToPixels(position.x),
                y: physics.metersToPixels(position.y),
            },
            aim: {
                x: this.getTarget().x,
                y: this.getTarget().y
            },
            rotation: this._body.getAngle(),
            direction: this._direction,
            name: this._name,
            health: this._health,
            alive: this._alive
        };
    }
}