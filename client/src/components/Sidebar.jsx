import React, { useState } from 'react';
import { Menu ,Activity, BookOpen, BarChart3, History, Camera, Calendar, Users } from 'lucide-react';
import './css/Sidebar.css';
import logo from '../assets/icons/Logo.svg';

const Sidebar = ({ activeMain, setActiveMain, activeSub, setActiveSub, user }) => {
  const sections = {
    mood: {
      title: "Mood",
      subtitle: "Your Emotional Compass",
      icon: Activity,
      subs: [
        { id: "entries", label: "Your Entries", icon: BookOpen },
        { id: "insights", label: "Insights", icon: BarChart3 },
        { id: "triggers", label: "Trigger History", icon: History },
        { id: "mirror", label: "Mood Mirror", icon: Camera },
      ]
    },
    school: {
      title: "School",
      subtitle: "Your Academic Hub",
      icon: Calendar,
      subs: [
        { id: "planning", label: "Planning", icon: Calendar }
      ]
    },
    explore: {
      title: "Explore", 
      subtitle: "Discover New Horizons",
      icon: Users,
      subs: [
        { id: "community", label: "Community", icon: Users }
      ]
    }
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="status-dot"></div>
          <img src={logo} alt="Sentify Logo" className="brand-logo" />
        </div>
      </div>

      {/* Modules Header */}
      <div className="modules-header">
        <div className="modules-title">
          <Menu size={18} color="white" />
          <span className="modules-text">Modules</span>
        </div>
      </div>

      <div className="navigation-container">
        {Object.entries(sections).map(([key, section]) => {
          const IconComponent = section.icon;
          return (
            <div key={key} className="nav-section">
              {/* Main Section */}
              <button
                className={`main-section-button ${activeMain === key ? 'active' : ''}`}
                onClick={() => {
                  setActiveMain(key);
                }}
              >
                <div className={`main-section-icon ${activeMain === key ? 'active' : ''}`}>
                  <IconComponent size={18} color="white" />
                </div>
                <div className="main-section-content">
                  <div className="main-section-title">
                    {section.title}
                  </div>
                  {section.subtitle && activeMain === key && (
                    <div className="main-section-subtitle">
                      {section.subtitle}
                    </div>
                  )}
                </div>
              </button>

              {/* Sub-sections */}
              {activeMain === key && (
                <div className="sub-sections">
                  {section.subs.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        className={`sub-section-button ${activeSub === sub.id ? 'active' : ''}`}
                        onClick={() => setActiveSub(sub.id)}
                      >
                        <SubIcon 
                          size={16} 
                          color={activeSub === sub.id ? '#E879F9' : 'rgba(255, 255, 255, 0.7)'} 
                        />
                        <span className={`sub-section-text ${activeSub === sub.id ? 'active' : ''}`}>
                          {sub.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Handwriting Visualization - FIXED */}
      <div className="bottom-section">
        <div className="handwriting-visualizer">
          <div className="sliding-content">
            <span className="handwriting-text">Tap For Quick Entry</span>
            <svg className="handwriting-svg" width="240" height="40" viewBox="0 0 240 40">
              <defs>
                <linearGradient id="handwritingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5FBF" />
                  <stop offset="50%" stopColor="#E879F9" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path
                d="M10,20 Q30,10 50,20 T90,20 Q110,30 130,20 T170,20 Q190,10 210,20 T230,20"
                fill="none"
                stroke="url(#handwritingGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="handwriting-path"
              />
            </svg>
          </div>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">
              {user?.username || 'Loading...'}
            </span>
            <span className="user-status">Online now</span>
          </div>
          <div className="online-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;