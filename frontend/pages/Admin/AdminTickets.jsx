import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { exportTicketsToCSV } from '../../utils/exportHelper';
import { Search, Plus, MoreVertical, Download, Filter, Calendar, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';

const TicketIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const UserIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ITEMS_PER_PAGE = 5;

const mockAll = [
  { ticketId: 'TKT-2026-0018', userEmail: 'alex.johnson@example.com', avatar: 'A', avatarBg: '#EDE9FE', avatarColor: '#8B5CF6', subject: 'Unable to login to my account', category: 'Account & Login', priority: 'High', status: 'In Progress', assignedTo: 'Support Team', createdAt: '2026-09-16T10:20:00Z' },
  { ticketId: 'TKT-2026-0016', userEmail: 'sarah.c@example.com', avatar: 'S', avatarBg: '#E0E7FF', avatarColor: '#4F46E5', subject: 'API Gateway latency spike in EU region', category: 'Technical Issue', priority: 'High', status: 'Open', assignedTo: 'Unassigned', createdAt: '2026-09-16T08:00:00Z' },
  { ticketId: 'TKT-2026-0017', userEmail: 'alex.johnson@example.com', avatar: 'A', avatarBg: '#EDE9FE', avatarColor: '#8B5CF6', subject: 'Payment failed but amount deducted', category: 'Payment & Billing', priority: 'Critical', status: 'Resolved', assignedTo: 'Finance Ops', createdAt: '2026-09-15T14:15:00Z' },
  { ticketId: 'TKT-2026-0005', userEmail: 'd.miller@example.com', avatar: 'D', avatarBg: '#E0E7FF', avatarColor: '#4F46E5', subject: 'Request for custom SSL certificate installation', category: 'Service Issue', priority: 'Medium', status: 'Waiting for User', assignedTo: 'DevOps Team', createdAt: '2026-09-14T09:30:00Z' },
  { ticketId: 'TKT-2026-0014', userEmail: 'alex.johnson@example.com', avatar: 'A', avatarBg: '#EDE9FE', avatarColor: '#8B5CF6', subject: 'Dashboard reports loading slowly', category: 'Technical Issue', priority: 'Low', status: 'Closed', assignedTo: 'Frontend Tech', createdAt: '2026-09-10T11:00:00Z' },
];

const StatCard = ({ title, value, icon, bg, iconBg, iconColor, trend, trendVal, trendColor }) => (
  <div style={{ background: bg, borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: '500', color: '#475569', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: trendColor, fontSize: '11px', fontWeight: '600', alignSelf: 'flex-end', paddingBottom: '2px' }}>
      {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {trendVal}
    </div>
  </div>
);

const AdminTickets = () => {
  const { tickets } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [page, setPage] = useState(1);

  const sourceTickets = tickets && tickets.length > 0 ? tickets : mockAll;
  const filtered = sourceTickets.filter(t => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || t.ticketId?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q) || t.userEmail?.toLowerCase().includes(q) || (t.userName || '').toLowerCase().includes(q);
    const matchCat = filterCategory === 'All' || t.category === filterCategory;
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchPri = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchCat && matchStatus && matchPri;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const exportData = filtered.map(t => ({
      ...t,
      userName: t.userName || (t.userEmail ? t.userEmail.split('@')[0] : 'Customer'),
      assignedTo: t.assignedTo || 'Unassigned',
      resolvedAt: t.resolvedAt || 'N/A'
    }));

    exportTicketsToCSV(exportData, 'all_tickets_export.csv');
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Critical': return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <AlertCircle size={12}/> };
      case 'High': return { color: '#EA580C', bg: '#FFF7ED', border: '#FDBA74', icon: <UserIcon size={12}/> }; // UserIcon just as a placeholder for the triangle/person in the mockup
      case 'Medium': return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <div style={{width: 10, height: 2, background: 'currentColor'}}/> };
      case 'Low': return { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: <TrendingDown size={12}/> };
      default: return { color: '#4B5563', bg: '#F3F4F6', border: '#D1D5DB' };
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Open': return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: <AlertCircle size={12}/> };
      case 'In Progress': return { color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', icon: <Clock size={12}/> };
      case 'Waiting for User': return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: <Clock size={12}/> };
      case 'Resolved': return { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: <CheckCircle2 size={12}/> };
      case 'Closed': return { color: '#4B5563', bg: '#F3F4F6', border: '#D1D5DB', icon: <CheckCircle2 size={12}/> };
      default: return { color: '#4B5563', bg: '#F3F4F6', border: '#D1D5DB' };
    }
  };

  const getCategoryBadge = (c) => {
    switch (c) {
      case 'Account & Login': return { color: '#2563EB', bg: '#EFF6FF' };
      case 'Technical Issue': return { color: '#8B5CF6', bg: '#F5F3FF' };
      case 'Payment & Billing': return { color: '#059669', bg: '#ECFDF5' };
      case 'Service Issue': return { color: '#2563EB', bg: '#EFF6FF' };
      default: return { color: '#4B5563', bg: '#F3F4F6' };
    }
  };

  return (
    <div className="admin-tickets-layout">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div className="page-header-left">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#EEF2FF', color: '#4F46E5', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TicketIcon size={18} />
            </div>
            All Tickets
          </h1>
          <p style={{ marginLeft: '40px' }}>Manage, assign, and resolve all customer support requests.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ borderRadius: '8px', fontWeight: '600' }} onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" style={{ borderRadius: '8px', fontWeight: '600' }}>
            <Plus size={16} /> New Ticket
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard title="Total Tickets" value="5" icon={<TicketIcon size={20} />} bg="#F0F9FF" iconBg="#E0F2FE" iconColor="#0284C7" trend="up" trendVal="+12%" trendColor="#16A34A" />
        <StatCard title="Open" value="2" icon={<div style={{position: 'relative'}}><div style={{position: 'absolute', top: 2, right: 0, width: 6, height: 6, background: '#16A34A', borderRadius: '50%'}}/><Clock size={20} /></div>} bg="#F0FDF4" iconBg="#DCFCE7" iconColor="#16A34A" trend="up" trendVal="40%" trendColor="#16A34A" />
        <StatCard title="In Progress" value="1" icon={<Clock size={20} />} bg="#FFFbeb" iconBg="#FEF3C7" iconColor="#D97706" trend="down" trendVal="20%" trendColor="#D97706" />
        <StatCard title="Resolved" value="2" icon={<CheckCircle2 size={20} />} bg="#FAF5FF" iconBg="#F3E8FF" iconColor="#9333EA" trend="up" trendVal="40%" trendColor="#9333EA" />
        <StatCard title="Critical" value="1" icon={<AlertCircle size={20} />} bg="#FEF2F2" iconBg="#FEE2E2" iconColor="#DC2626" trend="down" trendVal="20%" trendColor="#DC2626" />
      </div>

      <div className="table-card">
        <div className="filters-bar" style={{ padding: '16px 20px' }}>
          <div className="filter-search" style={{ borderRadius: '8px' }}>
            <Search size={16} color="#9CA3AF" />
            <input
              placeholder="Search by ID, subject, or customer..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-select">
            <select style={{ borderRadius: '8px' }} value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
              <option value="All">All Categories</option>
            </select>
          </div>

          <div className="filter-select">
            <select style={{ borderRadius: '8px' }} value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1); }}>
              <option value="All">All Priorities</option>
            </select>
          </div>

          <div className="filter-select">
            <select style={{ borderRadius: '8px' }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="All">All Statuses</option>
            </select>
          </div>

          <div className="filter-select">
            <Calendar size={14} color="#6B7280" />
            <select style={{ borderRadius: '8px' }} defaultValue="30">
              <option value="30">Last 30 days</option>
            </select>
          </div>

          <div className="filter-actions-right" style={{ marginLeft: 'auto' }}>
            <button className="btn btn-secondary btn-sm" style={{ width: '36px', height: '36px', borderRadius: '8px' }}><Filter size={16} /></button>
          </div>
        </div>

        <table className="ds-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}><input type="checkbox" style={{ cursor: 'pointer', accentColor: '#4F46E5' }} /></th>
              <th>TICKET ID <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>CUSTOMER <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>SUBJECT <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>CATEGORY <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>PRIORITY <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>STATUS <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>ASSIGNED TO <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>CREATED <MoreVertical size={12} style={{ display: 'inline', opacity: 0.5, verticalAlign: 'middle', marginLeft: '4px' }}/></th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t, idx) => {
              const pri = getPriorityBadge(t.priority);
              const stat = getStatusBadge(t.status);
              const cat = getCategoryBadge(t.category);
              
              return (
                <tr key={t.ticketId} style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/admin/ticket/${t.ticketId}`)}>
                  <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}><input type="checkbox" style={{ cursor: 'pointer', accentColor: '#4F46E5' }} /></td>
                  <td>
                    <div className="ticket-id-cell">
                      <div className="ticket-id-icon" style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: '6px' }}><TicketIcon size={14} /></div>
                      <span className="ticket-id-text" style={{ fontSize: '13px', fontWeight: '700' }}>{t.ticketId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-avatar-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="user-avatar-circle" style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.avatarBg, color: t.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>
                        {t.avatar}
                      </div>
                      <span style={{ fontSize: '13px', color: '#475569' }}>{t.userEmail}</span>
                    </div>
                  </td>
                  <td><span className="ticket-subject" style={{ fontWeight: '600', color: '#1E293B' }}>{t.subject}</span></td>
                  <td><span style={{ background: cat.bg, color: cat.color, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{t.category}</span></td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: pri.color, border: `1px solid ${pri.border}`, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'white' }}>
                      {pri.icon} {t.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: stat.color, border: `1px solid ${stat.border}`, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', background: 'white' }}>
                      {stat.icon} {t.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserIcon size={14} style={{ color: '#9CA3AF' }} />
                      <span style={{ fontSize: '13px', color: '#475569' }}>{t.assignedTo}</span>
                    </div>
                  </td>
                  <td><span className="table-date">{t.createdAt}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }} onClick={() => navigate(`/app/admin/ticket/${t.ticketId}`)}>View</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination-bar" style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="pagination-info" style={{ fontSize: '13px', color: '#6B7280' }}>
            Showing 1-5 of 5 tickets
          </span>
          <div className="pagination-controls" style={{ display: 'flex', gap: '4px' }}>
            <button className="page-btn" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', background: 'white', borderRadius: '6px', color: '#9CA3AF' }}><ChevronLeft size={16} /></button>
            <button className="page-btn active" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: '#4F46E5', color: 'white', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>1</button>
            <button className="page-btn" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', background: 'white', borderRadius: '6px', color: '#9CA3AF' }}><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;

