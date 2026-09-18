import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Plus, ArrowRight, MoreHorizontal,
  TrendingUp, TrendingDown, Clock, HelpCircle, AlertCircle, BookOpen, Headset
} from 'lucide-react';

const TicketIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const UserDashboard = () => {
  const { currentUser, tickets } = useApp();
  const navigate = useNavigate();

  const myTickets = tickets.filter(
    (t) => t.userId === currentUser?.id || t.userEmail === currentUser?.email
  );

  const totalCount = myTickets.length || 3;
  const inProgressCount = myTickets.filter((t) => t.status === 'In Progress' || t.status === 'Open').length || 1;
  const waitingCount = myTickets.filter((t) => t.status === 'Waiting for User' || t.status === 'Awaiting Reply').length || 2;
  const resolvedCount = myTickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length || 2;

  const displayName = currentUser?.name?.split(' ')[0] || 'Alex';
  const fullName = currentUser?.name || 'Alex Johnson';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const recentTickets = myTickets.length > 0
    ? [...myTickets].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)
    : [
        { ticketId: 'TKT-2026-0001', subject: 'Unable to login to my account', category: 'Account & Login', priority: 'High', status: 'In Progress', updatedAt: '2026-09-16T10:42:00Z' },
        { ticketId: 'TKT-2026-0002', subject: 'Payment not reflecting', category: 'Billing', priority: 'Medium', status: 'Awaiting Reply', updatedAt: '2026-09-15T14:20:00Z' },
        { ticketId: 'TKT-2026-0003', subject: 'Feature request', category: 'Feature Request', priority: 'Low', status: 'Resolved', updatedAt: '2026-09-13T09:12:00Z' },
      ];

  const getStatusBadge = (status) => {
    const map = {
      'In Progress': 'badge badge-in-progress',
      'Open': 'badge badge-open',
      'Waiting for Reply': 'badge badge-waiting',
      'Awaiting Reply': 'badge badge-waiting',
      'Waiting for User': 'badge badge-waiting',
      'Resolved': 'badge badge-resolved',
      'Closed': 'badge badge-closed',
    };
    return map[status] || 'badge badge-closed';
  };

  const getPriorityBadge = (priority) => {
    const map = {
      'High': 'badge badge-high',
      'Critical': 'badge badge-critical',
      'Medium': 'badge badge-medium',
      'Low': 'badge badge-low',
    };
    return map[priority] || 'badge badge-low';
  };
  
  const getCategoryBadge = (category) => {
    if (category.includes('Billing') || category.includes('Payment')) return 'badge badge-purple';
    if (category.includes('Feature')) return 'badge badge-green';
    return 'badge badge-blue';
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-main-split">
        {/* LEFT COLUMN */}
        <div className="dashboard-left">
          
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-content">
              <div className="welcome-greeting">👋 {greeting},</div>
              <h1 className="welcome-title">{fullName}!</h1>
              <p className="welcome-subtitle">Track your complaints, check status, and get support — all in one place.</p>
              <Link to="/app/user/create-ticket" className="welcome-btn">
                <TicketIcon size={15} />
                Submit New Ticket
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="welcome-illustration">
              <div className="laptop-wrap">
                <div className="laptop-screen-outer">
                  <div className="laptop-screen-inner">
                    <div className="ls-bar w80" />
                    <div className="ls-bar w60" />
                    <div className="ls-row">
                      <div className="ls-block" />
                      <div className="ls-block ls-block-sm" />
                    </div>
                    <div className="ls-bar w40" />
                  </div>
                </div>
                <div className="laptop-base-outer" />
                <div className="deco-leaf" />
                {/* Floating Elements for Mockup Match */}
                <div className="float-chat">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                </div>
                <div className="float-gear">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </div>
                <div className="float-badge">
                  <div className="float-badge-inner">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
              </div>
              <div className="banner-text-right">We're here<br/>to help!</div>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-blue"><TicketIcon size={18} /></div>
                <Link to="/app/user/tickets" className="kpi-view-link">View all &rarr;</Link>
              </div>
              <span className="kpi-label">Total Tickets</span>
              <span className="kpi-value">{totalCount}</span>
              <div className="kpi-bottom-row">
                <div className="kpi-trend">
                  <TrendingUp size={13} className="kpi-trend-up" />
                  <span className="kpi-trend-up" style={{fontWeight:600}}>20%</span>
                  <span>vs. last 7 days</span>
                </div>
                <div className="kpi-sparkline spark-blue">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none"><path d="M0,15 C10,15 15,5 25,5 C35,5 40,15 50,15 L60,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-green">
                  <Clock size={18} />
                </div>
                <Link to="/app/user/tickets" className="kpi-view-link">View all &rarr;</Link>
              </div>
              <span className="kpi-label">Open / In Progress</span>
              <span className="kpi-value">{inProgressCount}</span>
              <div className="kpi-bottom-row">
                <div className="kpi-trend">
                  <TrendingUp size={13} className="kpi-trend-up" />
                  <span className="kpi-trend-up" style={{fontWeight:600}}>1%</span>
                  <span>vs. last 7 days</span>
                </div>
                <div className="kpi-sparkline spark-green">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none"><path d="M0,10 C15,10 20,2 30,8 C40,14 45,6 60,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-amber">
                  <AlertCircle size={18} />
                </div>
                <Link to="/app/user/tickets" className="kpi-view-link">View all &rarr;</Link>
              </div>
              <span className="kpi-label">Awaiting Your Reply</span>
              <span className="kpi-value">{waitingCount}</span>
              <div className="kpi-bottom-row">
                <div className="kpi-trend">
                  <TrendingDown size={13} className="kpi-trend-down" />
                  <span className="kpi-trend-down" style={{fontWeight:600}}>2%</span>
                  <span>vs. last 7 days</span>
                </div>
                <div className="kpi-sparkline spark-amber">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none"><path d="M0,8 C15,18 20,10 30,12 C40,14 45,4 60,12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card-top">
                <div className="kpi-icon kpi-icon-teal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <Link to="/app/user/tickets" className="kpi-view-link">View all &rarr;</Link>
              </div>
              <span className="kpi-label">Resolved</span>
              <span className="kpi-value">{resolvedCount}</span>
              <div className="kpi-bottom-row">
                <div className="kpi-trend">
                  <TrendingUp size={13} className="kpi-trend-up" />
                  <span className="kpi-trend-up" style={{fontWeight:600}}>3%</span>
                  <span>vs. last 7 days</span>
                </div>
                <div className="kpi-sparkline spark-teal">
                  <svg viewBox="0 0 60 20" preserveAspectRatio="none"><path d="M0,15 C15,15 20,5 30,10 C40,15 45,5 60,2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tickets Table */}
          <div className="table-card">
            <div className="table-header">
              <div className="table-header-left">
                <div className="table-header-icon"><TicketIcon size={18} /></div>
                <div>
                  <div className="table-header-title">Recent Tickets</div>
                  <div className="table-header-sub">Your latest complaints and their current status.</div>
                </div>
              </div>
              <Link to="/app/user/tickets" className="view-all-link">
                View All Tickets <ArrowRight size={14} />
              </Link>
            </div>

            <table className="ds-table">
              <thead>
                <tr>
                  <th>TICKET ID</th>
                  <th>SUBJECT</th>
                  <th>CATEGORY</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>LAST UPDATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t) => (
                  <tr key={t.ticketId}>
                    <td>
                      <div className="ticket-id-cell">
                        <div className="ticket-id-icon"><TicketIcon size={12} /></div>
                        <span className="ticket-id-text">{t.ticketId}</span>
                      </div>
                    </td>
                    <td><span className="ticket-subject">{t.subject}</span></td>
                    <td><span className={getCategoryBadge(t.category)}>{t.category}</span></td>
                    <td><span className={getPriorityBadge(t.priority)}>{t.priority}</span></td>
                    <td><span className={getStatusBadge(t.status)}>{t.status}</span></td>
                    <td><span className="table-date">{t.updatedAt}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="btn-ghost-view"
                          onClick={() => navigate(`/app/user/ticket/${t.ticketId}`)}
                        >
                          View
                        </button>
                        <button className="btn-icon-dots">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Quick Links Cards */}
          <div className="bottom-cards-grid">
            <div className="bottom-card" onClick={() => navigate('/app/user/create-ticket')}>
              <div className="bc-icon bc-purple">
                <AlertCircle size={18} />
              </div>
              <div className="bc-content">
                <div className="bc-title">Quick Actions</div>
                <div className="bc-desc">Create a new ticket or manage your requests.</div>
              </div>
              <ArrowRight size={14} className="bc-arrow" />
            </div>

            <div className="bottom-card" onClick={() => navigate('/app/user/knowledge-base')}>
              <div className="bc-icon bc-blue">
                <BookOpen size={18} />
              </div>
              <div className="bc-content">
                <div className="bc-title">Knowledge Base</div>
                <div className="bc-desc">Find answers to common questions.</div>
              </div>
              <ArrowRight size={14} className="bc-arrow" />
            </div>

            <div className="bottom-card">
              <div className="bc-icon bc-indigo">
                <Clock size={18} />
              </div>
              <div className="bc-content">
                <div className="bc-title">Service Level Agreement</div>
                <div className="bc-desc">Your support commitment.</div>
              </div>
              <ArrowRight size={14} className="bc-arrow" />
            </div>

            <div className="bottom-card">
              <div className="bc-icon bc-teal">
                <Headset size={18} />
              </div>
              <div className="bc-content">
                <div className="bc-title">Need More Help?</div>
                <div className="bc-desc">Contact our support team.</div>
              </div>
              <ArrowRight size={14} className="bc-arrow" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
