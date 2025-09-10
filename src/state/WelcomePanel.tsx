import './WelcomePages.css';
import React, { useState } from "react";

const WelcomePanel: React.FC = () => {
    const [visible, setVisible] = useState(true);
    
    if(!visible) return null;

    return (
        <div
            className='overlay-welcome'
            onClick={() => setVisible(false)}
        >
            <div className="welcome-panel">
                <h1 className='benvenuto'>WELCOME</h1>
                <p className='click-avanti'>click anywhere to continue</p>
            </div>
        </div>
    );
}

export default WelcomePanel;