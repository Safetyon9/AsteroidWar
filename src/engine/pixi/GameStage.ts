import {
    Application,
    Assets,
} from 'pixi.js';
import { PlayerContainer } from '../../components/Player.ts';
import { Laser } from '../../components/Laser.ts';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();
    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const playerTexture = await Assets.load('/assets/player_sprites/jet_nord_static1.png');
    const laserTexture = await Assets.load('/assets/player_sprites/laser_blue.png');

    app.canvas.style.cursor = `url('/assets/cursore_custom.png') 16 16, auto`;

    const playerContainer = new PlayerContainer(playerTexture);
    app.stage.addChild(playerContainer);

    playerContainer.x = app.screen.width / 2;
    playerContainer.y = app.screen.height / 2;
    playerContainer.pivot.set(0, 0);

    let isPause = false;
    let canShoot = true;

    const lasers: Laser[] = [];
    
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    let targetX = playerContainer.x;
    let targetY = playerContainer.y;

    app.stage.on('pointerdown', () => {
        if(canShoot) {
            const laser = new Laser(
                laserTexture,
                playerContainer.x,
                playerContainer.y - 10
            );

            app.stage.addChild(laser);
            lasers.push(laser);

            canShoot = false;
            setTimeout(() => (canShoot = true), 200)
        }
    });

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

    app.ticker.add(() => {
        if(!isPause) {
            const dx = targetX - playerContainer.x;
            const dy = targetY - playerContainer.y;
            const speed = 0.02;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 1) {
                playerContainer.x += dx*speed;
                playerContainer.y += dy*speed;
            }

            for (let i = lasers.length-1; i >= 0; i--) {
                lasers[i].update();
                if(lasers[i].isOffScreen()) {
                    app.stage.removeChild(lasers[i]);
                    lasers.splice(i,1);
                }
            }
        }
    });

    return app;
};