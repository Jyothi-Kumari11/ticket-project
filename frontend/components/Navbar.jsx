import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';

const Navbar = ({ onOpenSearch }) => {
  const { currentUser, notifications, logout, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isUser = currentUser?.role === 'user';
  const displayName = currentUser?.name || 'User';
  const displayInitials = displayName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';
  const displayRole = isUser ? 'Customer' : 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      {/* Search */}
      <div className="navbar-search" onClick={onOpenSearch}>
        <Search size={15} color="#9CA3AF" />
        <span className="navbar-search-text">
          {isUser ? 'Search tickets, subjects, or keywords...' : 'Search tickets by ID, subject, or category...'}
        </span>
        <kbd>Ctrl + K</kbd>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Bell & Notification Popover */}
        <div className="notif-popover-wrapper" ref={notifRef}>
          <button 
            className="navbar-icon-btn" 
            aria-label="Notifications"
            onClick={() => setShowNotifMenu(v => !v)}
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifMenu && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Notifications</strong>
                  {unreadCount > 0 && <span className="badge badge-primary" style={{ fontSize: '11px' }}>{unreadCount} new</span>}
                </div>
                {unreadCount > 0 && (
                  <button 
                    className="btn btn-link btn-xs" 
                    onClick={markAllNotificationsRead}
                    style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="notif-dropdown-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">No notifications yet</div>
                ) : (
                  notifications.slice(0, 8).map(n => (
                    <div 
                      key={n.id} 
                      className={`notif-dropdown-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setShowNotifMenu(false);
                        if (n.ticketId) {
                          navigate(isUser ? `/app/user/ticket/${n.ticketId}` : `/app/admin/ticket/${n.ticketId}`);
                        }
                      }}
                    >
                      <div className="notif-item-header">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-time">{n.time || 'Just now'}</span>
                      </div>
                      <p className="notif-item-desc">{n.message}</p>
                      {n.ticketId && (
                        <span className="notif-ticket-tag">
                          Ticket: {n.ticketId}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-divider" />

        {/* Profile */}
        <div className="navbar-profile" ref={profileRef} onClick={() => setShowProfileMenu(v => !v)}>
          <div className="nav-avatar">{displayInitials}</div>
          <div className="nav-profile-info">
            <span className="nav-name">{displayName}</span>
            <span className="nav-role">{displayRole}</span>
          </div>
          <ChevronDown size={14} color="#9CA3AF" />

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <strong>{displayName}</strong>
                <span>{displayRole}</span>
              </div>
              <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate(isUser ? '/app/user/profile' : '/app/admin/settings'); }}>
                <User size={14} /> My Profile
              </button>
              <button className="dropdown-item" onClick={() => { setShowProfileMenu(false); navigate(isUser ? '/app/user/settings' : '/app/admin/settings'); }}>
                <Settings size={14} /> Settings
              </button>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
