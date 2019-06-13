var ioServer = require('../../../../network/ioServer');
var physics = require('../../physics');
var game = require('../../../game');
var Worm = require('../../worm');

module.exports.explosion = (centerX, centerY, radius, damage, force) => {

    // Convert units from meters (used by the physics engine) to pixels (Used by everything else. Level, clients, etc.)
    var pixelCenterX = physics.metersToPixels(centerX);
    var pixelCenterY = physics.metersToPixels(centerY);
    var pixelRadius = physics.metersToPixels(radius);
    
    // Destroy terrain
    game.getInstance().getLevel().destroyTerrain(pixelCenterX, pixelCenterY, pixelRadius);
   
    // Send explosion message to clients
    var payload = ioServer.events.payloads.explosion;
    payload.x = pixelCenterX;
    payload.y = pixelCenterY;
    payload.r = pixelRadius;
    ioServer.send(ioServer.events.codes.explosion, payload);

    physics.query(physics.Vec2(centerX, centerY), radius, (gameObject) => {
        if(gameObject && gameObject instanceof Worm) {
            var wormPos = gameObject.getPosition();
            var direction = physics.Vec2(wormPos.x-centerX, wormPos.y-centerY);
            var distance = direction.length();
            direction.normalize();
            distance = distance > radius ? radius : distance;
            var scale = distance/radius;
            var scaledDamage = damage - (scale*damage);
            var scaledForce = force - (scale*force);
            gameObject.hit(Math.floor(scaledDamage), physics.Vec2(direction.x*scaledForce, direction.y*scaledForce));
        }
    });
}