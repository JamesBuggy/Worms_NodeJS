import { Utilities } from './utilities'
import { GameAssetManager } from './gameAssetManager'
import { Smoke } from './effects'

enum GameStates {
    Lobby = 1,
    Game = 2,
    End = 3
}

export class WorldProperties {
    scale: number; // Render scale of the game world
    offset: { // Camera offset coordinates (Camera position)
        x: number,
        y: number
    };
}

export class Renderer {
    
    // Cached game state to render, updated when a new state is recieved
    private animationLoopId: number;
    private gameState: any;
    private loading: boolean;
    private levelName: string;
    private target: HTMLElement;
    private assetManager: GameAssetManager;
    private targetDistance: number;

    // Offscreen canvas, used to store terrain data. Masked based on terrain deformation
    private terrainCanvas: HTMLCanvasElement;
    private terrainContext: CanvasRenderingContext2D;

    // Offscreen canvas, used to store background image
    private backgroundCanvas: HTMLCanvasElement;
    private backgroundContext: CanvasRenderingContext2D;

    // Offscreen canvas, used to to render the game state at full scale
    private preRenderCanvas: HTMLCanvasElement;
    private preRenderContext: CanvasRenderingContext2D;

    // Context for the onscreen canvas, used to render a portion of the preRenderCanvas
    private onscreenCanvas: HTMLCanvasElement;
    private onscreenContext: CanvasRenderingContext2D;

    // Camera properties, defines the portion of the preRenderCanvas to render to the onscreen canvas
    private cameraScale: number;
    private cameraWidth: number;
    private cameraHeight: number;
    private cameraPos: {x: number, y: number};

    // Game effects (smoke)
    private effects: any[];

    constructor(target: HTMLElement, onscreenCanvas: HTMLCanvasElement, levelName: string, onComplete) {

        this.gameState = undefined;
        this.loading = true;
        this.levelName = levelName;
        this.target = target;
        this.assetManager = new GameAssetManager();
        this.targetDistance = 150;
        this.effects = [];

        // Onscreen canvas setup
        this.onscreenCanvas = onscreenCanvas;
        this.onscreenCanvas.width = 1920;
        this.onscreenCanvas.height = this.onscreenCanvas.width/1.777;
        this.onscreenContext = this.onscreenCanvas.getContext('2d');

        // Terrain canvas setup
        this.terrainCanvas = document.createElement('canvas');
        this.terrainCanvas.width = this.onscreenCanvas.width;
        this.terrainCanvas.height = this.onscreenCanvas.height;
        this.terrainContext = this.terrainCanvas.getContext('2d');

        // Background canvas setup
        this.backgroundCanvas = document.createElement('canvas');
        this.backgroundCanvas.width = this.onscreenCanvas.width;
        this.backgroundCanvas.height = this.onscreenCanvas.height;
        this.backgroundContext = this.backgroundCanvas.getContext('2d');

        // Pre render canvas setup
        this.preRenderCanvas = document.createElement('canvas');
        this.preRenderCanvas.width = this.onscreenCanvas.width;
        this.preRenderCanvas.height = this.onscreenCanvas.height;
        this.preRenderContext = this.preRenderCanvas.getContext('2d');

        // Camera setup
        this.cameraScale = 2;
        this.cameraWidth = this.onscreenCanvas.width/this.cameraScale;
        this.cameraHeight = this.onscreenCanvas.height/this.cameraScale;
        this.cameraPos = {
            x: 0,
            y: 0
        };

        // Hide target initially
        this.target.style.left = '-100px';
        this.target.style.top = '-100px';

        // Sprites
        this.assetManager.LoadAssets(() => {
            this.terrainContext.drawImage(this.assetManager.assets[this.levelName], 0, 0);
            this.backgroundContext.drawImage(this.assetManager.assets[this.levelName + "_Background"], 0, 0);
            this.loading = false;
            this.animationLoopId = window.requestAnimationFrame(this.render);
            onComplete();
        });

        // Render loading message
        this.renderMessage('Loading...');
    }

    getWorldProperties(): WorldProperties {
        var props = new WorldProperties();
        props.scale = this.cameraScale;
        props.offset = this.cameraPos;
        return props;
    }

    // Destroy the renderer
    destroy(): void {
        if (this.animationLoopId) {
            window.cancelAnimationFrame(this.animationLoopId);
        }
    }

    updateGameState(gameState: any): void {
        this.gameState = gameState;
    }

