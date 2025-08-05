import React, { useState } from 'react';
import './css/Login_Register.css'; 
import authService from '../services/authService'; // Path to your service

const Login_Register = () => {
  const [authType, setAuthType] = useState('login');
  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:''
  })


  const[error,setError]=useState('')
  const[success,setSuccess]=useState('')


  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (authType === 'register') {
        await authService.register({
          username: formData.name,
          email: formData.email,
          password: formData.password
        });
        setSuccess('Registration successful! Redirecting...');
      } else {
        await authService.login({
          email: formData.email,
          password: formData.password
        });
        setSuccess('Login successful! Redirecting...');
      }
      
      // Redirect user after successful auth
      setTimeout(() => {
        window.location.href = '/Dashboard';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const toggleAuth = (type) => {
    setAuthType(type);
    console.log(type)
  };

  

  return (
    <div className="login-register-container">
      <div className="contai_ner">
        <div className="herosection">
          <div className="logo">Sentify</div>
          <h1 className="herotitle">Your Emotional Journey Starts Here</h1>
          <p className="herosubtitle">
            Take the first step towards understanding yourself better. Every emotion matters, every feeling is valid.
          </p>
          <div className="emotional-icons">
            <div className="icon">💙</div>
            <div className="icon">🌟</div>
            <div className="icon">🌱</div>
          </div>
        </div>

        <div className="auth-section">
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${authType === 'login' ? 'active' : ''}`}
              onClick={() => toggleAuth('login')}
            >
              Sign In
            </button>
            <button
              className={`toggle-btn ${authType === 'register' ? 'active' : ''}`}
              onClick={() => toggleAuth('register')}
            >
              Sign Up
            </button>
          </div>

          {authType === 'login' ? (
            <div className="auth-form">
              <div className="motivational-text">
                Welcome back! Ready to continue your emotional wellness journey?
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" required value={formData.password} onChange={handleChange} />
              </div>
              
              <button className="submit-btn" onClick={handleSubmit}>
                Continue Your Journey
              </button>
            </div>
          ) : (
            <div className="auth-form">
              <div className="motivational-text">
                You're taking a brave step towards emotional awareness. We're here to support you!
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Enter your name" required onChange={handleChange} value={formData.name}/>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a secure password" required value={formData.password} onChange={handleChange}/>
              </div>
              
              <button className="submit-btn" onClick={handleSubmit}>
                Begin Your Journey
              </button>
            </div>
          )}

          <div className="privacy-note">
            By continuing, you agree to our commitment to privacy and emotional safety. 
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_Register;