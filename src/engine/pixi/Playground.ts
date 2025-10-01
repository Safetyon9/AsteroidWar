//Packages
import { Application, Texture } from "pixi.js";
import type { GameCallbacks } from "../../pages/Game";
import SAT from 'sat';

//Classi
import { PlayerContainer } from "../../components/Player";
import { Laser } from "../../components/Laser";
import { Asteroid } from "../../components/Asteroid";


export class Playground {

    private app!: Application;
    private container: HTMLDivElement;
    private callbacks?: GameCallbacks

    private player!: PlayerContainer;
    private lasers: Laser[] = [];
    private asteroids: Asteroid[] = [];

    playerTexture: Texture[];
    playervariant: number;
    asteroidTexture: Texture[];
    laserTexture: Texture;

    private score: number = 0;
    private lives: number = 3;
    private paused: boolean = false;
    private hitCooldown: boolean = false;
    private hitCooldownTimeout: ReturnType<typeof setTimeout> | null = null;

    private canShoot: boolean = true;
    private canShootTimeout: ReturnType<typeof setTimeout> | null = null;

    private targetX: number;
    private targetY: number;

    private asteroidInterval: ReturnType<typeof setInterval> | null = null;

    constructor(
        container: HTMLDivElement,
        playerTexture: Texture[],
        playerVariant: number,
        asteroidTexture: Texture[],
        laserTexture: Texture,
        callbacks?: GameCallbacks
    ) {
        console.log('Playground instance created', container, new Date());
        this.container = container;
        this.callbacks = callbacks;

        this.playerTexture = playerTexture;
        this.playervariant = playerVariant;
        this.asteroidTexture = asteroidTexture;
        this.laserTexture = laserTexture;

        this.targetX = 0;
        this.targetY = 0;

        this.init(playerVariant);
    }

