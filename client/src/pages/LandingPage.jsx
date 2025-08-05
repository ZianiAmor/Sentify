import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './css/Landing.css';

const LandingPage = () => {
  
  const navigate = useNavigate();

  // Parallax effect for background elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      const parallaxElements = document.querySelectorAll('.parallax');
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-speed');
        const x = mouseX * speed;
        const y = mouseY * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
  {
    title: "Voice Emotion Analysis",
    content: "Capture your mood naturally through voice recordings. Our AI detects emotional patterns with local, private processing.",
    icon: "🎙️",
    color: "#7758D1" // Sentify purple
  },
  {
    title: "Mood Pattern Insights",
    content: "Visualize your emotional journey with intuitive charts and discover triggers behind your mood states.",
    icon: "📊",
    color: "#10b981"
  },
  {
    title: "Personal Growth Toolkit",
    content: "Access modular tools for stress management, creative expression, and habit building tailored to your emotions.",
    icon: "🧩",
    color: "#8b5cf6"
  },
  {
    title: "Privacy-First Design",
    content: "Your data never leaves your device. Offline-capable with end-to-end encryption and zero third-party sharing.",
    icon: "🔒",
    color: "#f59e0b"
  }
];

  const testimonials = [
  {
    quote: "Sentify helped me understand my anxiety patterns. The voice analysis feels like therapy without the cost.",
    name: "Alex Morgan",
    title: "UX Designer, Mental Health Advocate"
  },
  {
    quote: "Finally an emotion tracker that doesn't infantilize me. The logical approach resonates with my analytical mind.",
    name: "Dr. Kenji Tanaka",
    title: "Neuroscience Researcher"
  }
];

  return (
    <div className="landing-page-scoped">
    <div className="landing-container">
      {/* Animated background elements */}
      <div className="background-wrapper">
        <div className="gradient-background"></div>
        <div className="shape shape-1 parallax" data-speed="30"></div>
        <div className="shape shape-2 parallax" data-speed="20"></div>
        <div className="shape shape-3 parallax" data-speed="40"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 className="hero-title">
          Understand Your Emotions with <span className="gradient-text">Sentify</span>
          </motion.h1>

          <motion.p className="hero-subtitle">
            The privacy-first platform for emotional awareness, mood tracking, and personal growth through AI-powered reflection
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <motion.button
              className="cta-button primary"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free Trial
              <motion.span
                className="arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </motion.button>
            
            <motion.button
              className="cta-button secondary"
              onClick={() => navigate('/demo')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="stat">
            <span className="stat-number">95%</span>
            <span className="stat-label">Privacy Guarantee</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">10k+</span>
            <span className="stat-label">Emotion Insights</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-number">40%</span>
            <span className="stat-label">Self-Awareness Boost</span>
          </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="dashboard-preview">
        <div className="dashboard-header">
            <div className="dashboard-controls">
                <span className="control red"></span>
                <span className="control yellow"></span>
                <span className="control green"></span>
            </div>
            <div className="dashboard-title">Sentify Dashboard</div>
        </div>
        <div className="dashboard-content">
            <div className="dashboard-sidebar">
                <div className="sidebar-item active" data-label="Modules"></div>
                <div className="sidebar-item" data-label="Entries"></div>
                <div className="sidebar-item" data-label="Insights"></div>
                <div className="sidebar-item" data-label="History"></div>
                <div className="sidebar-item" data-label="Mirror"></div>
            </div>
            <div className="dashboard-main">
                <div className="dashboard-card-large"></div>
                <div className="dashboard-row">
                    <div className="dashboard-card-small"></div>
                    <div className="dashboard-card-small"></div>
                </div>
                <div className="dashboard-card-medium"></div>
            </div>
        </div>
    </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features for Modern Teams
        </motion.h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                {feature.icon}
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.content}</p>
              </div>
              <div className="feature-accent" style={{ background: feature.color }}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Trusted by Leading Teams
        </motion.h2>

        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="quote-mark">"</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-title">{testimonial.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to Understand Your Emotional Patterns?</h2>
          <p>Start your journey today. No subscriptions, no trackers.</p>
          
          <motion.button
            className="cta-button primary large"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Today
            <span className="arrow">→</span>
          </motion.button>
          
          <div className="secondary-cta">
            <span>Already have an account?</span>
            <button
              className="text-button"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">Sentify</div>
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/pricing">Pricing</a>
            <a href="/blog">Blog</a>
            <a href="/support">Support</a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">
              <span className="sr-only">Twitter</span>
              <i className="icon-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <span className="sr-only">LinkedIn</span>
              <i className="icon-linkedin"></i>
            </a>
            <a href="#" className="social-icon">
              <span className="sr-only">GitHub</span>
              <i className="icon-github"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Sentify. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default LandingPage;