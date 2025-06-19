import {
    Application,
    Assets,
    Container,
    Sprite
} from 'pixi.js';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();

    await app.init({background: 'black', resizeTo: window});

    document.body.appendChild(app.canvas);

    const container = new Container();

    app.stage.addChild(container);

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

    const bunny = new Sprite(texture);
    container.addChild(bunny);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    container.pivot.x = container.width / 2;
    container.pivot.y = container.height / 2;

    app.ticker.add((time) => {
        container.rotation -= 0.01 * time.deltaTime;
    });

    return app;
};