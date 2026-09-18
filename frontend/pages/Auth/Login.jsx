import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Layers, ShieldCheck, Zap, BarChart2, ArrowRight, Lock, Mail, EyeOff, Eye, User } from 'lucide-react';
import './AuthNew.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate(user.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@resolvedesk.com');
      setPassword('adminpassword');
    } else {
      setEmail('alex.johnson@example.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="auth-page-container">
      {/* Top Header */}
      <header className="auth-header">
        <div className="auth-logo-section">
          <div className="auth-logo-icon">
            <Layers size={20} color="#FFFFFF" />
          </div>
          <div className="auth-logo-text">
            <h2>ResolveDesk</h2>
            <span>Complaint & Ticket Management</span>
          </div>
        </div>
        <div className="auth-tagline">
          <span>Better Support</span>
          <span className="divider">|</span>
          <span>Faster Resolution</span>
          <span className="divider">|</span>
          <span>Happier Customers</span>
        </div>
      </header>

      <div className="auth-main-content">
        {/* Left Column (Hero) */}
        <div className="auth-hero-col">
          <div className="hero-badge">
            <ShieldCheck size={16} />
            <span>Enterprise Support Portal</span>
          </div>
          <h1 className="hero-title">Enterprise Complaint &<br />Ticket System</h1>
          <p className="hero-desc">
            Streamline customer inquiries, track SLA timelines, and automate resolution workflows with real-time visibility.
          </p>

          <div className="hero-features">
            <div className="feature-row">
              <div className="feature-icon-wrapper blue">
                <Zap size={22} className="feature-icon" />
              </div>
              <div className="feature-text">
                <h3>Fast Resolution</h3>
                <p>Instant tracking and automated<br />status transitions.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon-wrapper green">
                <ShieldCheck size={22} className="feature-icon" />
              </div>
              <div className="feature-text">
                <h3>GDPR Consent Flow</h3>
                <p>Protected permanent purge with<br />explicit approval.</p>
              </div>
            </div>
            <div className="feature-row">
              <div className="feature-icon-wrapper purple">
                <BarChart2 size={22} className="feature-icon" />
              </div>
              <div className="feature-text">
                <h3>Real-time Analytics</h3>
                <p>Track team performance and CSAT ratings.</p>
              </div>
            </div>
          </div>

          {/* Demo credentials helper */}
          <div className="demo-credentials">
            <p className="demo-label">Quick Demo Access:</p>
            <div className="demo-buttons">
              <button className="demo-btn" type="button" onClick={() => fillDemo('user')}>
                <User size={14} /> Customer Demo
              </button>
              <button className="demo-btn admin" type="button" onClick={() => fillDemo('admin')}>
                <ShieldCheck size={14} /> Admin Demo
              </button>
            </div>
          </div>

          <div className="security-banner left-banner">
            <Lock size={18} className="banner-icon" />
            <div className="banner-text">
              <strong>Secure & Trusted</strong>
              <p>JWT-authenticated with bcrypt-hashed passwords.</p>
            </div>
          </div>
        </div>

        {/* Right Column (Login Form) */}
        <div className="auth-form-col">
          <div className="auth-form-card">
            <div className="form-header">
              <div className="user-avatar-placeholder">
                <User size={32} />
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to your ResolveDesk account to continue.</p>
            </div>

            {error && (
              <div className="auth-error-banner">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label>Email Address <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon left" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="login-email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password <span className="required">*</span></label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id="login-password"
                    autoComplete="current-password"
                  />
                  <button type="button" className="input-icon right cursor-pointer eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading} id="login-submit">
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <ArrowRight size={18} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>OR</span>
            </div>

            <div className="signup-link">
              Don't have an account? <Link to="/register">Create an account</Link>
            </div>

            <div className="security-banner bottom-banner">
              <ShieldCheck size={20} className="banner-icon blue-icon" />
              <div className="banner-text">
                <strong>Enterprise Security</strong>
                <p>JWT tokens, bcrypt password hashing, and role-based access control.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
