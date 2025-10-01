import './WelcomePages.css';
import React, { useEffect, useState } from "react";

interface WelcomePanelProps {
    imageSrc?: string;
    loadingTime?: number;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ imageSrc, loadingTime }) => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);
    
    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                setTimeout(() => setLoading(false), loadingTime);
            };
        } else {
            const timer = setTimeout(() => setLoading(false), loadingTime);
            return () => clearTimeout(timer);
        }
    }, [imageSrc, loadingTime]);

    if (!visible) return null;

    return (
        <div className='overlay-welcome' onClick={!loading ? () => setVisible(false) : undefined}>
            <div className='planet-container'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    width="400"
                    height="400"
                    className='orbit'
                >
                    <circle
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke="#ffcc80"
                        strokeWidth="5"
                        strokeDasharray="15 15"
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        className="orbit-ring"
                    />
                    <g transform="translate(30 30) scale(1.1)"> 
                        <path d="M30.47 104.24h13.39v13.39H30.47Z" fill="#ffcc80"></path>
                        <path d="M84.04 104.24h13.39v13.39H84.04Z" fill="#ffcc80"></path>
                        <path d="M30.48 10.51h13.39V23.9H30.48Z" fill="#ffcc80"></path>
                        <path d="M84.04 10.51h13.39V23.9H84.04Z" fill="#ffcc80"></path>
                        <path d="M97.46 64.08V37.3H84.04V23.9H70.65v13.4H57.26V23.9H43.87v13.4H30.48v26.78H17.09v13.39h13.39v13.4h13.39v13.38h13.39V90.87h13.39v13.38h13.39V90.87h13.42v-13.4h13.37V64.08H97.46zm-40.21 0H43.86V50.69h13.39v13.39zm26.78 0H70.64V50.69h13.39v13.39z" fill="#ffcc80"></path>
                        <path d="M110.82 37.29h13.4v26.8h-13.4Z" fill="#ffcc80"></path>
                        <path d="M3.7 37.28h13.4v26.8H3.7Z" fill="#ffcc80"></path>
                    </g>
                </svg>
            </div>
            <div className='loading-div'>
                <p className='loading-text'>{loading ? 'LOADING' : 'CLICK ANYWHERE'}</p>
                <span className='puntino'>{loading ? '.' : ''}</span>
                <span className='puntino'>{loading ? '.' : ''}</span>
                <span className='puntino'>{loading ? '.' : ''}</span>
            </div>
        </div>
    );
}

export default WelcomePanel;

