import React from "react";
import './StartingPages.css';
import background from "../assets/image/nasa--hI5dX2ObAs-unsplash.jpg";

const MaintenancePage: React.FC = () => {
    return (
        <div className="main-container" style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            zIndex: "3",
        }}>
        <div className="content">
            <h2>Site under maintenance</h2>
            <p>I'm working on some stars upgrades</p>
            <p className="subtitle">Thanks for your visti!</p>
        </div>
        </div>
    );
};

export default MaintenancePage;