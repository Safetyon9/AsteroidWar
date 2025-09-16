import './WelcomePages.css';
import React from "react";
import type { EmailPanelProps } from '../types/settingsType.ts';

const EmailPanel: React.FC<EmailPanelProps> = ({ visible, onClose })=> {
    if(!visible) return null;

    return (
        <div
            className='overlay-welcome'
            onClick={onClose}
        >
            <div
                className="welcome-panel"
                onClick={e => e.stopPropagation()}
            >
                <h1 className='benvenuto'>Email me for more info</h1>
                <a className='click-avanti' href='mailto:vruss30.vr@gmail.com'>vruss30.vr@gmail.com</a>
                <button className='email-btn' onClick={onClose}>
                    close
                </button>
            </div>
        </div>
    );
}

export default EmailPanel;