import './GamePage.css'
import { useRef, useEffect, useState } from "react";
import { Playground } from "../engine/pixi/Playground"
import SettingsPanel from "../state/SettingsPanel";

import BackgroundMusic from "../assets/audio/BackgroundMusic";
import type { BackgroundMusicRef } from "../types/settingsType";
import MenuBackgroundMusic from "../assets/audio/game-background.mp3";
import { Assets} from 'pixi.js';

import playerTexture1 from '../assets/player_sprites/jet_eagle1_grande.png'
import playerTexture2 from '../assets/player_sprites/jet_eagle2_grande.png';
import playerTexture3 from '../assets/player_sprites/jet_black_grande.png'
import playerTexture4 from '../assets/player_sprites/jet_star_grande.png'

import asteroidTexture1 from '../assets/asteroids/asteroid1.png'
import asteroidTexture2 from '../assets/asteroids/asteroid2.png'
import asteroidTexture3 from '../assets/asteroids/asteroid3.png'
import asteroidTexture4 from '../assets/asteroids/asteroid4.png'
import asteroidTexture5 from '../assets/asteroids/asteroid5.png'
import asteroidTexture6 from '../assets/asteroids/asteroid6.png'

import laserTexture1 from '../assets/player_sprites/laser_blue.png'

export interface GameCallbacks {
    onScoreChange?: (score: number) => void;
    onLifeChange?: (lives: number) => void;
    onGameOver?: () => void;
    onPauseChange?: (paused: boolean) => void;
}

export function GamePage() {
    const gameContainer = useRef<HTMLDivElement>(null);
    const playgroundRef = useRef<Playground | null>(null);
    const [_playerTexture, setPlayerTexture] = useState<any[]>([]);
    const [_asteroidTexture, setAsteroidTexture] = useState<any[]>([]);
    const [_laserTexture, setLaserTexture] = useState<any | null>(null);

    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [paused, setPaused] = useState(false);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);
    const bgMusicRef = useRef<BackgroundMusicRef>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        if (!gameContainer.current) return;

        const callbacks: GameCallbacks = {
            onScoreChange: setScore,
            onLifeChange: setLives,
            onGameOver: () => setPaused(true),
            onPauseChange: setShowSettingsPanel,
        };

        async function loadTextures() {
            const playerTexture = await Promise.all([
                Assets.load(playerTexture1),
                Assets.load(playerTexture2),
                Assets.load(playerTexture3),
                Assets.load(playerTexture4),
            ]);

            setPlayerTexture(playerTexture);

            const asteroidTexture = await Promise.all([
                Assets.load(asteroidTexture1),
                Assets.load(asteroidTexture2),
                Assets.load(asteroidTexture3),
                Assets.load(asteroidTexture4),
                Assets.load(asteroidTexture5),
                Assets.load(asteroidTexture6),
            ]);

            setAsteroidTexture(asteroidTexture);

            const laserTexture = await Assets.load(laserTexture1);

            setLaserTexture(laserTexture);

            playgroundRef.current = new Playground(
                gameContainer.current!,
                playerTexture,
                1,
                asteroidTexture,
                laserTexture,
                callbacks
            );
        }

        loadTextures();
    
        return () => {
            playgroundRef.current?.destroy();
        };
    }, []);


    return (
        <div className="mainContainer">
            {showSettingsPanel && (
            <SettingsPanel
                visible
                onClose={() => setShowSettingsPanel(false)}
                bgMusicRef={bgMusicRef}
            />
            )}

            <div className="pixiContainer" ref={gameContainer}></div>

            <BackgroundMusic ref={bgMusicRef} song={MenuBackgroundMusic} />

            

            <button
                className="menuButton"
                onClick={() => {
                    setShowSettingsPanel(true);
                    setPaused(true);
                    playgroundRef.current?.togglePause();
                }}
            >
                <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="#ffcc80" strokeWidth="4"/>
                <line x1="20" y1="24" x2="44" y2="24" stroke="#ffcc80" strokeWidth="5"/>
                <line x1="20" y1="32" x2="44" y2="32" stroke="#ffcc80" strokeWidth="5"/>
                <line x1="20" y1="40" x2="44" y2="40" stroke="#ffcc80" strokeWidth="5"/>
                <circle cx="14" cy="20" r="2.5" fill="#ffcc80"/>
                <circle cx="50" cy="44" r="2.5" fill="#ffcc80"/>
                </svg>
            </button>

            <div className="hud">
                <span>Score: {score}</span>
                <span>Lives: {lives}</span>
                {paused && <span>GAMEOVER</span>}
            </div>

        </div>
    );
}
