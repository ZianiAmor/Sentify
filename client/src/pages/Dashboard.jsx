// Dashboard.js
import React, { useEffect, useState } from 'react';
import './css/Dashboard.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";



import Insights from './Mood/Insights';
import Mood from './Mood/MoodMirror';
import Triggers from './Mood/TriggersHistory';
import Enteries from './Mood/YourEnteries'

import authService from '../services/authService';

import planning from './School/Planning'

import community from './Explore/Community'




const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #ccc',
        borderTop: '4px solid #00b0ff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: 'auto',
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
const Dashboard = () => {
  const [activeMainSections, setActiveMainSections] = useState('mood');
  const [activeSubsection ,setAciveSubSection]=useState('enteries')
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch(error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (!user) return null;
    
    switch (activeTab) {
      case 'insights': return <Insights user={user} />;
      case 'mood': return <Mood user={user} />;
      case 'triggers': return <Triggers user={user} />;
      case 'enteries': return <Enteries user={user} />;
      default: return <Enteries user={user} />;
    }
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: "insights", label: "Insights"},
    { id: "mood", label: "Mood"},
    { id: "triggers", label: "Triggers"},
    { id: "enteries", label: "Enteries" },
  ];

  return (
    <div className="dashboard-container">

    </div>
  );
};

export default Dashboard;