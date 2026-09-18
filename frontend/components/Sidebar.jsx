import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Search,
  HelpCircle,
  Bell,
  User,
  Settings,
  LogOut,
  BarChart3,
  Users,
  FileText,
  Headphones
} from 'lucide-react';

const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

const Sidebar = () => {
  const { currentUser, logout, notifications } = useApp();
  const navigate = useNavigate();

  const isUser = currentUser?.role === 'user';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const userNavItems = [
    { label: 'Dashboard', path: '/app/user/dashboard', icon: LayoutDashboard },
    { label: 'My Tickets', path: '/app/user/tickets', icon: Ticket },
    { label: 'Create Ticket', path: '/app/user/create-ticket', icon: PlusCircle },
    { label: 'Profile', path: '/app/user/profile', icon: User },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/app/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Tickets', path: '/app/admin/tickets', icon: Ticket },
    { label: 'Users', path: '/app/admin/users', icon: Users },
    { label: 'Reports', path: '/app/admin/audit-logs', icon: BarChart3 },
  ];

  const navItems = isUser ? userNavItems : adminNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <LayersIcon />
        </div>
        <div className="sidebar-brand-text">
          <span className="brand-name">ResolveDesk</span>
          <span className="brand-sub">Complaint & Ticket Management</span>
        </div>
      </div>

      {/* Role Indicator (read-only, set by JWT) */}
      <div className="role-indicator">
        <span className={`role-badge-pill ${isUser ? 'user' : 'admin'}`}>
          {isUser ? '👤 Customer' : '🛡️ Admin'}
        </span>
        <span className="role-badge-name">{currentUser?.name || 'User'}</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="sidebar-bottom">
        <NavLink
          to={isUser ? '/app/user/profile' : '/app/admin/settings'}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <Settings size={17} />
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-link" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>

      {/* Help Card */}
      <div className="sidebar-help-card">
        <div className="help-card-icon">
          <Headphones size={16} color="white" />
        </div>
        <div className="help-card-text">
          <strong>Need help?</strong>
          <span>We're here for you!</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
