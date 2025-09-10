import React from "react";

import './StartingPages.css';
import background from "../assets/image/Copilot_20250908_165311.png";
import HoverSoundButton from "../assets/audio/HoverSoundButton";
import hoverSound from "../assets/audio/ui-sound-hover.mp3";
import BackgroundMusic from "../assets/audio/BackgroundMusic";

import WelcomePanel from "../state/WelcomePanel";
import { useNavigate } from "react-router-dom";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="main-container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      zIndex: "3",
    }}>

      <WelcomePanel />

        <BackgroundMusic />
        <div className="stars"/>
        <h1 className="titolo">SpaceWar 2D</h1>
        <div className="menu-alternatives">
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#E67E41"}}
              hoverSrc={hoverSound}
              onClick={() => navigate("/game")}
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
