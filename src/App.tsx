import React, { useEffect, useRef } from 'react';
import { playgroundPixi } from './engine/pixi/GameStage.tsx';

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
    return <div ref={pixiContainerRef}/>;
}

export default App;