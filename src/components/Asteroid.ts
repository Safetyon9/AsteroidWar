import {
    Container,
    Sprite,
    Texture,
    Graphics
} from 'pixi.js';
import * as SAT from 'sat';

import polygon0 from '../assets/asteroids/asteroid1_polygon.json';
import polygon1 from '../assets/asteroids/asteroid2_polygon.json';
import polygon2 from '../assets/asteroids/asteroid3_polygon.json';
import polygon3 from '../assets/asteroids/asteroid4_polygon.json';
import polygon4 from '../assets/asteroids/asteroid5_polygon.json';
import polygon5 from '../assets/asteroids/asteroid6_polygon.json';


const polygonsJSON = [polygon0, polygon1, polygon2, polygon3, polygon4, polygon5];

export class Asteroid extends Container {
    public sprite: Sprite;
    public polygon: SAT.Polygon;
    private speed: number;
    private debugPolygon: Graphics;
    //private rotation_multi: number;

    constructor(x: number, y: number, speed: number, scale: number, variant: number, texture: Texture /*, rotation_multi: number*/) {
        super();

        this.sprite = new Sprite(texture);
        this.sprite.scale.set(scale);
        this.addChild(this.sprite);

        this.x = x;
        this.y = y;
        this.speed = speed;
        //this.rotation_multi = rotation_multi;

        const verticesArray = polygonsJSON[variant];
        const points = verticesArray.map(([x, y]) => new SAT.Vector(x, y));
        const scaledPoints = points.map(point => new SAT.Vector(point.x*scale, point.y*scale));

        this.polygon = new SAT.Polygon(new SAT.Vector(x, y), scaledPoints);

        this.debugPolygon = new Graphics();
        this.drawPolygon();
        this.addChild(this.debugPolygon);

        
        this.eventMode = 'static'; 
    }

    
    private drawPolygon() {
        this.debugPolygon.clear();

        this.debugPolygon.lineStyle(2, 0x00ff00);
        this.debugPolygon.beginFill(0xff0000, 0.2);
        const points = this.polygon.points;

        if (points.length > 0) {
            const first = points[0];
            this.debugPolygon.moveTo(first.x, first.y);
            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                this.debugPolygon.lineTo(p.x, p.y);
            }
            this.debugPolygon.lineTo(first.x, first.y);
        }

        this.debugPolygon.endFill();
    }
    

    update(delta: number) {
        //this.rotation += 0.01 * delta * this.rotation_multi;
        this.y += this.speed * delta;

        this.polygon.pos.y = this.y;
        this.polygon.pos.x = this.x;
    }

    isOffScreen() : boolean {
        return this.y > window.innerHeight + 50;
    } 

    getPolygon() : SAT.Polygon {
        return this.polygon;
    }

}