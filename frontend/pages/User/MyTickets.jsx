import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search, Plus, MoreVertical, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, Bell, Filter, Calendar
} from 'lucide-react';

const TicketIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const ITEMS_PER_PAGE = 6;

const MyTickets = () => {
  const { currentUser, tickets } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [trackId, setTrackId] = useState('');
  const [page, setPage] = useState(1);

  const userTickets = tickets.filter(
    (t) => t.userId === currentUser?.id || t.userEmail === currentUser?.email
  );

  const mockTickets = [
    { ticketId: 'TKT-2026-0012', subject: 'Unable to login to my account', category: 'Account & Login', priority: 'High', status: 'In Progress', updatedAt: 'Today, 11:42 AM', assignedTo: 'Support Team' },
    { ticketId: 'TKT-2026-0011', subject: 'Payment failed', category: 'Payment & Billing', priority: 'Critical', status: 'Open', updatedAt: 'Today, 09:15 AM', assignedTo: 'Billing Team' },
    { ticketId: 'TKT-2026-0010', subject: 'Network connection issue', category: 'Network', priority: 'Medium', status: 'Waiting for User', updatedAt: 'Yesterday, 04:32 PM', assignedTo: 'Network Team' },
    { ticketId: 'TKT-2026-0009', subject: 'Feature not working properly', category: 'Service Issue', priority: 'Low', status: 'Resolved', updatedAt: 'Yesterday, 11:20 AM', assignedTo: 'Dev Team' },
    { ticketId: 'TKT-2026-0008', subject: 'Account verification delay', category: 'Account & Login', priority: 'Medium', status: 'Closed', updatedAt: '15 Sep 2026, 06:12 PM', assignedTo: 'Support Team' },
    { ticketId: 'TKT-2026-0007', subject: 'App not responding', category: 'Technical Issue', priority: 'High', status: 'In Progress', updatedAt: '14 Sep 2026, 02:45 PM', assignedTo: 'Tech Team' },
    { ticketId: 'TKT-2026-0006', subject: 'Cannot upload documents', category: 'Technical Issue', priority: 'Medium', status: 'Open', updatedAt: '13 Sep 2026, 10:30 AM', assignedTo: null },
    { ticketId: 'TKT-2026-0005', subject: 'Password reset not working', category: 'Account & Login', priority: 'High', status: 'Resolved', updatedAt: '12 Sep 2026, 03:45 PM', assignedTo: 'Auth Team' },
    { ticketId: 'TKT-2026-0004', subject: 'Billing discrepancy found', category: 'Payment & Billing', priority: 'Critical', status: 'Closed', updatedAt: '11 Sep 2026, 01:15 PM', assignedTo: 'Billing Team' },
    { ticketId: 'TKT-2026-0003', subject: 'API response delays', category: 'Technical Issue', priority: 'Low', status: 'Resolved', updatedAt: '10 Sep 2026, 09:00 AM', assignedTo: 'Dev Team' },
    { ticketId: 'TKT-2026-0002', subject: 'Dashboard data mismatch', category: 'Service Issue', priority: 'Medium', status: 'In Progress', updatedAt: '09 Sep 2026, 11:30 AM', assignedTo: 'QA Team' },
    { ticketId: 'TKT-2026-0001', subject: 'Initial setup assistance', category: 'Account & Login', priority: 'Low', status: 'Closed', updatedAt: '01 Sep 2026, 08:00 AM', assignedTo: 'Onboarding Team' },
  ];

  const displayTickets = userTickets.length > 0 ? userTickets : mockTickets;

  const totalCount = displayTickets.length;
  const openCount = displayTickets.filter(t => t.status === 'Open').length;
  const inProgressCount = displayTickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = displayTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  // Filter
  let filtered = displayTickets.filter(t => {
    const matchSearch = !searchTerm || t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchPri = selectedPriority === 'All' || t.priority === selectedPriority;
    const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchSearch && matchCat && matchPri && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTickets = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getStatusBadge = (status) => {
    const map = {
      'In Progress': 'badge badge-in-progress',
      'Open': 'badge badge-open',
      'Waiting for User': 'badge badge-waiting',
      'Waiting for Reply': 'badge badge-waiting',
      'Resolved': 'badge badge-resolved',
      'Closed': 'badge badge-closed',
    };
    return map[status] || 'badge badge-closed';
  };

  const getPriorityBadge = (priority) => ({
    'High': 'badge badge-high',
    'Critical': 'badge badge-critical',
    'Medium': 'badge badge-medium',
    'Low': 'badge badge-low',
  })[priority] || 'badge badge-low';

  const recentActivity = [
    { dot: 'dot-blue', text: 'Your ticket TKT-2026-0012 is now In Progress', time: '2 hours ago' },
    { dot: 'dot-green', text: 'Admin replied to your ticket TKT-2026-0010', time: '4 hours ago' },
    { dot: 'dot-purple', text: 'Your ticket TKT-2026-0009 is resolved', time: 'Yesterday' },
    { dot: 'dot-amber', text: 'New update on TKT-2026-0011', time: 'Yesterday' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Tickets</h1>
          <p>Manage and track all your complaints and requests.</p>
        </div>
        <Link to="/app/user/create-ticket" className="btn btn-primary">
          <Plus size={15} /> New Ticket
        </Link>
      </div>

      <div className="my-tickets-layout">
        {/* Main Content */}
        <div className="my-tickets-main">
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-blue"><TicketIcon size={20} /></div>
              </div>
              <span className="kpi-label">Total Tickets</span>
              <span className="kpi-value">{totalCount}</span>
              <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up" /><span className="kpi-trend-up" style={{fontWeight:600}}>20%</span><span>from last month</span></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-red">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
              </div>
              <span className="kpi-label">Open</span>
              <span className="kpi-value">{openCount}</span>
              <div className="kpi-trend"><TrendingDown size={12} className="kpi-trend-down" /><span className="kpi-trend-down" style={{fontWeight:600}}>50%</span><span>from last month</span></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
              </div>
              <span className="kpi-label">In Progress</span>
              <span className="kpi-value">{inProgressCount}</span>
              <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up" /><span className="kpi-trend-up" style={{fontWeight:600}}>33%</span><span>from last month</span></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
              </div>
              <span className="kpi-label">Resolved</span>
              <span className="kpi-value">{resolvedCount}</span>
              <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up" /><span className="kpi-trend-up" style={{fontWeight:600}}>100%</span><span>from last month</span></div>
            </div>
          </div>

          {/* Table Card */}
          <div className="table-card">
            {/* Filters Bar */}
            <div className="filters-bar">
              <div className="filter-search">
                <Search size={14} color="#9CA3AF" />
                <input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>

              <div className="filter-select">
                <select value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}>
                  <option value="All">All Categories</option>
                  <option>Account & Login</option>
                  <option>Payment & Billing</option>
                  <option>Technical Issue</option>
                  <option>Network</option>
                  <option>Service Issue</option>
                </select>
              </div>

              <div className="filter-select">
                <select value={selectedPriority} onChange={e => { setSelectedPriority(e.target.value); setPage(1); }}>
                  <option value="All">All Priorities</option>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>

              <div className="filter-select">
                <select value={selectedStatus} onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}>
                  <option value="All">All Statuses</option>
                  <option>Open</option><option>In Progress</option><option>Waiting for User</option><option>Resolved</option><option>Closed</option>
                </select>
              </div>

              <div className="filter-select">
                <Calendar size={13} color="#6B7280" />
                <select defaultValue="30">
                  <option value="30">Last 30 days</option>
                  <option value="7">Last 7 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              <div className="filter-actions-right">
                <button className="btn btn-secondary btn-sm"><Filter size={13} /> Filters</button>
              </div>
            </div>

            <table className="ds-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map(t => (
                  <tr key={t.ticketId} style={{cursor:'pointer'}} onClick={() => navigate(`/app/user/ticket/${t.ticketId}`)}>
                    <td>
                      <div className="ticket-id-cell">
                        <div className="ticket-id-icon"><TicketIcon size={12} /></div>
                        <span className="ticket-id-text">{t.ticketId}</span>
                      </div>
                    </td>
                    <td><span className="ticket-subject">{t.subject}</span></td>
                    <td><span className="badge-category">{t.category}</span></td>
                    <td><span className={getPriorityBadge(t.priority)}>{t.priority}</span></td>
                    <td><span className={getStatusBadge(t.status)}>{t.status}</span></td>
                    <td><span className="table-date">{t.updatedAt}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/app/user/ticket/${t.ticketId}`)}>View</button>
                        <button className="btn btn-icon btn-secondary btn-sm"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-bar">
              <span className="pagination-info">
                Showing {Math.min((page-1)*ITEMS_PER_PAGE+1, filtered.length)} to {Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} tickets
              </span>
              <div className="pagination-controls">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>
                  <ChevronLeft size={14} />
                </button>
                {Array.from({length: Math.min(totalPages, 5)}, (_, i) => i+1).map(p => (
                  <button key={p} className={`page-btn ${page===p ? 'active':''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
          {/* Track Your Ticket */}
          <div className="track-widget">
            <div className="track-widget-header">
              <div className="track-widget-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <div>
                <div className="track-widget-title">Track Your Ticket</div>
                <div className="track-widget-sub">Enter your ticket ID to check status instantly.</div>
              </div>
            </div>
            <input
              className="track-input"
              placeholder="e.g. TKT-2026-0012"
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
            />
            <button
              className="track-btn"
              onClick={() => { if (trackId.trim()) navigate(`/app/user/ticket/${trackId.trim()}`); }}
            >
              Track
            </button>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="recent-activity-header">
              <span className="recent-activity-title">Recent Activity</span>
              <button className="view-all-btn">View All</button>
            </div>
            {recentActivity.map((a, i) => (
              <div key={i} className="activity-item">
                <span className={`activity-dot ${a.dot}`} />
                <div>
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Promo */}
          <div className="help-promo-card">
            <span className="help-promo-img">👩‍💻</span>
            <div className="help-promo-title">Have a question?</div>
            <p className="help-promo-sub">Check our Knowledge Base for quick solutions.</p>
            <Link to="/app/user/knowledge-base" className="help-promo-link">Visit Knowledge Base →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
