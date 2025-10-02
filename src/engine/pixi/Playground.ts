//Packages
import { Application, Texture, Graphics } from "pixi.js";
import type { GameCallbacks } from "../../pages/Game";
import SAT from 'sat';
import nipplejs from 'nipplejs';

//Classi
import { PlayerContainer } from "../../components/Player";
import { Laser } from "../../components/Laser";
import { Asteroid } from "../../components/Asteroid";

export class Playground {

    private app!: Application;
    private container: HTMLDivElement;
    private callbacks?: GameCallbacks
    public controlType: 'mouse' | 'keyboard' | 'mobile';

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

    private shootBtn?: Graphics;
    private joystickManager?: nipplejs.JoystickManager;

    private boundKeyboardHandler: ((e: KeyboardEvent) => void) | null = null;
    private boundPointerMove: ((e: any) => void) | null = null;
    private boundPointerDown: ((e: any) => void) | null = null;
    private boundEscapeHandler: ((e: KeyboardEvent) => void) | null = null;
    private boundKeyboardUpHandler: ((e: KeyboardEvent) => void) | null = null;
    private keysPressed: { [key: string]: boolean } = {};

    constructor(
        container: HTMLDivElement,
        playerTexture: Texture[],
        playerVariant: number,
        asteroidTexture: Texture[],
        laserTexture: Texture,
        callbacks?: GameCallbacks,
        controlType: 'mouse' | 'keyboard' | 'mobile' = 'mouse'
    ) {
        this.controlType = controlType;
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

        this.initEventListeners();

        this.asteroidInterval = setInterval(() => this.spawnAsteroid(), 400);

        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    }

