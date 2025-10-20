import React from 'react';
import './css/Card.css';

const Card = ({ title, description, icon, thumbnail, onClick, className = '' }) => {
  return (
    <div 
      className={`card ${className}`}
      onClick={onClick}
    >
      {/* Background Image */}
      <div 
        className="card-background"
        style={{ backgroundImage: thumbnail ? `url(${thumbnail})` : 'none' }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="card-overlay"></div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        {/* Icon */}
        {icon && (
          <div className="card-icon">
            <img src={icon} alt={`${title} icon`} />
          </div>
        )}

        {/* Text Content */}
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;