import {
    Application,
    Assets
    //v8_0_0
} from 'pixi.js';
import { PlayerContainer } from '../../components/Player.ts';
import { Laser } from '../../components/Laser.ts';
import { Asteroid } from '../../components/Asteroid.ts';
import SAT from 'sat';
import cursoreCustom from '../../assets/image/cursore_custom.png'
import playerTexturePath1 from '../../assets/player_sprites/jet_eagle1_grande.png'
import playerTexturePath3 from '../../assets/player_sprites/jet_black_grande.png'
import playerTexturePath4 from '../../assets/player_sprites/jet_star_grande.png'
import playerTexturePath2 from '../../assets/player_sprites/jet_eagle2_grande.png'
import laserTexturePath from '../../assets/player_sprites/laser_blue.png'
import asteroidTexturePath1 from '../../assets/asteroids/asteroid1.png'
import asteroidTexturePath2 from '../../assets/asteroids/asteroid2.png'
import asteroidTexturePath3 from '../../assets/asteroids/asteroid3.png'
import asteroidTexturePath4 from '../../assets/asteroids/asteroid4.png'
import asteroidTexturePath5 from '../../assets/asteroids/asteroid5.png'
import asteroidTexturePath6 from '../../assets/asteroids/asteroid6.png'

export interface GameCallbacks {
    onScoreChange?: (score: number) => void;
    onLifeChange?: (lives: number) => void;
    onGameOver?: () => void;
    onPauseChange?: (paused: boolean) => void;
}

export async function playgroundPixi(containerElement: HTMLDivElement, callbacks?: GameCallbacks): Promise<Application> {

    const app = new Application();
    await app.init({background: 'black', resizeTo: window});

    containerElement.appendChild(app.canvas);

    const playerTexture = [
        await Assets.load(playerTexturePath1),
        await Assets.load(playerTexturePath2),
        await Assets.load(playerTexturePath3),
        await Assets.load(playerTexturePath4),
    ];
    const laserTexture = await Assets.load(laserTexturePath);
    const asteroidTexture = [
        await Assets.load(asteroidTexturePath1),
        await Assets.load(asteroidTexturePath2),
        await Assets.load(asteroidTexturePath3),
        await Assets.load(asteroidTexturePath4),
        await Assets.load(asteroidTexturePath5),
        await Assets.load(asteroidTexturePath6),
    ];

    app.canvas.style.cursor = `url(${cursoreCustom}) 16 16, auto`;

    const playerContainer = new PlayerContainer(playerTexture[1],1);
    playerContainer.x = app.screen.width / 2;
    playerContainer.y = app.screen.height / 2;
    playerContainer.pivot.set(0, 0);
    let targetX = playerContainer.x;
    let targetY = playerContainer.y;
    app.stage.addChild(playerContainer);

    let score = 0;
    let lives = 3;
    let hitCooldown = false;

    function addScore(points: number) {
        score += points;
        callbacks?.onScoreChange?.(score);
    }

    function removeLife() {
        if (lives>0) lives -= 1;
        callbacks?.onLifeChange?.(lives);

        if (lives <= 0) {
            app.stage.removeChild(playerContainer);
            canShoot = false;
            isPause = true;
            callbacks?.onGameOver?.();
        }
    }

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
            const randomY = Math.floor(-Math.random() * 200-150);
            const randomSpeed = 3 + Math.random() * 2;
            const randomScale = 0.1 + Math.random() * 0.2;

            const randomTexture = Math.floor(Math.random()*5)
            
            const asteroid = new Asteroid(
                asteroidTexture[randomTexture],
                randomX,
                randomY,
                randomSpeed,
                randomScale,
                randomTexture
            );
            app.stage.addChild(asteroid);
            asteroids.push(asteroid);
        }
    }, 400)

    app.stage.on('pointerdown', () => {
        if(canShoot) {
            const laser = new Laser(
                laserTexture,
                playerContainer.x + playerContainer.sprite.width/2 - laserTexture.width/2,
                playerContainer.y - 10
            );

            app.stage.addChild(laser);
            lasers.push(laser);

            canShoot = false;
            canShootTimeout = setTimeout(() => {
                canShoot = true
                canShootTimeout = null;
            }, 500);
        }
    });

    app.stage.on('pointermove', (event) => {
        const pos = event.global;
        targetX = pos.x;
        targetY = pos.y;
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            isPause = !isPause;
            if (canShootTimeout && isPause) {
                clearTimeout(canShootTimeout);
                canShootTimeout = null;
            }
            callbacks?.onPauseChange?.(isPause);
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
                        addScore(1);
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

                    if (!hitCooldown) {
                        removeLife();
                        hitCooldown = true;
                    }

                    setTimeout(() => {
                        hitCooldown = false;
                    }, 1000);

                }
            }


        }
    });

    return app;
};