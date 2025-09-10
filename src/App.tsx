import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { playgroundPixi } from './engine/pixi/GameStage.ts';
import MaintenancePage from './pages/MaintenancePage.tsx';
import MainMenu from './pages/MainMenu.tsx';

const GamePage: React.FC = () => {
    const pixiContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let appIstance: ReturnType<typeof playgroundPixi> | null = null;
        
        const runPixi = async () => {
            if(pixiContainerRef.current) {
                appIstance = playgroundPixi(pixiContainerRef.current);
            }
        };

        runPixi();

        return () => {
            if (appIstance && 'then' in appIstance) {
                appIstance.then(app => {
                    app.destroy(true, { children: true, texture: true });
                });
            }
        };
    }, []);

    return <div ref={pixiContainerRef}/>
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="*" element={<MaintenancePage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;