
export class Smoke {

    private position: {
        x: number,
        y: number
    }

    private direction: {
        x: number,
        y: number
    }

    private speed: number;
    private scale: number;

    constructor(position: { x: number, y: number }, direction: { x: number, y: number }, speed: number, scale: number) {
        this.position = position;
        this.direction = direction;
        this.speed = speed;
        this.scale = scale;

        // Normalize the direction
        var magnitude = Math.sqrt(this.direction.x*this.direction.x + this.direction.y*this.direction.y);
        this.direction.x = this.direction.x/magnitude;
        this.direction.y = this.direction.y/magnitude;
    }

    update() {
        this.position.x += this.direction.x*this.speed;
        this.position.y += this.direction.y*this.speed;
        this.scale -= 0.03;
    }

    getPosition() {
        return this.position;
    }

    getScale() {
        return this.scale;
    }

    keepAlive() {
        return this.scale > 0;
    }
}