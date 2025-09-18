import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GamePage } from './pages/Game.tsx';
import MaintenancePage from './pages/MaintenancePage.tsx';
import MainMenu from './pages/MainMenu.tsx';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;