    private shootLaser() {
        if (!this.canShoot || this.paused) return;

        const laserX = this.player.x + this.player.sprite.width / 2;
        const laserY = this.player.y - 10;

        const laser = new Laser(laserX, laserY, this.laserTexture);
        laser.x = this.player.x + this.player.sprite.width / 2 - laser.width / 2;
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
            if (this.controlType === 'mobile') this.destroyMobile();
        } else {
            this.asteroidInterval = setInterval(() => this.spawnAsteroid(), 400);
            if (this.controlType === 'mobile' && !this.joystickManager) {
                this.createMobile();
            }
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
        const speedk = 4.5;
        if(this.controlType === 'keyboard') {
            if (this.keysPressed['KeyW'] || this.keysPressed['ArrowUp']) this.targetY -= speedk;
            if (this.keysPressed['KeyS'] || this.keysPressed['ArrowDown']) this.targetY += speedk;
            if (this.keysPressed['KeyA'] || this.keysPressed['ArrowLeft']) this.targetX -= speedk;
            if (this.keysPressed['KeyD'] || this.keysPressed['ArrowRight']) this.targetX += speedk;
        }

        const dx = this.targetX - this.player.x;
        const dy = this.targetY - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            const speed = 0.02;
            this.player.update(dx * speed * delta, dy * speed * delta);

            const maxSkew = 0.08;
            const targetSkewX = Math.max(Math.min(dx / 200, maxSkew), - maxSkew);
            const targetSkewY = Math.max(Math.min(dy / 200, maxSkew), - maxSkew);

            this.player.skew.x += (targetSkewX - this.player.skew.x) * 0.1;
            this.player.skew.y += (targetSkewY - this.player.skew.y) * 0.1;

            const targetRotation = Math.atan2(dy, dx) * 0.002;
            this.player.rotation += (targetRotation - this.player.rotation) * 0.002;
        }
    }

    private initEventListeners() {
        this.removeEventListeners();

        if (!this.boundEscapeHandler) {
            this.boundEscapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') this.togglePause();
            }
            window.addEventListener('keydown', this.boundEscapeHandler);
        }
        if (this.controlType === 'keyboard') {
            this.boundKeyboardHandler = (e: KeyboardEvent) => this.handleKeyboardDown(e);
            this.boundKeyboardUpHandler = (e: KeyboardEvent) => this.handleKeyboardUp(e);
            window.addEventListener('keydown', this.boundKeyboardHandler);
            window.addEventListener('keyup', this.boundKeyboardUpHandler);
        }
        if (this.controlType === 'mouse') {
            this.boundPointerMove = (e: any) => {
                const pos = e.global;
                this.targetX = pos.x;
                this.targetY = pos.y;
            };
            this.boundPointerDown = () => this.shootLaser();
            this.app.stage.on('pointermove', this.boundPointerMove);
            this.app.stage.on('pointerdown', this.boundPointerDown);
        }
        if (this.controlType === 'mobile') {
            this.createMobile();
        }
    }

    private removeEventListeners() {
        if (this.boundKeyboardUpHandler) {
            window.removeEventListener('keyup', this.boundKeyboardUpHandler);
            this.boundKeyboardUpHandler = null;
        }
        if (this.boundKeyboardHandler) {
            window.removeEventListener('keydown', this.boundKeyboardHandler);
            this.boundKeyboardHandler = null;
        }
        if (this.boundPointerMove) {
            this.app.stage.off('pointermove', this.boundPointerMove);
            this.boundPointerMove = null;
        }
        if (this.boundPointerDown) {
            this.app.stage.off('pointerdown', this.boundPointerDown);
            this.boundPointerDown = null;
        }

        this.destroyMobile();
    }

    private handleKeyboardDown(e: KeyboardEvent) {
        this.keysPressed[e.code] = true;
        if(e.code === 'Space' || e.code === 'Enter') {
            this.shootLaser();
        }
    }

    private handleKeyboardUp(e: KeyboardEvent) {
        this.keysPressed[e.code] = false;
    }

    private createMobile() {
        this.shootBtn = new Graphics();
        this.shootBtn.beginFill(0xffcc80, 0.9);
        this.shootBtn.lineStyle(3, 0xffffff, 0.8);
        this.shootBtn.drawCircle(0, 0, 25);
        this.shootBtn.endFill();
        this.shootBtn.x = this.app.screen.width - 70;
        this.shootBtn.y = this.app.screen.height - 100;
        this.shootBtn.interactive = true;
        (this.shootBtn as any).buttonMode = true;
        this.app.stage.addChild(this.shootBtn);

        this.shootBtn.on('pointerdown', () => {
            this.shootLaser();
            this.shootBtn!.alpha = 0.6;
            this.shootBtn!.scale.set(0.9); 
        });

        this.shootBtn.on('pointerup', () =>{
            this.shootBtn!.alpha = 1;
            this.shootBtn!.scale.set(1)
        });

        this.shootBtn.on('pointerupoutside', () => {
            this.shootBtn!.alpha = 1;
            this.shootBtn!.scale.set(1)
        });

        this.joystickManager = nipplejs.create({
            zone: document.body,
            mode: 'static',
            position: { left: '100px', bottom: '100px' },
            color: '#ffcc80',
            size: 100,
        });

        this.joystickManager.on('move', (_evt, data) => {
            if (!data.angle || !data.distance) return;
            const speed = 250;
            this.targetX = this.player.x + Math.cos(data.angle.radian) * (data.distance / 50) * speed;
            this.targetY = this.player.y - Math.sin(data.angle.radian) * (data.distance / 50) * speed;
        });

        this.joystickManager.on('end', () => {
            this.targetX = this.player.x;
            this.targetY = this.player.y;
        });
    }

    private destroyMobile() {
        if(this.shootBtn) {
            this.shootBtn.removeAllListeners();
            this.app.stage.removeChild(this.shootBtn);
            this.shootBtn.destroy();
            this.shootBtn = undefined;
        }
        if (this.joystickManager) {
            this.joystickManager.destroy();
            this.joystickManager = undefined;
        }
    }

    public setControlType(type: 'keyboard' | 'mouse' | 'mobile') {
        if (this.controlType === type) return;
        this.removeEventListeners();
        this.controlType = type;
        this.initEventListeners();
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

    public changePlayerTexture(playerTexture: Texture, playerVariant: number) {
        this.player.changeTexture(playerTexture, playerVariant);
        this.playervariant = playerVariant;
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