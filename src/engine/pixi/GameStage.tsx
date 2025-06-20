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

    const player = new Sprite(texture);
    container.addChild(player);

    player.anchor.set(0.5);
    player.scale.set(4,4);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;

    container.pivot.set(0, 0);
    player.position.set(0, 0);

    player.interactive = true;

    player.on('pointerover', () => {
        app.view.style.cursor = 'pointer';
    });

    player.on('pointerout', () => {
        app.view.style.cursor = 'default';
    });

    let isRotating = false;
    let isPause = false;

    player.on('pointerdown', () => {
        if(!isPause){
            isRotating = !isRotating;
        }
    });

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    let targetX = container.x;
    let targetY = container.y;

    app.stage.on('pointermove', (event) => {
        const pos = event.global;
        targetX = pos.x;
        targetY = pos.y;
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (isPause){
                isPause = false;
            } else {
                isPause = true;
            } 
        }
    });

    app.ticker.add((time) => {
        if(!isPause) {
            if(isRotating) {
                container.rotation -= 0.05 * time.deltaTime;
            }

            const dx = targetX - container.x;
            const dy = targetY - container.y;
            const speed = 0.02;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
                container.x += dx*speed;
                container.y += dy*speed;
            }
        }
    });

    return app;
};