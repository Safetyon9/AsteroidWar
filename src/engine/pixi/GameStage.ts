import {
    Application,
    Assets,
    Container,
    Sprite
} from 'pixi.js';
import { PlayerContainer } from '../../components/Player.ts';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();

    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const playerContainer = new PlayerContainer(texture);

    app.stage.addChild(playerContainer);

    playerContainer.x = app.screen.width / 2;
    playerContainer.y = app.screen.height / 2;

    playerContainer.pivot.set(0, 0);

    playerContainer.sprite.on('pointerover', () => {
        app.view.style.cursor = 'pointer';
    });

    playerContainer.sprite.on('pointerout', () => {
        app.view.style.cursor = 'default';
    });

    let isRotating = false;
    let isPause = false;

    playerContainer.sprite.on('pointerdown', () => {
        if(!isPause){
            isRotating = !isRotating;
        }
    });

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    let targetX = playerContainer.x;
    let targetY = playerContainer.y;

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
                playerContainer.rotation -= 0.05 * time.deltaTime;
            }

            const dx = targetX - playerContainer.x;
            const dy = targetY - playerContainer.y;
            const speed = 0.02;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
                playerContainer.x += dx*speed;
                playerContainer.y += dy*speed;
            }
        }
    });

    return app;
};