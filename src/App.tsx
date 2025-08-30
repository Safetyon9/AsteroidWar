import React, { useEffect, useRef } from 'react';
import { playgroundPixi } from './engine/pixi/GameStage.ts';
import MaintenancePage from './pages/MaintenancePage.tsx';
import MainMenu from './pages/MainMenu.tsx';

const App: React.FC = () => {
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
    return <MaintenancePage/>;
    //<MainMenu />;
    //<div ref={pixiContainerRef}/>
}

export default App;