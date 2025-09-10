import useSound from "use-sound";
import React from "react";

interface Props {
    hoverSrc: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const HoverSoundButton: React.FC<Props> = ({ hoverSrc, children, className, style, onClick }) => { const [play] = useSound(hoverSrc, {volume: 0.5 })

    return (
        <button
            className={className}
            style={style}
            onMouseEnter={() => play()}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default HoverSoundButton;