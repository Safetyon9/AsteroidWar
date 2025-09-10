import './BackgroundMusic.css'
import React, { useEffect, useState } from "react";
import useSound from "use-sound";

import volumeOn from "../icons/volume-up-svgrepo-com.svg"
import volumeOff from "../icons/volume-off-svgrepo-com.svg"
import backgroundMusic from "./space-background.mp3";

const BackgroundMusic: React.FC = () => {
    const [volume, setVolume] = useState(0.07);
    const [play,{ sound }] = useSound(backgroundMusic, { loop: true, volume: 0.07});

    useEffect(() => {
        play();
    }, [play]);

    useEffect(() => {
        if (sound) {
        sound.volume(volume);
        }
    }, [volume, sound]);

    const toggleVolume = () => {
        setVolume((prev) => (prev > 0 ? 0 : 0.07));
    };

    return (
        <div
            className="audio-toggle"
            onClick={toggleVolume}
        >
            <img
                src={volume > 0 ? volumeOn : volumeOff}
                alt={volume > 0 ? "volume on" : "volume off"}
                style={{ 
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
};

export default BackgroundMusic;