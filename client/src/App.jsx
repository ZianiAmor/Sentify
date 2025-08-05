import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react'; 
import Login from './pages/Login_Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
         <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/Dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;