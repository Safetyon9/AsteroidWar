import React from "react";
import './MaintenancePage.css';

const MaintenancePage: React.FC = () => {
    return (
        <div className="maintenance-container">
            <div className="stars"/>
                <div className="content">
                    <h1>🚀 Site under maintenance</h1>
                    <p>We're working on some star upgrades</p>
                    <p className="subtitle">Thanks for your patience!🛠️</p>
                </div>
            </div>
    );
};

export default MaintenancePage;