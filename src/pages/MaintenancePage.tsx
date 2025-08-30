import React from "react";
import './StartingPages.css';

const MaintenancePage: React.FC = () => {
    return (
        <div className="main-container">
            <div className="nebula" />
            <div className="stars"/>
                <div className="content">
                    <h1>Site under maintenance</h1>
                    <p>I'm working on some stars upgrades</p>
                    <p className="subtitle">Thanks for your visti!</p>
                </div>
            </div>
    );
};

export default MaintenancePage;