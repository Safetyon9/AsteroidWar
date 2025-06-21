import {
    Sprite,
    Texture
} from 'pixi.js';

export class Laser extends Sprite {
    speed: number = 10;

    constructor(texture: Texture, x: number, y: number) {
        super(texture);
        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
    }
    
    update() {
        this.y -= this.speed;
    }

    isOffScreen() : boolean {
        return this.y < -20;
    } 

}