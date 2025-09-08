import React from "react";
import './StartingPages.css';
import background from "../assets/Copilot_20250908_165311.png";

const MainMenu: React.FC = () => {
  return (
    <div className="main-container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      zIndex: "3",
    }}>
        <div className="stars"/>
        <h1>SpaceWar 2D</h1>
        <div className="menu-alternatives">
            <button className="game-button" style={{
              backgroundColor: "#E67E41",
            }}>
                Game Start
            </button>
            <button className="game-button" style={{
              backgroundColor: "#C96B3C",
            }}>
                Settings
            </button>
            <button className="game-button" style={{
              backgroundColor: "#A8563A",
            }}>
                Scoreboard
            </button>
            <button className="game-button" style={{
              backgroundColor: "#7C4431",
            }}>
                GitHub
            </button>
            <button className="game-button" style={{
              backgroundColor: "#5A3228",
            }}>
                Contact Me
            </button>
        </div>
    </div>
  );
}

export default MainMenu;