    // Remove a circle of the terrain image, render explosion smoke
    maskTerrain(x: number, y: number, radius: number): void {
        this.terrainContext.save();
        this.terrainContext.fillStyle = 'rgba(0, 0, 0, 0)';
        this.terrainContext.beginPath();
        this.terrainContext.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.terrainContext.clip();
        this.terrainContext.clearRect(0, 0, this.terrainCanvas.width, this.terrainCanvas.height);
        this.terrainContext.restore();

        var smokeCount = 50;
        for (let i = 0; i < smokeCount; i++) {
            let posX = x + (Math.random() * (radius) - radius/2);
            let posY = y + (Math.random() * (radius) - radius/2);
            let dirX = posX - x;
            let dirY = posY - y;
            this.effects.push(new Smoke({ x: posX, y: posY }, { x: dirX, y: dirY }, 2, 1));
        }
    }

    // Render the gamestate
    render: FrameRequestCallback = () => {
        
        // If game state is undefined or if the client is still loading assets
        if(this.gameState == undefined || this.loading) {
            
        }
        // or if game is in the 'Lobby' state
        else if(this.gameState.state == GameStates.Lobby) {
            // Render waiting message
            this.renderMessage('Waiting for players...');
        }
        // or if game is in the 'Game Over' state
        else if(this.gameState.state == GameStates.End) {
            // Render game over message
            this.renderMessage(`Winner: ${this.gameState.winner}, Score: ${this.gameState.score}`);
        }
        // or if game is in the 'In Game' state
        else if(this.gameState.state ==  GameStates.Game) {

            // Clear the pre render canvas
            this.preRenderContext.clearRect(0, 0, this.preRenderCanvas.width, this.preRenderCanvas.height);

            // Render current terrain state from the terrain canvas
            this.preRenderContext.drawImage(this.terrainCanvas, 0, 0);

            // Render worms
            this.renderWorms();

            // Render debug data if present in the game state
            if(this.gameState.debug)
                this.renderDebug();

            // Position camera above the active worm
            var worm = Utilities.getActiveWorm(this.gameState);
            this.cameraPos.x = worm.position.x - (this.cameraWidth/2);
            this.cameraPos.y = worm.position.y - (this.cameraHeight/2);

            // Keep camera within canvas bounds
            var upperX = this.onscreenCanvas.width - this.cameraWidth;
            var upperY = this.onscreenCanvas.height - this.cameraHeight;
            if(this.cameraPos.x < 0) this.cameraPos.x = 0;
            if(this.cameraPos.x > upperX) this.cameraPos.x = upperX;
            if(this.cameraPos.y < 0) this.cameraPos.y = 0;
            if(this.cameraPos.y > upperY) this.cameraPos.y = upperY;

            // Set target position
            if(worm.alive) {
                var wormScreenPos = Utilities.worldToScreen(this.onscreenCanvas, worm.position.x, worm.position.y, this.getWorldProperties());
                var targetX = (wormScreenPos.x + worm.aim.x*this.targetDistance)-(this.target.clientWidth/2);
                var targetY = (wormScreenPos.y + worm.aim.y*this.targetDistance)-(this.target.clientHeight/2);
                this.target.style.left = targetX+'px';
                this.target.style.top = targetY+'px';
            }
            else {
                // Hide target
                this.target.style.left = '-100px';
                this.target.style.top = '-100px';
            }

            // Update effects
            var smokeSprite = this.assetManager.assets['Smoke_Round'];
            for(let i = 0; i < this.effects.length; i++) {
                this.effects[i].update();
                let position = this.effects[i].getPosition();
                let scale = this.effects[i].getScale();
                let width = smokeSprite.width*scale;
                let height = smokeSprite.height*scale;
                this.preRenderContext.drawImage(smokeSprite, 
                    position.x-(width/2), position.y-(height/2), 
                    width, height);
            }
            this.effects = this.effects.filter((effect) => {
                return effect.keepAlive();
            });

            // Render background to the onscreen canvas
            this.onscreenContext.drawImage(this.backgroundCanvas,
                0, 0, this.onscreenCanvas.width, this.onscreenCanvas.height);

            // Render portion of the pre render canvas to the onscreen canvas
            this.onscreenContext.drawImage(this.preRenderCanvas,
                this.cameraPos.x, this.cameraPos.y, this.cameraWidth, this.cameraHeight,
                0, 0, this.onscreenCanvas.width, this.onscreenCanvas.height);
        }
        
        // Queue next animation frame
        this.animationLoopId = window.requestAnimationFrame(this.render);
    }

