import {
    Application,
    Assets,
    Container,
    Sprite
} from 'pixi.js';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();

    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const container = new Container();

    app.stage.addChild(container);

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    const bunny = new Sprite(texture);
    container.addChild(bunny);
    bunny.scale.set(4,4);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    bunny.interactive = true;

    bunny.on('pointerover', () => {
        app.view.style.cursor = 'pointer';
    });

    bunny.on('pointerout', () => {
        app.view.style.cursor = 'default';
    });

    let isRotating = false;

    bunny.on('pointerdown', () => {
        isRotating = !isRotating;
    });

    app.ticker.add((time) => {
        if(isRotating) {
            container.rotation -= 0.05 * time.deltaTime;
        }
    });

    return app;
};