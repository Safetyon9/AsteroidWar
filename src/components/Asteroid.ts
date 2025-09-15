import {
    Container,
    Sprite,
    Texture
    //Graphics
} from 'pixi.js';
import * as SAT from 'sat';

export class Asteroid extends Container {
    public sprite: Sprite;
    public polygon: SAT.Polygon;
    private speed: number;
    //private debugPolygon: Graphics;
    //private rotation_multi: number;

    constructor(texture: Texture, x: number, y: number, speed: number, scale: number/*, rotation_multi: number*/) {
        super();

        this.sprite = new Sprite(texture);
        this.sprite.scale.set(scale);
        this.addChild(this.sprite);

        this.x = x;
        this.y = y;
        this.speed = speed;
        //this.rotation_multi = rotation_multi;

        const points = [
            new SAT.Vector(53, 0),
            new SAT.Vector(29, 1),
            new SAT.Vector(9, 2),
            new SAT.Vector(0, 12),
            new SAT.Vector(2, 49),
            new SAT.Vector(4, 98),
            new SAT.Vector(23, 119),
            new SAT.Vector(54, 125),
            new SAT.Vector(68, 133),
            new SAT.Vector(83, 120),
            new SAT.Vector(86, 105),
            new SAT.Vector(99, 90),
            new SAT.Vector(72, 22),
        ];

        const scaledPoints = points.map(point => new SAT.Vector(point.x*scale, point.y*scale));

        this.polygon = new SAT.Polygon(new SAT.Vector(x, y), scaledPoints);

        //this.debugPolygon = new Graphics();
        //this.drawPolygon();
        //this.addChild(this.debugPolygon);

        
        this.eventMode = 'static'; 
    }

    /*
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
    */

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