import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { User, Mail, Lock, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(formData);
      showToast(`Account created! Welcome, ${user.name}.`, 'success');
      navigate(user.role === 'admin' ? '/app/admin/dashboard' : '/app/user/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">
      {/* ── Left Panel: Form ── */}
      <div className="reg-form-panel">

        {/* Brand */}
        <div className="reg-brand">
          <div className="reg-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0118 0v6" />
              <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
            </svg>
          </div>
          <div>
            <div className="reg-brand-name">ResolveDesk</div>
            <div className="reg-brand-tagline">Support · Resolve · Grow</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="reg-hero-text">
          <h1>Create Your Support Portal Account</h1>
          <p>Submit complaints, track live progress with multi-stage resolution timelines, and chat directly with our expert support team.</p>
          <div className="reg-copyright">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83A4 4 0 118 8.17"/></svg>
            © 2026 ResolveDesk SaaS Platform
          </div>
        </div>

        {/* Form Card */}
        <div className="reg-card">
          <div className="reg-card-header">
            <div className="reg-card-icon">
              <User size={20} color="#3b82f6" />
            </div>
            <div>
              <h2>Create Account</h2>
              <p>Fill in your details to get started with ResolveDesk.</p>
            </div>
          </div>

          {error && (
            <div className="reg-error-banner">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="reg-form">
            {/* Row 1: Name + Email */}
            <div className="reg-form-row">
              <div className="reg-field">
                <label>Full Name <span className="reg-req">*</span></label>
                <div className="reg-input-wrap">
                  <User size={16} className="reg-input-icon" />
                  <input
                    type="text" name="name"
                    placeholder="e.g. Jordan Miller"
                    value={formData.name} onChange={handleChange} required
                    id="register-name"
                  />
                </div>
              </div>
              <div className="reg-field">
                <label>Email Address <span className="reg-req">*</span></label>
                <div className="reg-input-wrap">
                  <Mail size={16} className="reg-input-icon" />
                  <input
                    type="email" name="email"
                    placeholder="e.g. dan.miller@example.com"
                    value={formData.email} onChange={handleChange} required
                    id="register-email" autoComplete="email"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone + Password */}
            <div className="reg-form-row">
              <div className="reg-field">
                <label>Phone Number <span className="reg-req">*</span></label>
                <div className="reg-input-wrap">
                  <Phone size={16} className="reg-input-icon" />
                  <input
                    type="tel" name="phone"
                    placeholder="e.g. (555) 987-6543"
                    value={formData.phone} onChange={handleChange}
                    id="register-phone"
                  />
                </div>
              </div>
              <div className="reg-field">
                <label>Password <span className="reg-req">*</span></label>
                <div className="reg-input-wrap">
                  <Lock size={16} className="reg-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password} onChange={handleChange} required
                    id="register-password" autoComplete="new-password"
                  />
                  <button type="button" className="reg-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Role */}
            <div className="reg-field">
              <label>Account Role</label>
              <div className="reg-role-pills">
                <button
                  type="button"
                  className={`reg-role-pill ${formData.role === 'user' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                >
                  <User size={14} /> Customer User
                </button>
                <button
                  type="button"
                  className={`reg-role-pill ${formData.role === 'admin' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'admin' })}
                >
                  <ShieldCheck size={14} /> Support Admin
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="reg-submit-btn" disabled={loading} id="register-submit">
              {loading ? <span className="reg-spinner" /> : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="reg-signin-link">
            Already registered? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Illustration + Features ── */}
      <div className="reg-right-panel">
        <div className="reg-illustration-wrap">
          <img src="/register-illustration.jpg" alt="Support Portal Illustration" className="reg-illustration-img" />
        </div>

        <div className="reg-quote">Together for a better support experience</div>

        <div className="reg-features">
          <div className="reg-feature-item">
            <div className="reg-feature-icon">
              <Shield size={20} color="#3b82f6" />
            </div>
            <div>
              <div className="reg-feature-title">Secure &amp; Reliable</div>
              <div className="reg-feature-desc">Your data is protected with enterprise-grade security.</div>
            </div>
          </div>
          <div className="reg-feature-item">
            <div className="reg-feature-icon">
              <Zap size={20} color="#3b82f6" />
            </div>
            <div>
              <div className="reg-feature-title">Fast Support</div>
              <div className="reg-feature-desc">Get help when you need it, from our expert team.</div>
            </div>
          </div>
          <div className="reg-feature-item">
            <div className="reg-feature-icon">
              <Users size={20} color="#3b82f6" />
            </div>
            <div>
              <div className="reg-feature-title">Track in Real-Time</div>
              <div className="reg-feature-desc">Stay updated with multi-stage resolution timelines.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
