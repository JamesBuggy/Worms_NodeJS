var planck = require('planck-js');

var raycastResult = (function() {
    var def = {};
    def.reset = function() {
        def.hit = false;
        def.point = null;
        def.normal = null;
    };
  
    def.anyCallback = function(fixture, point, normal, fraction) {
        var body = fixture.getBody();
        var userData = body.getUserData();
        if (userData) {
            if (userData === 0) {
                return -1.0;
            }
        }
        def.hit = true;
        def.point = point;
        def.normal = normal;
        return 0.0;
    };

    def.closestCallback = function(fixture, point, normal, fraction) {
        var body = fixture.getBody();
        var userData = body.getUserData();
        if (userData) {
            if (userData === 0) {
                return -1.0;
            }
        }
        def.hit = true;
        def.point = point;
        def.normal = normal;
        return fraction;
    };
  
    return def;
})();
 
class Physics {
 
    constructor() {
        this.ppm = 30.0;
        this.world = undefined;
 
        // Planck imports
        this.Math = planck.Math;
        this.Vec2 = planck.Vec2;
        this.Vec3 = planck.Vec3;
        this.Mat22 = planck.Mat22;
        this.Mat33 = planck.Mat33;
        this.Transform = planck.Transform;
        this.Rot = planck.Rot;
        this.AABB = planck.AABB;
        this.Shape = planck.Shape;
        this.Fixture = planck.Fixture;
        this.Body = planck.Body;
        this.Contact = planck.Contact;
        this.Joint = planck.Joint;
        //this.World = planck.World;
        this.Circle = planck.Circle;
        this.Edge = planck.Edge;
        this.Polygon = planck.Polygon;
        this.Chain = planck.Chain;
        this.Box = planck.Box;

        this.raycastResult = raycastResult;
        this.STATIC = this.Body.STATIC;
        this.DYNAMIC = this.Body.DYNAMIC;
    }
 
    init() {
        this.world = planck.World({ gravity: this.Vec2(0.0, 9.8) });

        this.world.on('begin-contact', function(contact) {
        
            var fixtureAUserData = contact.getFixtureA().getBody().getUserData();
            var fixtureBUserData = contact.getFixtureB().getBody().getUserData();

            if (fixtureAUserData != null && fixtureAUserData.beginContact != null) {
                fixtureAUserData.beginContact(contact);
            }
            if (fixtureBUserData != null && fixtureBUserData.beginContact != null) {
                fixtureBUserData.beginContact(contact);
            }
        });

        this.world.on('end-contact', function(contact) {
        
            var fixtureAUserData = contact.getFixtureA().getBody().getUserData();
            var fixtureBUserData = contact.getFixtureB().getBody().getUserData();
            
            if (fixtureAUserData != null && fixtureAUserData.endContact != null) {
                fixtureAUserData.endContact(contact);
            }
            if (fixtureBUserData != null && fixtureBUserData.endContact != null) {
                fixtureBUserData.endContact(contact);
            };
        });

        this.world.on('pre-solve', function(contact, oldManifold) {
        
            var fixtureAUserData = contact.getFixtureA().getBody().getUserData();
            var fixtureBUserData = contact.getFixtureB().getBody().getUserData();
            
            if (fixtureAUserData != null && fixtureAUserData.preSolve != null) {
                fixtureAUserData.preSolve(contact, oldManifold);
            }
            if (fixtureBUserData != null && fixtureBUserData.preSolve != null) {
                fixtureBUserData.preSolve(contact, oldManifold);
            };
        });

        this.world.on('post-solve', function(contact, impulse) {
        
            var fixtureAUserData = contact.getFixtureA().getBody().getUserData();
            var fixtureBUserData = contact.getFixtureB().getBody().getUserData();
            
            if (fixtureAUserData != null && fixtureAUserData.postSolve != null) {
                fixtureAUserData.postSolve(contact, impulse);
            }
            if (fixtureBUserData != null && fixtureBUserData.postSolve != null) {
                fixtureBUserData.postSolve(contact, impulse);
            };
        });
    }

    pixelsToMeters(pixels) {
        return pixels/this.ppm;
    }

    metersToPixels(meters) {
        return meters*this.ppm;
    }
 
    createBox(x, y, width, height, type, fixedRotation) {
        var extents = this.Vec2(width/2, height/2);
        var body = this.world.createBody({
            type: type,
            fixedRotation : fixedRotation,
            position: this.Vec2(this.pixelsToMeters(x+extents.x), this.pixelsToMeters(y+extents.y))
        });
        body.createFixture({
            shape: this.Box(this.pixelsToMeters(extents.x), this.pixelsToMeters(extents.y)),
            friction: 1.0
        });
        return body;
    }

    query(position, radius, callback) {
        var queryAABB = this.AABB();
        queryAABB.lowerBound.set(this.Vec2(position.x-radius, position.y-radius));
        queryAABB.upperBound.set(this.Vec2(position.x+radius, position.y+radius));
        this.world.queryAABB(queryAABB, (fixture) => {
            let body = fixture.getBody();
            callback(body.getUserData());
            return true;
        });
    }

    getDebugInfo() {
        var debugInfo = {}
        debugInfo.bodies = [];
        for (var body = this.world.getBodyList(); body; body = body.getNext()) {
            
            var fixture = body.getFixtureList();
            var shape = fixture.getShape();
            var position = body.getPosition();
            var aabb = this.AABB();
            shape.computeAABB(aabb, body.getTransform());
            var extents = aabb.getExtents();

            debugInfo.bodies.push({
                type: body.getType(),
                shape: shape.getType(),
                width: this.metersToPixels(extents.x*2),
                height: this.metersToPixels(extents.y*2),
                radius: this.metersToPixels(shape.getRadius()),
                x: this.metersToPixels(position.x),
                y: this.metersToPixels(position.y)
            });
        }
        return debugInfo;
    }
}

module.exports = new Physics();
