import {
    Application,
    Assets,
} from 'pixi.js';
import { PlayerContainer } from '../../components/Player.ts';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();

    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const texture = await Assets.load('https://pixijs.com/assets/bunny.png');
    const playerContainer = new PlayerContainer(texture);

    console.log('Cursore URL:', '/assets/cursore_custom.png');
    app.canvas.style.cursor = `url('/assets/cursore_custom.png') 16 16, auto`;

    app.stage.addChild(playerContainer);

    playerContainer.x = app.screen.width / 2;
    playerContainer.y = app.screen.height / 2;
    playerContainer.pivot.set(0, 0);

    playerContainer.sprite.on('pointerover', () => {
       //app.canvas.style.cursor = 'pointer';
    });

    playerContainer.sprite.on('pointerout', () => {
        //app.canvas.style.cursor = 'default';
    });

    let isRotating = false;
    let isPause = false;

    app.stage.on('pointerdown', () => {
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