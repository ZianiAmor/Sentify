// components/Card.jsx
import React from 'react';
import '../pages/css/Card.css';

const Card = ({ variant = 'default', children, className = '', ...props }) => {
  return (
    <div 
      className={`card card-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better structure
const CardHeader = ({ children }) => (
  <div className="card-header">
    {children}
  </div>
);

const CardBody = ({ children }) => (
  <div className="card-body">
    {children}
  </div>
);

const CardFooter = ({ children }) => (
  <div className="card-footer">
    {children}
  </div>
);

export { Card, CardHeader, CardBody, CardFooter };