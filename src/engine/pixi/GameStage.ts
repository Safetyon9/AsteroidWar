import {
    Application,
    Assets
} from 'pixi.js';
import { PlayerContainer } from '../../components/Player.ts';
import { Laser } from '../../components/Laser.ts';
import { Asteroid } from '../../components/Asteroid.ts';
import SAT from 'sat';

export async function playgroundPixi(containerElement: HTMLDivElement): Promise<Application> {
    const app = new Application();
    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const playerTexture = await Assets.load('/assets/player_sprites/jet_nord_static1.png');
    const laserTexture = await Assets.load('/assets/player_sprites/laser_blue.png');
    const asteroidTexture = await Assets.load('/assets/asteroid.png');

    app.canvas.style.cursor = `url('/assets/cursore_custom.png') 16 16, auto`;

    const playerContainer = new PlayerContainer(playerTexture);
    playerContainer.x = app.screen.width / 2;
    playerContainer.y = app.screen.height / 2;
    playerContainer.pivot.set(0, 0);
    let targetX = playerContainer.x;
    let targetY = playerContainer.y;
    app.stage.addChild(playerContainer);

    const lasers: Laser[] = [];

    const asteroids: Asteroid[] = [];

    let isPause = false;
    let canShoot = true;
    
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    let canShootTimeout: ReturnType<typeof setTimeout> | null = null;

    setInterval( () => {
        if(!isPause && app.stage) {
            const randomX = Math.floor(Math.random() * window.innerWidth);
            const randomY = Math.floor(-Math.random() * 200-100);
            const randomSpeed = 1.5 + Math.random() * 2;
            const randomScale = 0.5 + Math.random() * 1.2;
            
            const asteroid = new Asteroid(
                asteroidTexture,
                randomX,
                randomY,
                randomSpeed,
                randomScale,
            );
            app.stage.addChild(asteroid);
            asteroids.push(asteroid);
        }
    }, 400)

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
            canShootTimeout = setTimeout(() => {
                canShoot = true
                canShootTimeout = null;
            }, 200);
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

                canShoot = true;
            } else {
                isPause = true;
                if(canShootTimeout) {
                    clearTimeout(canShootTimeout);
                    canShootTimeout = null;
                }
                canShoot = false;
            } 
        }
    });

    app.ticker.add((time) => {
        if(!isPause) {
            if(playerContainer.x !== targetX && playerContainer.y !== targetY) {
                const dx = targetX - playerContainer.x;
                const dy = targetY - playerContainer.y;
                const speed = 0.02;

                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 1) {
                    playerContainer.update(dx*speed,dy*speed)
                }
            }

            for (let i = lasers.length-1; i >= 0; i--) {
                lasers[i].update();
                if(lasers[i].isOffScreen()) {
                    app.stage.removeChild(lasers[i]);
                    lasers.splice(i,1);
                    continue;
                }

                for (let j = asteroids.length -1; j >= 0; j--) {
                    if(SAT.testPolygonPolygon(asteroids[j].getPolygon(),lasers[i].getPolygon())) {
                        app.stage.removeChild(lasers[i]);
                        app.stage.removeChild(asteroids[j]);
                        lasers.splice(i,1);
                        asteroids.splice(j,1);
                        break;
                    }
                }
            }
 
            for (let i = asteroids.length-1; i >= 0; i--){
                asteroids[i].update(time.deltaTime);
                if(asteroids[i].isOffScreen()) {
                    app.stage.removeChild(asteroids[i]);
                    asteroids.splice(i,1);
                }
                if(SAT.testPolygonPolygon(asteroids[i].getPolygon(),playerContainer.getPolygon())) {
                    app.stage.removeChild(playerContainer);
                    canShoot = false;
                }
            }


        }
    });

    return app;
};