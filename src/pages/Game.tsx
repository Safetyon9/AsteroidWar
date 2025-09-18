import './GamePage.css'
import { useRef, useEffect, useState } from "react";
import { playgroundPixi, type GameCallbacks } from "../engine/pixi/GameStage";
import SettingsPanel from "../state/SettingsPanel";

import BackgroundMusic from "../assets/audio/BackgroundMusic";
import type { BackgroundMusicRef } from "../types/settingsType";
import MenuBackgroundMusic from "../assets/audio/game-background.mp3";

export function GamePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [paused, setPaused] = useState(false);
    const bgMusicRef = useRef<BackgroundMusicRef>(null);
    const [showSettingsPanel, setShowSettingsPanel] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const callbacks: GameCallbacks = {
            onScoreChange: (s) => setScore(s),
            onLifeChange: (l) => setLives(l),
            onGameOver: () => setPaused(true),
            onPauseChange: (p) => setShowSettingsPanel(p),
        };

        let appIstance: Awaited<ReturnType<typeof playgroundPixi>> | null = null;

        const runPixi = async () => {
            appIstance = await playgroundPixi(containerRef.current!, callbacks);
        };

        runPixi();

        return () => {
            if (appIstance) {
                appIstance.destroy(true, { children: true, texture: true});
            }
        };
    
    }, []);

    return (
        <div className="mainContainer">
            <div ref={containerRef} className="pixiContainer" />

            <BackgroundMusic ref={bgMusicRef} song={MenuBackgroundMusic} />

            <SettingsPanel
                visible={showSettingsPanel}
                onClose={() => setShowSettingsPanel(false)}
                bgMusicRef={bgMusicRef}
            />

            <button
                className="menuButton"
                onClick={() => setShowSettingsPanel(true)}
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
