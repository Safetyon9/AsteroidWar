import React, { useEffect } from "react";
import useSound from "use-sound";
import backgroundMusic from "./space-background.mp3";

const BackgroundMusic: React.FC = () => {
    const [play,{ stop }] = useSound(backgroundMusic, { loop: true, volume: 0.1});

    useEffect(() => {
        play();

        return () => stop();
    }, [play, stop]);

    return null;
};

export default BackgroundMusic;