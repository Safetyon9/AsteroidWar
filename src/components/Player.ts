import {
    Container,
    Sprite,
    Texture
} from 'pixi.js';

export class PlayerContainer extends Container {
    public sprite: Sprite;

    constructor(texture: Texture) {
        super();

        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(4,4);
        this.sprite.position.set(0, 0);

        this.addChild(this.sprite);

        this.eventMode = 'static';
        this.sprite.eventMode = 'static';
        this.sprite.interactive = true;
    }
}