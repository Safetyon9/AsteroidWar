import './BackgroundMusic.css'
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import useSound from "use-sound";

import volumeOn from "../icons/volume-up-svgrepo-com.svg"
import volumeOff from "../icons/volume-off-svgrepo-com.svg"

import type { BackgroundMusicRef, BackgroundMusicProps } from '../../types/settingsType';

const BackgroundMusic = forwardRef<BackgroundMusicRef, BackgroundMusicProps>(({song}, ref) => {
    const [volume, setVolume] = useState(0.1);
    const [lastVolume, setLastVolume] = useState(0.1);
    const [play,{ sound, stop }] = useSound(song, { loop: true, volume: 0.1});

    useEffect(() => {
        play();
        return () => {
            stop?.();
            sound?.unload?.();
        };
    }, [play]);

    useEffect(() => {
        if (sound) {
            sound.volume(volume);
        }
    }, [volume, sound]);

    useImperativeHandle(ref, () => ({
        setCustomVolume: (x: number) => {
            const safeVolume = Math.max(0,Math.min(x, 0.1));
            setVolume(safeVolume);
            if (safeVolume > 0) {
                setLastVolume(safeVolume);
            }
        }
    }));

    const toggleVolume = () => {
        setVolume((prev) => {
            if (prev > 0) {
                setLastVolume(prev);
                return 0;
            } else {
                return lastVolume;
            }
        });
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
});

export default BackgroundMusic;