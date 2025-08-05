// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  const spinnerStyle = {
    width: '24px',
    height: '24px',
    border: '4px solid #00b0ff',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '10px'
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const keyframesStyle = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
        <span>Loading...</span>
      </div>
    </>
  );
};

export default LoadingSpinner;
