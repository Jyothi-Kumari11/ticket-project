import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MoreHorizontal, ArrowRight, TrendingUp, TrendingDown,
  Calendar, CheckCircle2, AlertCircle, Clock, User, Plus,
  Search, Send, Sparkles, FileText
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

const TicketIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const Sparkline = ({ color = '#3B82F6', id = '1' }) => (
  <svg width="64" height="28" viewBox="0 0 64 28" fill="none" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id={`grad-adm-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path
      d="M0 20 C 12 16, 20 24, 30 10 C 40 2, 50 8, 64 4 L 64 28 L 0 28 Z"
      fill={`url(#grad-adm-${id})`}
    />
    <path
      d="M0 20 C 12 16, 20 24, 30 10 C 40 2, 50 8, 64 4"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AdminDashboard = () => {
  const { tickets } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [chatInput, setChatInput] = useState('');

  const total = tickets.length || 6;
  const openCount = tickets.filter(t => t.status === 'Open').length || 2;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length || 1;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length || 2;
  const waitingCount = tickets.filter(t => t.status === 'Waiting for User' || t.status === 'Awaiting Reply').length || 1;

  const statusData = [
    { name: 'Open', value: openCount, color: '#3B82F6', percent: '33%' },
    { name: 'In Progress', value: inProgressCount, color: '#8B5CF6', percent: '17%' },
    { name: 'Resolved', value: resolvedCount, color: '#10B981', percent: '33%' },
    { name: 'Waiting', value: waitingCount, color: '#F59E0B', percent: '17%' },
  ];

  const priorityData = [
    { name: 'Low', value: 2, color: '#10B981' },
    { name: 'Medium', value: 3, color: '#F59E0B' },
    { name: 'High', value: 2, color: '#F97316' },
    { name: 'Critical', value: 1, color: '#EF4444' },
  ];



  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', paddingBottom: '30px' }}>
      
      {/* LEFT COLUMN MAIN CONTENT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F5F3FF 100%)',
          borderRadius: '16px',
          border: '1px solid #DBEAFE',
          padding: '24px 28px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'white', color: '#2563EB', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginBottom: '10px' }}>
              ☀️ Good Morning,
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Welcome back, Support Admin!
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 16px 0' }}>
              Here's an overview of your support tickets and system performance.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '6px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', color: '#334155', fontWeight: '500' }}>
                <Calendar size={14} color="#64748B" />
                <span>Sep 17, 2026 - Sep 17, 2026</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ background: 'white', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#334155', fontWeight: '500', outline: 'none', cursor: 'pointer' }}
              >
                <option>All Categories</option>
                <option>Account & Login</option>
                <option>Billing</option>
                <option>Feature Request</option>
              </select>
            </div>
          </div>

          {/* Banner Graphic Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '170px', height: '105px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', borderRadius: '14px', boxShadow: '0 12px 28px -6px rgba(59,130,246,0.35)', padding: '14px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', opacity: 0.9 }}>Performance</div>
                <div style={{ background: 'rgba(255,255,255,0.25)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>+</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1 }}>98.4%</div>
                <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>SLA Target Met</div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '10px 16px', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', fontSize: '12px', fontWeight: '700', color: '#4F46E5', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>Better Support</span>
              <span style={{ color: '#0F172A' }}>Happier Users</span>
            </div>
          </div>
        </div>

        {/* 5 KPI Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          
          {/* Card 1: Total */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#EFF6FF', color: '#3B82F6', padding: '8px', borderRadius: '8px' }}><TicketIcon size={18} color="#3B82F6" /></div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '2px' }}>Total Tickets</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{total}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px', fontWeight: '600', color: '#10B981' }}>
                  <TrendingUp size={12} />
                  <span>8%</span>
                </div>
              </div>
              <Sparkline color="#3B82F6" id="1" />
            </div>
          </div>

          {/* Card 2: Open */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#ECFDF5', color: '#10B981', padding: '8px', borderRadius: '8px' }}><CheckCircle2 size={18} /></div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '2px' }}>Open</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{openCount}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px', fontWeight: '600', color: '#10B981' }}>
                  <TrendingUp size={12} />
                  <span>12%</span>
                </div>
              </div>
              <Sparkline color="#10B981" id="2" />
            </div>
          </div>

          {/* Card 3: In Progress */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#F5F3FF', color: '#8B5CF6', padding: '8px', borderRadius: '8px' }}><Clock size={18} /></div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '2px' }}>In Progress</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{inProgressCount}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px', fontWeight: '600', color: '#EF4444' }}>
                  <TrendingDown size={12} />
                  <span>3%</span>
                </div>
              </div>
              <Sparkline color="#8B5CF6" id="3" />
            </div>
          </div>

          {/* Card 4: Resolved */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#ECFDF5', color: '#10B981', padding: '8px', borderRadius: '8px' }}><CheckCircle2 size={18} /></div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '2px' }}>Resolved</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{resolvedCount}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px', fontWeight: '600', color: '#10B981' }}>
                  <TrendingUp size={12} />
                  <span>25%</span>
                </div>
              </div>
              <Sparkline color="#10B981" id="4" />
            </div>
          </div>

          {/* Card 5: Waiting */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ background: '#FFFBEB', color: '#F59E0B', padding: '8px', borderRadius: '8px' }}><AlertCircle size={18} /></div>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '2px' }}>Waiting</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{waitingCount}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '6px', fontSize: '11px', fontWeight: '600', color: '#EF4444' }}>
                  <TrendingDown size={12} />
                  <span>5%</span>
                </div>
              </div>
              <Sparkline color="#F59E0B" id="5" />
            </div>
          </div>

        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Donut Chart: Tickets by Status */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Tickets by Status</h3>
              <select style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#64748B', outline: 'none' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '160px', height: '160px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} dataKey="value" stroke="none">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{total}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Total Tickets</div>
                </div>
              </div>

              {/* Legend list */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {statusData.map(item => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                      <span style={{ color: '#475569', fontWeight: '500' }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>{item.value}</span>
                      <span style={{ color: '#94A3B8', fontSize: '12px', width: '30px', textAlign: 'right' }}>{item.percent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart: Tickets by Priority */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Tickets by Priority</h3>
              <select style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#64748B', outline: 'none' }}>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#F8FAFC' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: AI ASSISTANT PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* AI Support Assistant Box */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '16px 20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>AI Support Assistant</h4>
                <div style={{ fontSize: '11px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  <span>Online</span>
                </div>
              </div>
            </div>
            <ArrowRight size={16} style={{ opacity: 0.8 }} />
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Assistant Welcome Bubble */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                <div style={{ background: '#4F46E5', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>AI</div>
                Hello, I'm your AI support assistant!
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.5' }}>
                I can help you with:
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                  <li style={{ color: '#10B981' }}>Check ticket status</li>
                  <li style={{ color: '#10B981' }}>Find solutions (articles)</li>
                  <li style={{ color: '#10B981' }}>Create a new ticket</li>
                  <li style={{ color: '#10B981' }}>Answer general questions</li>
                </ul>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '10px' }}>What would you like to do today?</div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button onClick={() => navigate('/app/admin/tickets')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}>
                <Search size={14} color="#4F46E5" /> Check ticket status
              </button>
              <button onClick={() => navigate('/app/admin/tickets')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}>
                <Plus size={14} color="#4F46E5" /> Create a new ticket
              </button>
              <button onClick={() => navigate('/app/admin/audit-logs')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}>
                <FileText size={14} color="#4F46E5" /> View help articles
              </button>
              <button onClick={() => navigate('/app/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: '#F1F5F9', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer', textAlign: 'left' }}>
                <User size={14} color="#4F46E5" /> Talk to human
              </button>
            </div>

            {/* Chat Input */}
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
              />
              <button style={{ position: 'absolute', right: '6px', top: '6px', background: '#4F46E5', color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={14} />
              </button>
            </div>

            {/* Bottom Quick Help Info */}
            <div style={{ background: '#EEF2FF', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Sparkles size={16} color="#4F46E5" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#1E293B' }}>Need quick help?</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Try asking about your issue or use the action buttons above!</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;