    private async init(playerVariant: number) {
        this.app = new Application();

        await this.app.init({
            background: 'black',
            resizeTo: window,
        });

        this.container.appendChild(this.app.canvas);
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen; 

        this.player = new PlayerContainer(this.playerTexture[playerVariant],playerVariant);
        this.player.x = this.app.screen.width / 2;
        this.player.y = this.app.screen.height / 2;
        this.player.pivot.set(0,0);
        this.targetX = this.player.x;
        this.targetY = this.player.y;
        this.app.stage.addChild(this.player);

        if (this.callbacks?.onLifeChange) {
            this.callbacks.onLifeChange(this.lives);
        }

        this.app.stage.on('pointermove', (event) => {
            const pos = event.global;
            this.targetX = pos.x;
            this.targetY = pos.y;
        });

        this.app.stage.on('pointerdown', () => this.shootLaser());

        this.asteroidInterval = setInterval(() => this.spawnAsteroid(), 400);

        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.togglePause();
        });
    }

    private shootLaser() {
        if (!this.canShoot || this.paused) return;

        const laserX = this.player.x + this.player.sprite.width / 2 - 5;
        const laserY = this.player.y - 10;

        const laser = new Laser(laserX, laserY, this.laserTexture);
        this.lasers.push(laser);
        this.app.stage.addChild(laser);

        this.canShoot = false;
        this.canShootTimeout = setTimeout(() => {
            this.canShoot = true;
            this.canShootTimeout = null;
        }, 500);
    }

    private spawnAsteroid() {
        if (this.paused) return;

        const randomX = Math.random() * this.app.screen.width;
        const randomY = -150 - Math.random() * 50;
        const randomSpeed = 2 + Math.random() * 3;
        const randomScale = 0.1 + Math.random() * 0.2;
        const variant = Math.floor(Math.random() * 6);

        const asteroid = new Asteroid(randomX, randomY, randomSpeed, randomScale, variant, this.asteroidTexture[variant]);
        this.asteroids.push(asteroid);
        this.app.stage.addChild(asteroid);
    }

    public togglePause() {
        this.paused = !this.paused;

        if (this.paused) {
            if (this.canShootTimeout) {
                clearTimeout(this.canShootTimeout);
                this.canShootTimeout = null;
                this.canShoot = true;
            }
            if (this.asteroidInterval) {
                clearInterval(this.asteroidInterval);
                this.asteroidInterval = null;
            }
        } else {
            this.asteroidInterval = setInterval(() => this.spawnAsteroid(), 400);
        }

        this.callbacks?.onPauseChange?.(this.paused);
    }

    private update(delta: number) {
        if (this.paused) return;

        this.updatePlayer(delta);
        this.updateLasers(delta);
        this.updateAsteroids(delta);
    }

    private updatePlayer(delta: number) {
        const dx = this.targetX - this.player.x;
        const dy = this.targetY - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            const speed = 0.02;
            this.player.update(dx * speed * delta, dy * speed * delta);

            const maxSkew = 0.1;
            const targetSkewX = Math.max(Math.min(dx / 200, maxSkew), - maxSkew);
            const targetSkewY = Math.max(Math.min(dy / 200, maxSkew), - maxSkew);

            this.player.skew.x += (targetSkewX - this.player.skew.x) * 0.1;
            this.player.skew.y += (targetSkewY - this.player.skew.y) * 0.1;

            const targetRotation = Math.atan2(dy, dx) * 0.002;
            this.player.rotation += (targetRotation - this.player.rotation) * 0.002;
        }
    }

    private updateLasers(delta: number) {
        for (let i = this.lasers.length - 1; i >= 0; i--) {
            const laser = this.lasers[i];
            laser.update(delta);
            
            if (laser.isOffScreen()) {
                this.removeLaser(i);
                continue;
            }

            this.checkLaserCollisions(i);
        }
    }

    private removeLaser(index: number) {
        this.app.stage.removeChild(this.lasers[index]);
        this.lasers.splice(index, 1);
    }

    private checkLaserCollisions(laserIndex: number) {
        const laser = this.lasers[laserIndex];
        for(let k = this.asteroids.length - 1; k >= 0; k--) {
            const asteroid = this.asteroids[k];
            if (SAT.testPolygonPolygon(asteroid.getPolygon(), laser.getPolygon())){
                this.removeLaser(laserIndex);
                console.log("collisione con laser");
                this.removeAsteroid(k);
                this.addScore(1);
                break;
            }
        }
    }

    private updateAsteroids(delta: number) {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update(delta);

            if (asteroid.isOffScreen()) {
                this.removeAsteroid(i);
                continue;
            }
            if (!this.hitCooldown){
                this.checkAsteroidCollisionWithPlayer(i);
            }
        }
    }

    private removeAsteroid(index: number) {
        this.app.stage.removeChild(this.asteroids[index]);
        this.asteroids.splice(index, 1);
    }

    private checkAsteroidCollisionWithPlayer(asteroidIndex: number) {
        const asteroid = this.asteroids[asteroidIndex];
        if (SAT.testPolygonPolygon(asteroid.getPolygon(), this.player.getPolygon())) {
            if (!this.hitCooldown) {
                this.removeLife();
                this.hitCooldown = true;
                
                this.hitCooldownTimeout = setTimeout(() => {
                    this.hitCooldown = false;
                    this.hitCooldownTimeout = null;
                }, 1000)
            }
        }
    }

    private addScore(points: number) {
        this.score += points;
        this.callbacks?.onScoreChange?.(this.score);
    }

    private removeLife() {
        if (this.lives > 0) this.lives -= 1;
        this.callbacks?.onLifeChange?.(this.lives);

        if (this.lives <= 0) {
            this.app.stage.removeChild(this.player);
            this.canShoot = false;
            this.paused = true;
            this.callbacks?.onGameOver?.();
        }
    }

    private clearAllTimers() {
        if (this.canShootTimeout) {
            clearTimeout(this.canShootTimeout);
            this.canShootTimeout = null;
        }
        if (this.hitCooldownTimeout) {
            clearTimeout(this.hitCooldownTimeout);
            this.hitCooldownTimeout = null;
        }
        if (this.asteroidInterval) {
            clearInterval(this.asteroidInterval);
            this.asteroidInterval = null;
        }
    }

    public destroy() {
        this.clearAllTimers();

        this.lasers.forEach(l => this.app.stage.removeChild(l));
        this.asteroids.forEach(a => this.app.stage.removeChild(a));
        
        this.lasers = [];
        this.asteroids = [];
        if (this.player) this.app.stage.removeChild(this.player);
        this.player = undefined!;
    }
}