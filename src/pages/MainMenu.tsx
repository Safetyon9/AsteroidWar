import React from "react";
import './StartingPages.css';

const MainMenu: React.FC = () => {
  return (
    <div className="main-container">
        <div className="stars"/>
        <h1>SpaceWar Portfolio</h1>
        <div className="menu-alternatives">
            <button className="game-button">
                Game Start
            </button>
            <button className="game-button">
                Settings
            </button>
            <button className="game-button">
                Scoreboard
            </button>
            <button className="game-button">
                Contact Me
            </button>
      </div>
    </div>
  );
}

export default MainMenu;
