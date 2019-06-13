var config = require('./configs/levelConfig');
var physics = require('./physics');
var getPixels = require("get-pixels");
var LevelBoundary = require('./levelBoundary');

module.exports = class Level {

    constructor(level, callback) {
        this._level = level;
        this._terrainData = [];
        this._terrainBodies = [];
        this._levelBoundaries = [];
        this._levelConfig = config[this._level];
        this._pendingDeformations = [];
        this.loadLevel(callback);
    }

    update() {
        var start = Date.now();
        this._processPendingDeformations();
        return Date.now() - start;
    }

    spawnPoints() {
        return this._levelConfig.spawnPoints;
    }

    destroyTerrain(x, y, radius) {
        this._pendingDeformations.push({
            x: x,
            y: y,
            r: radius
        });
    }

    loadLevel(onComplete) {
        getPixels('./assets/levels/'+this._levelConfig.terrain, (err, pixels) => {
            console.log('getPixels - Start');
            if(err) {
                console.log(err);
                return;
            }
            var lvlWidth = pixels.shape.slice()[0];
            var lvlHeight = pixels.shape.slice()[1];
            for(var x = 0; x < lvlWidth; x++) {
                this._terrainData[x] = [];
                for(var y = 0; y < lvlHeight; y++) {
                    this._terrainData[x].push(pixels.get(x, y, 3));
                }
            }
            this._generateTerrain();
            this._createBoundaries(lvlWidth, lvlHeight);
            console.log('getPixels - End');
            onComplete();
        })
    }

    _createBoundaries(lvlWidth, lvlHeight) {
        
        var offset = 50; // Used to move the boundary off screen
        var size = 20; // Width/height of each boundary

        // Bottom boundary
        this._levelBoundaries.push(new LevelBoundary(physics.Vec2(lvlWidth/2, lvlHeight+offset), physics.Vec2(lvlWidth/2, size)));
        
        // Left boundary
        this._levelBoundaries.push(new LevelBoundary(physics.Vec2(-offset, lvlHeight/2), physics.Vec2(size, lvlHeight/2)));
        
        // Right boundary
        this._levelBoundaries.push(new LevelBoundary(physics.Vec2(lvlWidth+offset, lvlHeight/2), physics.Vec2(size, lvlHeight/2)));
    }

    _generateTerrain() {
        console.log('generateTerrain - Start');
        while(this._terrainBodies.length > 0) {
            var body = this._terrainBodies.pop();
            physics.world.destroyBody(body);
        }
        var lvlWidth = this._terrainData.length;
        var lvlHeight = this._terrainData[0].length;
        var bodyHeight = 3;
        for(var y = 0; y < lvlHeight; y+=bodyHeight) {
            var bodyWidth = 0;
            for(var x = 0; x < lvlWidth; x++) {
                if(this._terrainData[x][y] == 255) {
                    bodyWidth++;
                    if (bodyWidth >= lvlWidth)
                    {
                        this._terrainBodies.push(physics.createBox(x-bodyWidth, y, bodyWidth, bodyHeight, physics.STATIC, true));
                        bodyWidth = 0;
                    }
                }
                else if (bodyWidth > 0)
                {
                    this._terrainBodies.push(physics.createBox(x-bodyWidth, y, bodyWidth, bodyHeight, physics.STATIC, true));
                    bodyWidth = 0;
                }
            }
        }
        console.log('generateTerrain - End');
    }

    _processPendingDeformations() {
        if(this._pendingDeformations.length == 0)
            return;

        var lvlWidth = this._terrainData.length;
        var lvlHeight = this._terrainData[0].length;
        for(var x = 0; x < this._pendingDeformations.length; x++) {
            var def = this._pendingDeformations[x];
            for(var i = Math.floor(def.x-def.r); i <= def.x+def.r; i++) {
                for(var j = Math.floor(def.y-def.r); j <= def.y+def.r; j++) {
                    if((i < 0 || i >= lvlWidth) || (j < 0 || j >= lvlHeight)) {
                        continue;
                    }
                    if(Math.sqrt(((def.x-i)*(def.x-i)) + ((def.y-j)*(def.y-j))) <= def.r) {
                        this._terrainData[i][j] = 0;
                    }
                }
            }
        }
        this._generateTerrain();
        this._pendingDeformations = [];
    }
}