    // Render the worms and their selected weapon
    renderWorms(): void {
        this.preRenderContext.font = '20px bold Sans-serif';
        this.preRenderContext.strokeStyle = 'black';
        this.preRenderContext.lineWidth = 3;
        var arsenal = Utilities.getTeamArsenal(this.gameState);
        var wormSprite = this.assetManager.assets['Worm'];
        var tombstoneSprite = this.assetManager.assets['Tombstone'];

        for(var i = 0; i < this.gameState.teams.length; i++) {

            if(i === 0) {
                this.preRenderContext.fillStyle = '#ff8183';
            }
            else {
                this.preRenderContext.fillStyle = '#8481ff';
            }
            
            for(var j = 0; j < this.gameState.teams[i].worms.length; j++) {
                var worm = this.gameState.teams[i].worms[j];

                if(worm.alive) {
                    var nameWidth = this.preRenderContext.measureText(worm.name).width;
                    var healthWidth = this.preRenderContext.measureText(worm.health).width;
                    this.preRenderContext.strokeText(worm.name, worm.position.x-nameWidth/2, worm.position.y-50);
                    this.preRenderContext.fillText(worm.name, worm.position.x-nameWidth/2, worm.position.y-50);
                    this.preRenderContext.strokeText(worm.health, worm.position.x-healthWidth/2, worm.position.y-30);
                    this.preRenderContext.fillText(worm.health, worm.position.x-healthWidth/2, worm.position.y-30);

                    this.preRenderContext.save();
                    this.preRenderContext.translate(worm.position.x, 0);
                    this.preRenderContext.scale(worm.direction, 1);
                    this.preRenderContext.drawImage(wormSprite, 
                        -(wormSprite.width/2), worm.position.y-(wormSprite.height/2), 
                        wormSprite.width, wormSprite.height);

                    if(worm.active && this.gameState.teams[i].active) {
                        let weaponSprite = this.assetManager.assets["Equiped_"+arsenal.selected];
                        this.preRenderContext.drawImage(weaponSprite, -(weaponSprite.width/2), worm.position.y-(weaponSprite.height/2), weaponSprite.width, weaponSprite.height);
                    }
                    this.preRenderContext.restore();

                    if(worm.active && this.gameState.teams[i].active) {
                        let weaponSprite = this.assetManager.assets["Active_"+arsenal.selected];
                        if(weaponSprite && arsenal.activeWeapon) {
                            this.preRenderContext.save();
                            this.preRenderContext.translate(arsenal.activeWeapon.position.x, arsenal.activeWeapon.position.y);
                            this.preRenderContext.rotate(arsenal.activeWeapon.rotation);
                            this.preRenderContext.drawImage(weaponSprite, -(weaponSprite.width/2), -(weaponSprite.height/2), weaponSprite.width, weaponSprite.height);
                            this.preRenderContext.restore();

                            if(arsenal.selected == "ROCKET") {
                                this.effects.push(new Smoke({ 
                                    x: arsenal.activeWeapon.position.x, 
                                    y: arsenal.activeWeapon.position.y
                                }, { 
                                    x: 0.1, 
                                    y: 0.1
                                }, 1, 0.5));
                            }
                        }
                    }
                }
                else {
                    this.preRenderContext.drawImage(tombstoneSprite, 
                        worm.position.x-(tombstoneSprite.width/2), worm.position.y-(tombstoneSprite.height/2), 
                        tombstoneSprite.width, tombstoneSprite.height);
                }
            }
        }
    }

    // Render physics debug data
    renderDebug(): void {
        for(var i = 0; i < this.gameState.debug.physics.bodies.length; i++) {
            var body = this.gameState.debug.physics.bodies[i];
            if(body.type == 'static')
                this.preRenderContext.fillStyle = 'rgba(0, 0, 200, 0.5)';
            else {
                this.preRenderContext.fillStyle = 'rgba(0, 200, 0, 0.5)';
            }

            if(body.shape == 'polygon') {
                this.preRenderContext.fillRect(
                    body.x - (body.width/2),
                    body.y - (body.height/2),
                    body.width,
                    body.height);
            }
            else if(body.shape == 'circle') {
                this.preRenderContext.beginPath();
                this.preRenderContext.arc(body.x, body.y, body.radius, 0, 2 * Math.PI);
                this.preRenderContext.fill();
            }
        }
    }

    // Render a message on the onscreen canvas
    renderMessage(message: string): void {
        this.onscreenContext.fillStyle = '#000000';
        this.onscreenContext.fillRect(0, 0, this.onscreenCanvas.width, this.onscreenCanvas.height);
        this.onscreenContext.textAlign = "center";
        this.onscreenContext.font = '80px bold Sans-serif';
        this.onscreenContext.strokeStyle = 'black';
        this.onscreenContext.lineWidth = 3;
        
        this.onscreenContext.fillStyle = '#ffffff';
        this.onscreenContext.strokeText(message, this.onscreenCanvas.width/2, this.onscreenCanvas.height/2);
        this.onscreenContext.fillText(message, this.onscreenCanvas.width/2, this.onscreenCanvas.height/2);
    }
}