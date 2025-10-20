import React from 'react';
import './css/TopBar.css';

const TopBar = ({ subtitle }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <h2 className="top-bar-subtitle">{subtitle}</h2>
      </div>
    </div>
  );
};

export default TopBar;