import React, { useState, useRef } from "react";
import './StartingPages.css';
import MenuBackgroundImage from "../assets/image/Copilot_20250908_165311.png";
import HoverSoundButton from "../assets/audio/HoverSoundButton.tsx";
import hoverSound from "../assets/audio/ui-sound-hover.mp3";
import BackgroundMusic from "../assets/audio/BackgroundMusic.tsx";
import WelcomePanel from "../state/WelcomePanel.tsx";
import SettingsPanel from "../state/SettingsPanel.tsx";
import EmailPanel from "../state/EmailPanel.tsx";
import { useNavigate } from "react-router-dom";
import type { BackgroundMusicRef } from "../types/settingsType.ts";
import MenuBackgroundMusic from "../assets/audio/space-background.mp3";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const bgMusicRef = useRef<BackgroundMusicRef>(null);

  return (
    <div className="main-container" style={{
      backgroundImage: `url(${MenuBackgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      zIndex: "3",
    }}>

      <WelcomePanel />

      <EmailPanel
        visible={showEmailPanel}
        onClose={() => setShowEmailPanel(false)}
      />

      <SettingsPanel
        visible={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        bgMusicRef={bgMusicRef}
      />
      <BackgroundMusic ref={bgMusicRef} song={MenuBackgroundMusic} />

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
              onClick={() => setShowSettingsPanel(true)}
            >
                Settings
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#A8563A"}}
              hoverSrc={hoverSound}
              onClick={() => null}
              >
                Scoreboard
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#7C4431"}}
              hoverSrc={hoverSound}
              onClick={() => window.open("https://github.com/Safetyon9")}
            >
                My GitHub
            </HoverSoundButton>
            <HoverSoundButton
              className="game-button"
              style={{backgroundColor: "#5A3228"}}
              hoverSrc={hoverSound}
              onClick={() => setShowEmailPanel(true)}
            >
                Contact Me
            </HoverSoundButton>
        </div>
    </div>
  );
}

export default MainMenu;
