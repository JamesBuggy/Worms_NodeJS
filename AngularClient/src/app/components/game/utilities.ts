import { WorldProperties } from './renderer'

export module Utilities {

    // Rotates a point around a center point by the given angle
    export function rotate(centerX, centerY, pointX, pointY, angle): any {
        var radians = (Math.PI / 180) * angle;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        return {
            x: (cos * (pointX - centerX)) + (sin * (pointY - centerY)) + centerX, 
            y: (cos * (pointY - centerY)) - (sin * (pointX - centerX)) + centerY
        };
    }

    // Returns the active worm on the active team
    export function getActiveWorm(gameState: any): any {
        if(gameState.state == 2) {
            for(var i = 0; i < gameState.teams.length; i++) {
                if(gameState.teams[i].active) {
                    for(var j = 0; j < gameState.teams[i].worms.length; j++) {
                        if(gameState.teams[i].worms[j].active) {
                            return gameState.teams[i].worms[j];
                        }
                    }
                }
            }
        }
        else {
            return undefined
        };
    }

    // Returns the arsenal state for the active team
    export function getTeamArsenal(gameState: any): any {
        if(gameState.state == 2) {
            for(var i = 0; i < gameState.teams.length; i++) {
                if(gameState.teams[i].active) {
                    return gameState.teams[i].arsenal;
                }
            }
        }
        else {
            return undefined
        };
    }

    // Converts a screen coordinate to a world coordinate
    export function screenToWorld(canvas: HTMLCanvasElement, screenX: number, screenY: number, worldProperties: WorldProperties): any {
        // Determine the scale of the canvas element (The element size will likely not equal the canvas bitmap size)
        var rect = canvas.getBoundingClientRect();
        var elementScaleX = canvas.width / rect.width;
        var elementScaleY = canvas.height / rect.height;
 
        // Use the canvas element scale and position to determine the world coordinate
        var worldX = (screenX - rect.left) * elementScaleX;
        var worldY = (screenY - rect.top) * elementScaleY;
 
        // Scale the world coordinate based on the render camera position and scale (worldOffset and worldScale)
        worldX = (worldX / worldProperties.scale) + worldProperties.offset.x;
        worldY = (worldY / worldProperties.scale) + worldProperties.offset.y;

        return { x: worldX, y: worldY };
    }

    // Converts a world coordinate to a screen coordinate
    export function worldToScreen(canvas: HTMLCanvasElement, worldX: number, worldY: number, worldProperties: WorldProperties): any {
        // Determine the scale of the canvas element (The element size will likely not equal the canvas bitmap size)
        var rect = canvas.getBoundingClientRect();
        var elementScaleX = canvas.width / rect.width;
        var elementScaleY = canvas.height / rect.height;

        // Scale the screen coordinate based on the render camera position and scale (worldOffset and worldScale)
        var screenX = (worldX - worldProperties.offset.x) * worldProperties.scale;
        var screenY = (worldY - worldProperties.offset.y) * worldProperties.scale;
 
        // Use the canvas element scale and position to determine the screen coordinate
        screenX = (screenX / elementScaleX); // + rect.left;
        screenY = (screenY / elementScaleY); // + rect.top;        
 
        return { x: screenX, y: screenY };
    }
}