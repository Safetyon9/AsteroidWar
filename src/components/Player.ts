import {
    Container,
    Sprite,
    Texture,
    Graphics
} from 'pixi.js';
import SAT from 'sat';

export class PlayerContainer extends Container {
    public sprite: Sprite;
    public polygon: SAT.Polygon;
    private debugPolygon: Graphics;

    constructor(texture: Texture) {
        super();

        this.sprite = new Sprite(texture);
        this.addChild(this.sprite);

        const points = [
            new SAT.Vector(19, 0),
            new SAT.Vector(11, 27),
            new SAT.Vector(11, 38),
            new SAT.Vector(1, 51),
            new SAT.Vector(0, 57),
            new SAT.Vector(2, 61),
            new SAT.Vector(14, 56),
            new SAT.Vector(25, 56),
            new SAT.Vector(37, 61),
            new SAT.Vector(39, 57),
            new SAT.Vector(38, 52),
            new SAT.Vector(28, 38),
            new SAT.Vector(28, 27),
            new SAT.Vector(20, 0),
        ];
        this.polygon = this.polygon = new SAT.Polygon(new SAT.Vector(this.x, this.y), points);

        this.debugPolygon = new Graphics();
        this.drawPolygon();
        this.addChild(this.debugPolygon);

        this.eventMode = 'static';
        this.sprite.eventMode = 'static';
        this.sprite.interactive = true;
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

    update(asseX: number, asseY: number) {
        this.x += asseX;
        this.y += asseY;
        this.polygon.pos.x = this.x;
        this.polygon.pos.y = this.y;
    }

    getPolygon(): SAT.Polygon{
        return this.polygon;
    }

}