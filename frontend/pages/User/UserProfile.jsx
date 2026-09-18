import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User, Lock, Bell, Clock, Edit2, Ticket, CheckCircle2, AlertCircle,
  Phone, Mail, Building, FileText, Upload, Shield, Key, Smartphone,
  Laptop, Check, Globe, RefreshCw, LogOut, ShieldCheck, Zap
} from 'lucide-react';

const UserProfile = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('Personal Info');
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Jyothi Kumari',
    email: currentUser?.email || 'jyothikumari1146@gmail.com',
    phone: currentUser?.phone || '+1 (555) 000-1111',
    department: 'Customer Operations',
    role: 'Customer',
    customerId: 'CUST-2026-0042',
    bio: 'Customer Operations Specialist managing support tickets and service inquiries.'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [notifications, setNotifications] = useState({
    emailTickets: true,
    emailDigest: true,
    emailPromos: false,
    smsAlerts: true,
    pushNotifications: true
  });

  const [activityFilter, setActivityFilter] = useState('All');

  const handleProfileSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone
    });
    showToast?.('Profile information updated successfully!', 'success');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!securityData.currentPassword) {
      showToast?.('Please enter your current password', 'error');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast?.('New passwords do not match', 'error');
      return;
    }
    showToast?.('Password changed successfully!', 'success');
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactorEnabled: securityData.twoFactorEnabled });
  };

  const handleNotificationSave = () => {
    showToast?.('Notification preferences saved!', 'success');
  };

  const tabs = [
    { label: 'Personal Info', icon: User },
    { label: 'Security', icon: Lock },
    { label: 'Notifications', icon: Bell },
    { label: 'Activity', icon: Clock }
  ];

  const initials = profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JK';

  const activityLogs = [
    { id: 1, title: 'Logged in from Chrome on Windows', date: 'Just now (10:48 AM)', category: 'Security', icon: Laptop, color: '#3B82F6', ip: '192.168.1.45' },
    { id: 2, title: 'Updated profile information', date: 'Today at 09:15 AM', category: 'Account', icon: User, color: '#4F46E5', ip: '192.168.1.45' },
    { id: 3, title: 'Submitted Ticket #TK-2026-089 (Payment Issue)', date: 'Yesterday at 03:45 PM', category: 'Tickets', icon: Ticket, color: '#EC4899', ip: '192.168.1.45' },
    { id: 4, title: 'Password changed successfully', date: 'Sep 14, 2026 at 02:10 PM', category: 'Security', icon: Key, color: '#10B981', ip: '192.168.1.45' },
    { id: 5, title: 'Resolved Ticket #TK-2026-042 (API Latency)', date: 'Sep 10, 2026 at 11:30 AM', category: 'Tickets', icon: CheckCircle2, color: '#10B981', ip: '192.168.1.45' },
    { id: 6, title: 'Email notification preferences updated', date: 'Sep 05, 2026 at 04:20 PM', category: 'Account', icon: Bell, color: '#F59E0B', ip: '192.168.1.45' }
  ];

  const filteredActivities = activityFilter === 'All' 
    ? activityLogs 
    : activityLogs.filter(a => a.category === activityFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ background: '#EFF6FF', color: '#3B82F6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: 0 }}>My Profile</h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0' }}>Manage your personal information, communication preferences, and security settings.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0px' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 4px 14px 4px',
                border: 'none',
                background: 'none',
                color: isActive ? '#4F46E5' : '#64748B',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                position: 'relative',
                transition: 'color 0.2s ease'
              }}
            >
              <Icon size={16} color={isActive ? '#4F46E5' : '#64748B'} />
              <span>{tab.label}</span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#4F46E5',
                    borderRadius: '2px 2px 0 0'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Tab Views */}
        <div>
          
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'Personal Info' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#EEF2FF', padding: '10px', borderRadius: '10px', color: '#4F46E5' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Personal Information</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6B7280' }}>Update your basic information and contact details.</p>
                  </div>
                </div>
                <button
                  onClick={handleProfileSave}
                  style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  Save Changes
                </button>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Full Name <span style={{color: '#EF4444'}}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Email Address <span style={{color: '#EF4444'}}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Phone Number <span style={{color: '#EF4444'}}>*</span></label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Department / Organization</label>
                    <div style={{ position: 'relative' }}>
                      <Building size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Role</label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                      <select
                        value={profileData.role}
                        onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '14px', color: '#9CA3AF', outline: 'none', appearance: 'none', cursor: 'not-allowed' }}
                        disabled
                      >
                        <option value="Customer">Customer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Customer ID</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '9px', color: '#9CA3AF', fontSize: '15px' }}>#</span>
                      <input
                        type="text"
                        value={profileData.customerId}
                        onChange={(e) => setProfileData({...profileData, customerId: e.target.value})}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '6px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '14px', color: '#9CA3AF', outline: 'none', cursor: 'not-allowed' }}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Bio <span style={{color: '#9CA3AF', fontWeight: '400'}}>(Optional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={15} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <textarea
                      placeholder="Tell us a little about yourself..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: '#4F46E5', color: 'white', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '600', position: 'relative' }}>
                    {initials}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', borderRadius: '50%', padding: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      <Upload size={12} color="#4F46E5" />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: '#111827' }}>Profile Picture</h4>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748B' }}>Upload a new profile picture. JPG, PNG or GIF (Max 5MB).</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #D1D5DB', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#4F46E5', cursor: 'pointer' }}>
                        <Upload size={14} /> Choose File
                      </button>
                      <span style={{ fontSize: '12px', color: '#9CA3AF' }}>No file chosen</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Change Password Card */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ background: '#EEF2FF', padding: '10px', borderRadius: '10px', color: '#4F46E5' }}>
                    <Key size={20} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Change Password</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>Update your password to keep your account secure.</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button
                      type="submit"
                      style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* 2FA & Active Sessions */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: '#ECFDF5', padding: '10px', borderRadius: '10px', color: '#10B981' }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>Two-Factor Authentication (2FA)</h3>
                      <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>Add an extra layer of protection to your account.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled });
                      showToast?.(`2FA ${!securityData.twoFactorEnabled ? 'enabled' : 'disabled'} successfully`, 'info');
                    }}
                    style={{
                      background: securityData.twoFactorEnabled ? '#EF4444' : '#10B981',
                      color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    {securityData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Active Sessions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Laptop size={18} color="#4F46E5" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Chrome on Windows 11 (Current Session)</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>IP: 192.168.1.45 • Last active: Just now</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: '600', color: '#10B981', background: '#D1FAE5', padding: '2px 8px', borderRadius: '12px' }}>Active Now</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Smartphone size={18} color="#64748B" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Safari on iPhone 15 Pro</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>IP: 172.56.21.11 • Last active: 2 hours ago</div>
                        </div>
                      </div>
                      <button style={{ background: 'none', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#64748B', cursor: 'pointer' }}>Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: '#FEF3C7', padding: '10px', borderRadius: '10px', color: '#D97706' }}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Notification Preferences</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>Choose how and when you want to be notified.</p>
                  </div>
                </div>
                <button
                  onClick={handleNotificationSave}
                  style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Save Preferences
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Ticket Status Updates</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Receive instant email notifications when your tickets are updated or resolved.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailTickets}
                    onChange={(e) => setNotifications({ ...notifications, emailTickets: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4F46E5' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Weekly Summary Digest</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>A weekly email report of your active support requests and resolutions.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailDigest}
                    onChange={(e) => setNotifications({ ...notifications, emailDigest: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4F46E5' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>SMS Security Alerts</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Get text alerts for logins from new devices or password changes.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsAlerts}
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4F46E5' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Browser Push Notifications</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Show pop-up alerts in your browser when an agent replies to your ticket.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4F46E5' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: '#F0F9FF', padding: '10px', borderRadius: '10px', color: '#0284C7' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Activity Log</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280' }}>Track all account events, security updates, and ticket interactions.</p>
                  </div>
                </div>

                {/* Filter pills */}
                <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
                  {['All', 'Security', 'Tickets', 'Account'].map(f => (
                    <button
                      key={f}
                      onClick={() => setActivityFilter(f)}
                      style={{
                        border: 'none',
                        background: activityFilter === f ? 'white' : 'transparent',
                        color: activityFilter === f ? '#0F172A' : '#64748B',
                        fontWeight: activityFilter === f ? '600' : '500',
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        boxShadow: activityFilter === f ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Timeline List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', marginTop: '10px' }}>
                {filteredActivities.map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={act.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                      <div style={{ background: `${act.color}15`, color: act.color, padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ActIcon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{act.title}</h4>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>{act.date}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px', fontSize: '12px', color: '#64748B' }}>
                          <span style={{ background: '#E2E8F0', color: '#334155', padding: '1px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>{act.category}</span>
                          <span>IP Address: {act.ip}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Profile Summary & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Card & Stats */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '600', position: 'relative' }}>
                {initials}
                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                  <Edit2 size={12} color="#4F46E5" />
                </div>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{profileData.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.9 }}>Customer Operations</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '16px 20px', gap: '10px' }}>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ background: '#EFF6FF', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Ticket size={14} color="#3B82F6" /></div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>12</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Total</div>
                <div style={{ position: 'absolute', right: '-5px', top: '10px', height: '30px', width: '1px', background: '#E5E7EB' }} />
              </div>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ background: '#ECFDF5', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><CheckCircle2 size={14} color="#10B981" /></div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>6</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Resolved</div>
                <div style={{ position: 'absolute', right: '-5px', top: '10px', height: '30px', width: '1px', background: '#E5E7EB' }} />
              </div>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ background: '#EEF2FF', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Clock size={14} color="#4F46E5" /></div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>2</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>In Progress</div>
                <div style={{ position: 'absolute', right: '-5px', top: '10px', height: '30px', width: '1px', background: '#E5E7EB' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#FEF3C7', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><AlertCircle size={14} color="#F59E0B" /></div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>4</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Open</div>
              </div>
            </div>
          </div>

          {/* Quick Security Status Widget */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: '#EEF2FF', padding: '8px', borderRadius: '8px', color: '#4F46E5' }}>
                <Lock size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#111827' }}>Account Security</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>Overall score: <span style={{ color: '#10B981', fontWeight: '600' }}>Good</span></p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#374151' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10B981" /> Strong Password</span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#374151' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="#10B981" /> Email Verified</span>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '600' }}>Verified</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#374151' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={14} color="#F59E0B" /> 2-Factor Auth</span>
                <button onClick={() => setActiveTab('Security')} style={{ fontSize: '11px', color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Configure</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;

