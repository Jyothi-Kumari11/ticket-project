import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings, User, Bell, Shield, Lock, Palette, Headphones, Clock, Edit2,
  ShieldCheck, Ticket, ChevronDown, ChevronUp, Save, Download, Smartphone,
  Laptop, Globe, Key, HelpCircle, CheckCircle2, AlertCircle, ExternalLink,
  FileSpreadsheet, FileJson, Moon, Sun, Monitor, RefreshCw, Trash2, Check
} from 'lucide-react';
import './SettingsNew.css';

const SystemSettings = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('system');

  // System Configuration State
  const [systemSettings, setSystemSettings] = useState({
    gdprCompliance: true,
    customerConsent: true,
    autoAssign: true,
    dataRetention: true,
    ticketPrefix: 'TKT-2026-',
    nextTicketNumber: '0012',
    defaultPriority: 'Medium',
    autoResponse: true,
    slaCriticalResponse: '2 hours',
    slaCriticalResolution: '6 hours',
    slaHighResponse: '6 hours',
    slaHighResolution: '12 hours',
    slaMediumResponse: '12 hours',
    slaMediumResolution: '24 hours',
    slaLowResponse: '24 hours',
    slaLowResolution: '72 hours',
  });

  // Profile Settings State
  const [profileState, setProfileState] = useState({
    name: currentUser?.name || 'Jyothi Kumari',
    email: currentUser?.email || 'admin@resolvedesk.com',
    phone: currentUser?.phone || '+1 (555) 000-1111',
    department: 'Support & IT Administration',
    role: currentUser?.role === 'admin' ? 'System Administrator' : 'Customer',
    bio: 'Overseeing customer satisfaction, IT support tickets, and system governance.'
  });

  // Notification Settings State
  const [notifSettings, setNotifSettings] = useState({
    emailTicketAssigned: true,
    emailStatusUpdate: true,
    emailCustomerReply: true,
    emailDailyDigest: false,
    emailWeeklyReport: true,
    smsCriticalAlerts: true,
    smsOutageAlerts: true,
    smsSlaBreach: false,
    inAppSound: true,
    inAppDesktop: true,
    inAppBadgeCount: true,
    quietHours: false
  });

  // Security Settings State
  const [securityState, setSecurityState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    requirePasswordChangeDays: 90,
    sessionTimeoutMinutes: 30
  });

  // Active sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11', location: 'San Francisco, USA', ip: '192.168.1.140', current: true, time: 'Active now' },
    { id: 2, device: 'Safari on iPhone 15 Pro', location: 'San Francisco, USA', ip: '172.56.21.9', current: false, time: '2 hours ago' },
    { id: 3, device: 'Firefox on macOS Monterey', location: 'Austin, USA', ip: '68.204.10.82', current: false, time: '3 days ago' }
  ]);

  // Privacy & Data State
  const [privacyState, setPrivacyState] = useState({
    gdprEnabled: true,
    anonymizeOnDelete: true,
    retentionPeriod: '3_years',
    cookieAnalytics: true,
    cookieMarketing: false,
    autoExportMonthly: false
  });

  // Appearance State
  const [appearanceState, setAppearanceState] = useState({
    theme: 'light', // light, dark, system
    accentColor: '#4f46e5',
    density: 'comfortable', // comfortable, compact
    fontSize: 'medium',
    enableAnimations: true
  });

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How are SLA breach timers calculated?',
      a: 'SLA timers begin immediately upon ticket creation and calculate business operating hours based on your configured schedule. Escalation notifications are sent 30 minutes before a breach.'
    },
    {
      q: 'Can I export audit logs for compliance reviews?',
      a: 'Yes, navigate to the Privacy & Data tab or Audit Logs page to download complete immutable audit logs in CSV or JSON formats.'
    },
    {
      q: 'How does automatic ticket assignment work?',
      a: 'Tickets are automatically categorized and routed using round-robin distribution to available specialists with matching domain skills.'
    },
    {
      q: 'How do I enable Two-Factor Authentication (2FA)?',
      a: 'Go to the Security Settings tab and switch the Two-Factor Authentication toggle on. You can link your preferred authenticator app (Google Authenticator, Authy, etc.).'
    }
  ];

  // Handlers
  const handleSave = (e) => {
    e?.preventDefault();
    if (activeTab === 'profile') {
      setCurrentUser({
        ...currentUser,
        name: profileState.name,
        email: profileState.email,
        phone: profileState.phone
      });
      showToast('Profile updated successfully!', 'success');
    } else if (activeTab === 'system') {
      showToast('System configuration saved successfully!', 'success');
    } else if (activeTab === 'notifications') {
      showToast('Notification preferences updated!', 'success');
    } else if (activeTab === 'security') {
      if (securityState.newPassword && securityState.newPassword !== securityState.confirmPassword) {
        showToast('New passwords do not match!', 'error');
        return;
      }
      showToast('Security settings and password updated!', 'success');
      setSecurityState(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } else if (activeTab === 'privacy') {
      showToast('Privacy and retention policies updated!', 'success');
    } else if (activeTab === 'appearance') {
      showToast('Appearance and theme preferences applied!', 'success');
    } else {
      showToast('Settings saved successfully!', 'success');
    }
  };

  const toggleSystemSetting = (key) => {
    setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotif = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key) => {
    setPrivacyState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRevokeSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session revoked successfully', 'info');
  };

  const handleExportData = (type) => {
    showToast(`Exporting data in ${type.toUpperCase()} format... Download will start shortly.`, 'info');
  };

  const navItems = [
    {
      id: 'system',
      label: 'System Configuration',
      desc: 'SLA rules, ticket settings, and more',
      icon: Settings
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      desc: 'Update your personal information',
      icon: User
    },
    {
      id: 'notifications',
      label: 'Notification Settings',
      desc: 'Email, SMS and in-app notifications',
      icon: Bell
    },
    {
      id: 'security',
      label: 'Security Settings',
      desc: 'Password, 2FA and data protection',
      icon: Shield
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      desc: 'GDPR and data management',
      icon: Lock
    },
    {
      id: 'appearance',
      label: 'Appearance',
      desc: 'Theme and display preferences',
      icon: Palette
    },
    {
      id: 'help',
      label: 'Help & Support',
      desc: 'Documentation and contact',
      icon: Headphones
    }
  ];

  return (
    <div className="settings-page-container">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-icon-wrapper">
          <Settings size={28} color="#4F46E5" />
        </div>
        <div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account, system configuration, and preferences.</p>
        </div>
      </div>

      <div className="settings-content-wrapper">
        {/* Left Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="settings-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`settings-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="nav-icon">
                    <Icon size={18} />
                  </div>
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-desc">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="settings-main-pane">
          
          {/* 1. SYSTEM CONFIGURATION TAB */}
          {activeTab === 'system' && (
            <>
              {/* SLA Rules Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Clock size={20} /></div>
                    <div>
                      <h3>Service Level Agreement (SLA) Rules</h3>
                      <p>Configure how quickly different priority tickets should be responded to and resolved.</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <div className="status-badge active"><span className="dot"></span> Active</div>
                    <button className="btn-edit" onClick={() => showToast('SLA rules editor opened', 'info')}>
                      <Edit2 size={14} /> Edit Rules
                    </button>
                  </div>
                </div>

                <div className="sla-grid">
                  <div className="sla-box">
                    <div className="sla-box-header">
                      <span className="priority-dot critical"></span>
                      <strong>Critical Priority</strong>
                    </div>
                    <div className="sla-stat"><span>Max Response:</span> <strong>{systemSettings.slaCriticalResponse}</strong></div>
                    <div className="sla-stat"><span>Max Resolution:</span> <strong>{systemSettings.slaCriticalResolution}</strong></div>
                  </div>
                  <div className="sla-box">
                    <div className="sla-box-header">
                      <span className="priority-dot high"></span>
                      <strong>High Priority</strong>
                    </div>
                    <div className="sla-stat"><span>Max Response:</span> <strong>{systemSettings.slaHighResponse}</strong></div>
                    <div className="sla-stat"><span>Max Resolution:</span> <strong>{systemSettings.slaHighResolution}</strong></div>
                  </div>
                  <div className="sla-box">
                    <div className="sla-box-header">
                      <span className="priority-dot medium"></span>
                      <strong>Medium Priority</strong>
                    </div>
                    <div className="sla-stat"><span>Max Response:</span> <strong>{systemSettings.slaMediumResponse}</strong></div>
                    <div className="sla-stat"><span>Max Resolution:</span> <strong>{systemSettings.slaMediumResolution}</strong></div>
                  </div>
                  <div className="sla-box">
                    <div className="sla-box-header">
                      <span className="priority-dot low"></span>
                      <strong>Low Priority</strong>
                    </div>
                    <div className="sla-stat"><span>Max Response:</span> <strong>{systemSettings.slaLowResponse}</strong></div>
                    <div className="sla-stat"><span>Max Resolution:</span> <strong>{systemSettings.slaLowResolution}</strong></div>
                  </div>
                </div>
              </div>

              {/* Data Sovereignty Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Shield size={20} /></div>
                    <div>
                      <h3>Data Sovereignty & Governance</h3>
                      <p>Enforce data protection rules and compliance settings.</p>
                    </div>
                  </div>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon"><ShieldCheck size={18} /></div>
                      <div>
                        <strong>GDPR Compliance</strong>
                        <p>Protect customer data with GDPR regulations and consent management.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={systemSettings.gdprCompliance} onChange={() => toggleSystemSetting('gdprCompliance')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon"><User size={18} /></div>
                      <div>
                        <strong>Customer Consent</strong>
                        <p>Require explicit approval for permanent deletion of tickets.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={systemSettings.customerConsent} onChange={() => toggleSystemSetting('customerConsent')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon"><Settings size={18} /></div>
                      <div>
                        <strong>Auto-assign to Specialists</strong>
                        <p>Route tickets to the right department based on category.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={systemSettings.autoAssign} onChange={() => toggleSystemSetting('autoAssign')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div className="toggle-icon"><Clock size={18} /></div>
                      <div>
                        <strong>Data Retention Policy</strong>
                        <p>Keep closed tickets for 3 years for audit and reporting purposes.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={systemSettings.dataRetention} onChange={() => toggleSystemSetting('dataRetention')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Ticket System Config Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Ticket size={20} /></div>
                    <div>
                      <h3>Ticket System Configuration</h3>
                      <p>Manage ticket behavior, numbering, and automation rules.</p>
                    </div>
                  </div>
                </div>

                <div className="config-grid">
                  <div className="config-field">
                    <label>Ticket ID Prefix</label>
                    <input 
                      type="text" 
                      value={systemSettings.ticketPrefix} 
                      onChange={(e) => setSystemSettings({...systemSettings, ticketPrefix: e.target.value})}
                    />
                  </div>
                  <div className="config-field">
                    <label>Next Ticket Number</label>
                    <input 
                      type="number" 
                      value={systemSettings.nextTicketNumber} 
                      onChange={(e) => setSystemSettings({...systemSettings, nextTicketNumber: e.target.value})}
                    />
                  </div>
                  <div className="config-field">
                    <label>Default Priority</label>
                    <div className="select-wrapper">
                      <div className="select-dot medium"></div>
                      <select 
                        value={systemSettings.defaultPriority} 
                        onChange={(e) => setSystemSettings({...systemSettings, defaultPriority: e.target.value})}
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown size={16} className="select-arrow" />
                    </div>
                  </div>
                  <div className="config-field switch-field">
                    <label>Auto-response</label>
                    <div className="switch-with-label">
                      <label className="switch">
                        <input type="checkbox" checked={systemSettings.autoResponse} onChange={() => toggleSystemSetting('autoResponse')} />
                        <span className="slider round"></span>
                      </label>
                      <span>Enable auto-reply for new tickets</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 2. PROFILE SETTINGS TAB */}
          {activeTab === 'profile' && (
            <>
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><User size={20} /></div>
                    <div>
                      <h3>Personal Information</h3>
                      <p>Update your profile credentials, contact details, and display preferences.</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <span className="badge-role-admin">{profileState.role}</span>
                  </div>
                </div>

                <div className="profile-form-grid">
                  <div className="profile-avatar-row">
                    <div className="profile-avatar-large">
                      {profileState.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'AD'}
                    </div>
                    <div className="profile-avatar-info">
                      <h4 className="avatar-title">{profileState.name}</h4>
                      <p className="avatar-desc">Administrator ID: ADM-2026-901</p>
                      <button className="btn-secondary-sm" onClick={() => showToast('Avatar change dialog opened', 'info')}>
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="form-fields-2col">
                    <div className="config-field">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={profileState.name} 
                        onChange={(e) => setProfileState({ ...profileState, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="config-field">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={profileState.email} 
                        onChange={(e) => setProfileState({ ...profileState, email: e.target.value })}
                        placeholder="admin@resolvedesk.com"
                      />
                    </div>
                    <div className="config-field">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileState.phone} 
                        onChange={(e) => setProfileState({ ...profileState, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="config-field">
                      <label>Department / Role</label>
                      <input 
                        type="text" 
                        value={profileState.department} 
                        onChange={(e) => setProfileState({ ...profileState, department: e.target.value })}
                        placeholder="Support Operations"
                      />
                    </div>
                  </div>

                  <div className="config-field">
                    <label>Bio / Signature</label>
                    <textarea 
                      className="settings-textarea" 
                      rows={3} 
                      value={profileState.bio} 
                      onChange={(e) => setProfileState({ ...profileState, bio: e.target.value })}
                      placeholder="Write a brief description or your standard ticket reply signature..."
                    />
                  </div>
                </div>
              </div>

              {/* Account Quick Stats */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><ShieldCheck size={20} /></div>
                    <div>
                      <h3>Account Status & Privileges</h3>
                      <p>Security overview and permission scopes assigned to this account.</p>
                    </div>
                  </div>
                </div>
                <div className="account-privileges-grid">
                  <div className="privilege-box">
                    <CheckCircle2 size={18} color="#10B981" />
                    <div>
                      <strong>Full Superadmin Access</strong>
                      <p>Can manage users, view confidential tickets, and edit SLAs.</p>
                    </div>
                  </div>
                  <div className="privilege-box">
                    <CheckCircle2 size={18} color="#10B981" />
                    <div>
                      <strong>Audit Log & Compliance Viewer</strong>
                      <p>Authorized to export immutable security logs and customer deletion records.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 3. NOTIFICATION SETTINGS TAB */}
          {activeTab === 'notifications' && (
            <>
              {/* Email Notifications Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Bell size={20} /></div>
                    <div>
                      <h3>Email Notification Preferences</h3>
                      <p>Select which events should trigger automated email notifications to your inbox.</p>
                    </div>
                  </div>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Ticket Assigned to Me</strong>
                        <p>Receive an email when a new or escalated ticket is assigned to you.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.emailTicketAssigned} onChange={() => toggleNotif('emailTicketAssigned')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Customer Reply Received</strong>
                        <p>Notify when a customer comments or uploads attachments to your ticket.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.emailCustomerReply} onChange={() => toggleNotif('emailCustomerReply')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Status & Priority Changes</strong>
                        <p>Alerts when high or critical priority tickets change state.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.emailStatusUpdate} onChange={() => toggleNotif('emailStatusUpdate')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Weekly Executive & SLA Report</strong>
                        <p>Receive a weekly digest of ticket volumes, SLA adherence, and team performance.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.emailWeeklyReport} onChange={() => toggleNotif('emailWeeklyReport')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS & Urgent Alerts Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Smartphone size={20} /></div>
                    <div>
                      <h3>SMS & Urgent Escalations</h3>
                      <p>Configure critical alerts sent directly to your verified phone number.</p>
                    </div>
                  </div>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Critical Priority Outage Alerts</strong>
                        <p>Instant SMS when a P0/Critical system outage ticket is created.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.smsCriticalAlerts} onChange={() => toggleNotif('smsCriticalAlerts')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>SLA Breach Warnings</strong>
                        <p>Receive SMS warning when high-priority tickets are 30 mins from SLA breach.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notifSettings.smsSlaBreach} onChange={() => toggleNotif('smsSlaBreach')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 4. SECURITY SETTINGS TAB */}
          {activeTab === 'security' && (
            <>
              {/* Password Management */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Key size={20} /></div>
                    <div>
                      <h3>Change Password</h3>
                      <p>Ensure your account is protected with a strong, unique password.</p>
                    </div>
                  </div>
                </div>

                <div className="security-password-form">
                  <div className="config-field">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••••••"
                      value={securityState.currentPassword}
                      onChange={(e) => setSecurityState({ ...securityState, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="form-fields-2col">
                    <div className="config-field">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={securityState.newPassword}
                        onChange={(e) => setSecurityState({ ...securityState, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="config-field">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        value={securityState.confirmPassword}
                        onChange={(e) => setSecurityState({ ...securityState, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Shield size={20} /></div>
                    <div>
                      <h3>Two-Factor Authentication (2FA)</h3>
                      <p>Add an extra layer of security when logging into your admin account.</p>
                    </div>
                  </div>
                  <div className="card-actions">
                    <div className={`status-badge ${securityState.twoFactorEnabled ? 'active' : ''}`} style={{ background: securityState.twoFactorEnabled ? '#ecfdf5' : '#fef2f2', color: securityState.twoFactorEnabled ? '#10b981' : '#ef4444' }}>
                      <span className="dot"></span> {securityState.twoFactorEnabled ? '2FA Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Authenticator App (TOTP)</strong>
                        <p>Use Google Authenticator, 1Password, or Microsoft Authenticator for 6-digit login codes.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={securityState.twoFactorEnabled} 
                        onChange={() => {
                          setSecurityState(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
                          showToast(securityState.twoFactorEnabled ? '2FA disabled' : '2FA activated successfully!', 'info');
                        }} 
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Laptop size={20} /></div>
                    <div>
                      <h3>Active Login Sessions</h3>
                      <p>Manage devices and browser sessions currently logged into your account.</p>
                    </div>
                  </div>
                </div>

                <div className="sessions-list">
                  {sessions.map(session => (
                    <div key={session.id} className="session-item">
                      <div className="session-info">
                        <div className="session-icon">
                          {session.device.includes('iPhone') ? <Smartphone size={18} /> : <Laptop size={18} />}
                        </div>
                        <div>
                          <div className="session-device-row">
                            <strong>{session.device}</strong>
                            {session.current && <span className="current-badge">Current Device</span>}
                          </div>
                          <p className="session-meta">{session.location} • {session.ip} • {session.time}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="btn-revoke" onClick={() => handleRevokeSession(session.id)}>
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 5. PRIVACY & DATA TAB */}
          {activeTab === 'privacy' && (
            <>
              {/* GDPR Governance Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Lock size={20} /></div>
                    <div>
                      <h3>GDPR & Data Protection Policy</h3>
                      <p>Manage customer consent, data privacy, and data retention rules.</p>
                    </div>
                  </div>
                </div>

                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Anonymize User Data on Deletion</strong>
                        <p>Scrub all personally identifiable information (PII) from closed tickets upon user deletion request.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={privacyState.anonymizeOnDelete} onChange={() => togglePrivacy('anonymizeOnDelete')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-info">
                      <div>
                        <strong>Performance & Usage Analytics</strong>
                        <p>Collect anonymous ticket resolution telemetry to improve support response times.</p>
                      </div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={privacyState.cookieAnalytics} onChange={() => togglePrivacy('cookieAnalytics')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Export Card */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Download size={20} /></div>
                    <div>
                      <h3>Export System & Audit Data</h3>
                      <p>Download full archives of your support data for backup or compliance reporting.</p>
                    </div>
                  </div>
                </div>

                <div className="export-cards-grid">
                  <div className="export-box" onClick={() => handleExportData('csv')}>
                    <div className="export-icon csv"><FileSpreadsheet size={24} /></div>
                    <div className="export-text">
                      <strong>Export Tickets (CSV)</strong>
                      <p>Download complete ticket records, resolution times, and agent notes.</p>
                    </div>
                    <button className="btn-export-action"><Download size={14} /> Download</button>
                  </div>

                  <div className="export-box" onClick={() => handleExportData('json')}>
                    <div className="export-icon json"><FileJson size={24} /></div>
                    <div className="export-text">
                      <strong>Audit Logs & Compliance (JSON)</strong>
                      <p>Export cryptographic system logs and customer consent history.</p>
                    </div>
                    <button className="btn-export-action"><Download size={14} /> Download</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 6. APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <>
              {/* Theme Selector */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Palette size={20} /></div>
                    <div>
                      <h3>Color Theme & Mode</h3>
                      <p>Customize the visual style and color scheme of your support workspace.</p>
                    </div>
                  </div>
                </div>

                <div className="theme-options-grid">
                  <div 
                    className={`theme-card ${appearanceState.theme === 'light' ? 'active' : ''}`}
                    onClick={() => {
                      setAppearanceState(prev => ({ ...prev, theme: 'light' }));
                      showToast('Light theme selected', 'info');
                    }}
                  >
                    <div className="theme-preview light-mode-preview">
                      <Sun size={24} color="#f59e0b" />
                    </div>
                    <div className="theme-card-footer">
                      <strong>Light Mode</strong>
                      {appearanceState.theme === 'light' && <Check size={16} color="#4f46e5" />}
                    </div>
                  </div>

                  <div 
                    className={`theme-card ${appearanceState.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => {
                      setAppearanceState(prev => ({ ...prev, theme: 'dark' }));
                      showToast('Dark theme selected', 'info');
                    }}
                  >
                    <div className="theme-preview dark-mode-preview">
                      <Moon size={24} color="#818cf8" />
                    </div>
                    <div className="theme-card-footer">
                      <strong>Dark Mode</strong>
                      {appearanceState.theme === 'dark' && <Check size={16} color="#4f46e5" />}
                    </div>
                  </div>

                  <div 
                    className={`theme-card ${appearanceState.theme === 'system' ? 'active' : ''}`}
                    onClick={() => {
                      setAppearanceState(prev => ({ ...prev, theme: 'system' }));
                      showToast('System synchronized mode selected', 'info');
                    }}
                  >
                    <div className="theme-preview system-mode-preview">
                      <Monitor size={24} color="#64748b" />
                    </div>
                    <div className="theme-card-footer">
                      <strong>System Synchronized</strong>
                      {appearanceState.theme === 'system' && <Check size={16} color="#4f46e5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Color & Display Density */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Settings size={20} /></div>
                    <div>
                      <h3>Accent Color & Layout Density</h3>
                      <p>Personalize button highlights and table compact spacing.</p>
                    </div>
                  </div>
                </div>

                <div className="appearance-details-grid">
                  <div className="config-field">
                    <label>Brand Accent Color</label>
                    <div className="accent-colors-row">
                      {['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map(color => (
                        <button
                          key={color}
                          className={`accent-color-circle ${appearanceState.accentColor === color ? 'selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setAppearanceState({ ...appearanceState, accentColor: color })}
                        >
                          {appearanceState.accentColor === color && <Check size={14} color="#fff" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="config-field">
                    <label>Layout Density</label>
                    <div className="density-select-row">
                      <button 
                        className={`btn-density ${appearanceState.density === 'comfortable' ? 'active' : ''}`}
                        onClick={() => setAppearanceState({ ...appearanceState, density: 'comfortable' })}
                      >
                        Comfortable (Default)
                      </button>
                      <button 
                        className={`btn-density ${appearanceState.density === 'compact' ? 'active' : ''}`}
                        onClick={() => setAppearanceState({ ...appearanceState, density: 'compact' })}
                      >
                        Compact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 7. HELP & SUPPORT TAB */}
          {activeTab === 'help' && (
            <>
              {/* Support Quick Links */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><Headphones size={20} /></div>
                    <div>
                      <h3>Help & Technical Support</h3>
                      <p>Access developer documentation, contact our support engineering team, or check system health.</p>
                    </div>
                  </div>
                </div>

                <div className="help-cards-grid">
                  <div className="help-card" onClick={() => showToast('Opening API Documentation...', 'info')}>
                    <div className="help-card-icon"><FileSpreadsheet size={22} /></div>
                    <h4>Documentation & API</h4>
                    <p>Read guides on webhook integrations, REST endpoints, and custom ticketing automation.</p>
                    <span className="help-link">Explore Docs <ExternalLink size={12} /></span>
                  </div>

                  <div className="help-card" onClick={() => showToast('Connecting to 24/7 Priority Support...', 'info')}>
                    <div className="help-card-icon"><Headphones size={22} /></div>
                    <h4>24/7 Priority Support</h4>
                    <p>Direct priority line to our tier-3 escalation engineers for emergency assistance.</p>
                    <span className="help-link">Contact Us <ExternalLink size={12} /></span>
                  </div>

                  <div className="help-card" onClick={() => showToast('Feedback modal opened', 'info')}>
                    <div className="help-card-icon"><AlertCircle size={22} /></div>
                    <h4>Submit Feedback</h4>
                    <p>Suggest new features or report issues directly to the product engineering team.</p>
                    <span className="help-link">Give Feedback <ExternalLink size={12} /></span>
                  </div>
                </div>
              </div>

              {/* FAQ Accordions */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><HelpCircle size={20} /></div>
                    <div>
                      <h3>Frequently Asked Questions</h3>
                      <p>Common questions about SLA calculation, security, and administrative controls.</p>
                    </div>
                  </div>
                </div>

                <div className="faq-list">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button className="faq-question-btn" onClick={() => setOpenFaq(isOpen ? -1 : idx)}>
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Diagnostics & Health */}
              <div className="settings-card">
                <div className="card-header-row">
                  <div className="card-header-title">
                    <div className="card-icon blue"><CheckCircle2 size={20} /></div>
                    <div>
                      <h3>System Health & Version</h3>
                      <p>Current operational telemetry for ResolveDesk Enterprise.</p>
                    </div>
                  </div>
                </div>

                <div className="diagnostics-grid">
                  <div className="diagnostic-stat">
                    <span className="diag-label">Core API Status</span>
                    <span className="diag-val operational"><Check size={14} /> 99.99% Operational</span>
                  </div>
                  <div className="diagnostic-stat">
                    <span className="diag-label">Database Latency</span>
                    <span className="diag-val">18ms</span>
                  </div>
                  <div className="diagnostic-stat">
                    <span className="diag-label">Release Version</span>
                    <span className="diag-val">v2.4.0-prod</span>
                  </div>
                  <div className="diagnostic-stat">
                    <span className="diag-label">Environment</span>
                    <span className="diag-val">Production (US-East)</span>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      
      {/* Floating Save Button */}
      <div className="floating-save-action">
        <button className="btn-save-changes" onClick={handleSave}>
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
