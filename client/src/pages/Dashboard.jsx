import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import './css/Dashboard.css';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeMain, setActiveMain] = useState('mood');
  const [activeSub, setActiveSub] = useState('entries');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className='dashboard-card'>
        <Sidebar 
        activeMain={activeMain}
        setActiveMain={setActiveMain}
        activeSub={activeSub}
        setActiveSub={setActiveSub}
        user={user}
        />
        <MainContent
          setActiveSub={setActiveSub}
          activeMain={activeMain}
          activeSub={activeSub}
          user={user}
        />
      </div>
     
    </div>
  );
};

export default Dashboard;
