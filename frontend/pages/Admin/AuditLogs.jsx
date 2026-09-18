import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Download, TrendingUp, TrendingDown, Clock, MoreHorizontal } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';

const AuditLogs = () => {
  const { tickets } = useApp();
  const [activeTab, setActiveTab] = useState('30d');

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Subject', 'Status', 'Priority', 'Category', 'Customer', 'Created At'];
    const rows = tickets.map(t => [
      t.ticketId,
      '"' + (t.subject || '').replace(/"/g, '""') + '"',
      t.status,
      t.priority,
      t.category,
      '"' + (t.userName || t.userEmail || '') + '"',
      t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tickets-report-' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PDF handler (print-to-PDF)
  const handleExportPDF = () => {
    window.print();
  };

  const total = tickets.length || 124;
  const open = tickets.filter(t => t.status === 'Open').length || 9;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length || 84;
  const closed = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length || 31;

  const categoryData = [
    { name: 'Technical Issue', value: 32, color: '#4F46E5' },
    { name: 'Account & Login', value: 28, color: '#3B82F6' },
    { name: 'Payment & Billing', value: 22, color: '#10B981' },
    { name: 'Network', value: 12, color: '#F59E0B' },
    { name: 'Other', value: 30, color: '#6B7280' },
  ];

  const trendData = [
    { date: '01 Sep', tickets: 8 },
    { date: '03 Sep', tickets: 12 },
    { date: '05 Sep', tickets: 9 },
    { date: '07 Sep', tickets: 15 },
    { date: '09 Sep', tickets: 11 },
    { date: '11 Sep', tickets: 18 },
    { date: '13 Sep', tickets: 14 },
    { date: '15 Sep', tickets: 20 },
    { date: '16 Sep', tickets: 17 },
  ];

  const tabs = ['All', '7d', '30d', 'Custom'];

  return (
    <div className="reports-layout">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Reports & Analytics</h1>
          <p>Detailed insights into your support team's performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={handleExportPDF} style={{ display:'flex', alignItems:'center', gap:'6px' }}><Download size={14} /> Export PDF</button>
          <button className="btn btn-secondary" onClick={handleExportCSV} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#4F46E5', color:'white', border:'1px solid #4338CA' }}><Download size={14} /> Export CSV</button>
        </div>
      </div>

      {/* Date Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="report-tabs">
          {tabs.map(t => (
            <button key={t} className={`report-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid-5">
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <button className="kpi-more-btn"><MoreHorizontal size={15} /></button>
          </div>
          <span className="kpi-label">Total</span>
          <span className="kpi-value">{total}</span>
          <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up"/><span className="kpi-trend-up" style={{fontWeight:600}}>8%</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <button className="kpi-more-btn"><MoreHorizontal size={15} /></button>
          </div>
          <span className="kpi-label">Open</span>
          <span className="kpi-value">{open}</span>
          <div className="kpi-trend"><TrendingDown size={12} className="kpi-trend-down"/><span className="kpi-trend-down" style={{fontWeight:600}}>1%</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-indigo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <button className="kpi-more-btn"><MoreHorizontal size={15} /></button>
          </div>
          <span className="kpi-label">In Progress</span>
          <span className="kpi-value">{inProgress}</span>
          <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up"/><span className="kpi-trend-up" style={{fontWeight:600}}>4%</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <button className="kpi-more-btn"><MoreHorizontal size={15} /></button>
          </div>
          <span className="kpi-label">Closed</span>
          <span className="kpi-value">{closed}</span>
          <div className="kpi-trend"><TrendingUp size={12} className="kpi-trend-up"/><span className="kpi-trend-up" style={{fontWeight:600}}>12%</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-icon kpi-icon-purple">
              <Clock size={20} />
            </div>
            <button className="kpi-more-btn"><MoreHorizontal size={15} /></button>
          </div>
          <span className="kpi-label">Avg Resolution</span>
          <span className="kpi-value" style={{ fontSize: '20px' }}>4h 32m</span>
          <div className="kpi-trend"><TrendingDown size={12} className="kpi-trend-up"/><span className="kpi-trend-up" style={{fontWeight:600}}>Improved</span></div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Tickets by Category</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="40%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(v, entry) => (
                  <span style={{ fontSize: 12, color: '#6B7280' }}>
                    {v} ({entry.payload.value})
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-card-title">Tickets Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="tickets" stroke="#4F46E5" strokeWidth={2} fill="url(#colorTickets)" dot={{ fill: '#4F46E5', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
