import {
    Sprite,
    Texture
    //Graphics
} from 'pixi.js';
import SAT from 'sat';

export class Laser extends Sprite {
    private speed: number = 12;
    public polygon: SAT.Polygon;
    //private debugPolygon: Graphics;

    constructor(texture: Texture, x: number, y: number) {
        super(texture);

        this.x = x;
        this.y = y;

        const points = [
            new SAT.Vector(5,0),
            new SAT.Vector(2,0),
            new SAT.Vector(0,3),
            new SAT.Vector(0,18),
            new SAT.Vector(3,34),
            new SAT.Vector(18,34),
            new SAT.Vector(20,18),
            new SAT.Vector(21,3),
            new SAT.Vector(19,0),
            new SAT.Vector(16,0),
            new SAT.Vector(11,2),
        ];

        this.polygon = new SAT.Polygon(new SAT.Vector(x, y), points);

        //this.debugPolygon = new Graphics();
        //this.drawPolygon();
        //this.addChild(this.debugPolygon);
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
    
    update() {
        this.y -= this.speed;
        
        this.polygon.pos.y = this.y;
        this.polygon.pos.x = this.x;
    }

    isOffScreen() : boolean {
        return this.y < -20;
    } 

    getPolygon(): SAT.Polygon {
        return this.polygon;
    }

}