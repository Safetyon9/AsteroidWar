import React from "react";
import './StartingPages.css';
import background from "../assets/Copilot_20250908_165311.png";
import HoverSoundButton from "../assets/HoverSoundButton";
import hoverSound from "../assets/ui-sound-hover.mp3";
import BackgroundMusic from "../assets/BackgroundMusic";

const MainMenu: React.FC = () => {

  return (
    <div className="main-container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      zIndex: "3",
    }}>
        <BackgroundMusic />
        <div className="stars"/>
        <h1>SpaceWar 2D</h1>
        <div className="menu-alternatives">
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#E67E41"}}
              hoverSrc={hoverSound}
            >
                Start Game
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#C96B3C"}}
              hoverSrc={hoverSound}
            >
                Settings
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#A8563A"}}
              hoverSrc={hoverSound}
              >
                Scoreboard
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#7C4431"}}
              hoverSrc={hoverSound}
            >
                My GitHub
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#5A3228"}}
              hoverSrc={hoverSound}
            >
                Contact Me
            </HoverSoundButton>
        </div>
    </div>
  );
}

export default MainMenu;
