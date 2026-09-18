import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Send, Paperclip, CheckCircle, Clock, User, Tag, AlertTriangle, XCircle, Shield } from 'lucide-react';
import { api } from '../../services/api';

const mockTicketDetails = {
  'TKT-2026-0012': {
    ticketId: 'TKT-2026-0012', subject: 'Unable to login to my account', category: 'Account & Login',
    priority: 'High', status: 'In Progress', createdAt: '16 Sep 2026, 10:20 AM', updatedAt: '16 Sep 2026, 11:42 AM',
    assignedTo: 'Support Team', description: 'I have been trying to login to my account since morning but it keeps saying invalid credentials. I have reset my password twice but the issue persists.',
    user: { name: 'Jyothi Kumari', email: 'jyothi@example.com', id: 'Customer ID: 12345', phone: '+91 98765 43210', tickets: 9 },
    comments: [
      { id: 1, author: 'Jyothi Kumari', role: 'user', text: 'I have been trying to login to my account since morning but it keeps saying invalid credentials. I have reset my password twice but the issue persists.', time: '16 Sep 2026, 10:22 AM' },
      { id: 2, author: 'Admin', role: 'admin', text: "Thank you for reaching out! We're looking into the login issue. Could you please confirm your registered email address and the browser you're using?", time: '16 Sep 2026, 10:45 AM' },
      { id: 3, author: 'Jyothi Kumari', role: 'user', text: 'Sure! My email is jyothi@example.com and I am using Chrome on Windows 11. I also tried on Firefox but the same issue occurs.', time: '16 Sep 2026, 11:10 AM' },
      { id: 4, author: 'Admin', role: 'admin', text: "Thank you! We've identified an issue with your account. Our team has now assigned it to the authentication specialist. We'll resolve it within the next 2 hours.", time: '16 Sep 2026, 11:42 AM' },
    ],
    timeline: [
      { label: 'Ticket Submitted', time: '16 Sep 2026, 10:20 AM', done: true },
      { label: 'Viewed by Team', time: '16 Sep 2026, 10:35 AM', done: true },
      { label: 'In Progress', time: '16 Sep 2026, 10:45 AM', done: true, active: true },
      { label: 'Resolved', time: 'Pending', done: false },
      { label: 'Closed', time: 'Pending', done: false },
    ],
  }
};

const UserTicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, currentUser, addComment, handleDeletionResponse, showToast } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [isResponding, setIsResponding] = useState(false);

  const liveTicket = tickets.find(t => t.ticketId === id);
  const fallback = mockTicketDetails[id] || Object.values(mockTicketDetails)[0];
  const ticket = liveTicket ? { ...fallback, ...liveTicket } : fallback;

  // Fetch deletion request status for this ticket
  useEffect(() => {
    if (!ticket?.ticketId) return;
    let isMounted = true;
    const fetchDeletionStatus = async () => {
      try {
        const res = await api.getDeletionStatus(ticket.ticketId);
        if (isMounted && res?.data) {
          setDeletionStatus(res.data);
        } else if (isMounted) {
          setDeletionStatus(null);
        }
      } catch (err) {
        console.warn('Error fetching deletion status:', err.message);
      }
    };
    fetchDeletionStatus();
    return () => { isMounted = false; };
  }, [ticket?.ticketId]);

  const handleConsent = async (approved) => {
    try {
      setIsResponding(true);
      await handleDeletionResponse(ticket.ticketId, approved);
      // Refresh deletion status
      const res = await api.getDeletionStatus(ticket.ticketId);
      if (res?.data) {
        setDeletionStatus(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit response', 'error');
    } finally {
      setIsResponding(false);
    }
  };

  const getPriorityBadge = (p) => ({
    'High': 'badge badge-high',
    'Critical': 'badge badge-critical',
    'Medium': 'badge badge-medium',
    'Low': 'badge badge-low',
  })[p] || 'badge badge-low';

  const getStatusBadge = (s) => ({
    'In Progress': 'badge badge-in-progress',
    'Open': 'badge badge-open',
    'Waiting for User': 'badge badge-waiting',
    'Resolved': 'badge badge-resolved',
    'Closed': 'badge badge-closed',
  })[s] || 'badge badge-closed';

  const timeline = ticket.timeline || [
    { label: 'Ticket Submitted', time: ticket.createdAt, done: true },
    { label: 'Viewed by Team', time: ticket.createdAt, done: true },
    { label: ticket.status || 'In Progress', time: ticket.updatedAt, done: true, active: true },
    { label: 'Resolved', time: 'Pending', done: false },
    { label: 'Closed', time: 'Pending', done: false },
  ];

  const comments = ticket.comments || liveTicket?.comments || [];

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await addComment?.(ticket.ticketId, {
        author: currentUser?.name || 'You',
        role: 'user',
        text: newMessage,
        time: new Date().toLocaleString(),
      });
      setNewMessage('');
    } catch {
      setNewMessage('');
    }
  };

  const isPending = deletionStatus?.status === 'pending';
  const isApproved = deletionStatus?.status === 'approved';
  const isRejected = deletionStatus?.status === 'rejected';

  return (
    <div>
      {/* Header */}
      <div className="ticket-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to My Tickets
        </button>
        <span className="ticket-detail-id">{ticket.ticketId}</span>
        <span className={getPriorityBadge(ticket.priority)}>{ticket.priority}</span>
        <span className={getStatusBadge(ticket.status)}>{ticket.status}</span>
      </div>

      {/* ── SECURITY ENFORCEMENT: Customer Deletion Consent Banner ── */}
      {isPending && (
        <div className="deletion-consent-card" style={{
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
          border: '2px solid #F87171',
          borderRadius: '10px',
          padding: '18px 20px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', background: '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <AlertTriangle size={22} color="#DC2626" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#991B1B' }}>
                  Action Required: Administrator Requested Ticket Deletion
                </h4>
                <span style={{
                  background: '#EF4444', color: '#fff', fontSize: '11px', fontWeight: 600,
                  padding: '3px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  Your Approval Required
                </span>
              </div>
              <p style={{ margin: '8px 0 14px', fontSize: '13px', color: '#7F1D1D', lineHeight: 1.5 }}>
                Administrator <strong>"{deletionStatus.adminName || 'Support Admin'}"</strong> has requested permission to permanently delete your ticket (<strong>{ticket.ticketId}</strong>). 
                Under ResolveDesk security policy, <strong>your ticket remains completely unchanged and cannot be deleted unless you grant permission</strong>.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleConsent(true)}
                  disabled={isResponding}
                  style={{
                    backgroundColor: '#DC2626', borderColor: '#DC2626', color: '#fff',
                    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, padding: '8px 16px',
                    borderRadius: '6px'
                  }}
                >
                  <CheckCircle size={15} />
                  {isResponding ? 'Submitting...' : 'Approve Deletion'}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleConsent(false)}
                  disabled={isResponding}
                  style={{
                    backgroundColor: '#fff', borderColor: '#D1D5DB', color: '#374151',
                    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, padding: '8px 16px',
                    borderRadius: '6px'
                  }}
                >
                  <XCircle size={15} />
                  {isResponding ? 'Submitting...' : 'Reject Deletion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isApproved && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle size={20} color="#059669" />
          <div>
            <strong style={{ color: '#065F46', fontSize: '13px' }}>You Approved Ticket Deletion</strong>
            <p style={{ color: '#047857', fontSize: '12px', margin: '2px 0 0' }}>
              You granted permission for permanent deletion on {new Date(deletionStatus.respondedAt).toLocaleString()}. The administrator is authorized to permanently remove this ticket.
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div style={{
          backgroundColor: '#F1F5F9',
          border: '1px solid #CBD5E1',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Shield size={20} color="#475569" />
          <div>
            <strong style={{ color: '#1E293B', fontSize: '13px' }}>Deletion Request Rejected</strong>
            <p style={{ color: '#475569', fontSize: '12px', margin: '2px 0 0' }}>
              You rejected the administrator's deletion request. Your ticket remains active, preserved, and protected against deletion.
            </p>
          </div>
        </div>
      )}

      <div className="ticket-detail-layout">
        {/* Timeline Panel */}
        <div className="timeline-panel">
          <div className="timeline-panel-title">Ticket Timeline</div>
          {timeline.map((step, i) => (
            <div key={i} className="timeline-step">
              <div className={`timeline-dot ${step.done && !step.active ? 't-dot-done' : step.active ? 't-dot-active' : 't-dot-pending'}`}>
                {step.done && !step.active ? <CheckCircle size={12} /> : step.active ? '●' : '○'}
              </div>
              <div>
                <div className="timeline-step-label">{step.label}</div>
                <div className="timeline-step-time">{step.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Conversation Panel */}
        <div className="convo-panel">
          <div className="convo-header">
            <div className="convo-title">Conversation</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{ticket.subject}</div>
          </div>

          <div className="convo-messages">
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#9CA3AF', padding: '30px', fontSize: '13px' }}>
                No messages yet. Start the conversation below.
              </div>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="msg-bubble">
                  <div className={`msg-avatar ${c.role === 'user' ? 'msg-avatar-user' : 'msg-avatar-admin'}`}>
                    {c.author?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div className="msg-content-wrap">
                    <div className="msg-sender">
                      {c.author}
                      <span className="msg-time">{c.time}</span>
                    </div>
                    <div className="msg-text">{c.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="convo-input-area">
            <button className="btn btn-icon btn-secondary btn-sm" title="Attach file">
              <Paperclip size={14} />
            </button>
            <textarea
              className="convo-textarea"
              placeholder="Type your reply..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <button className="send-btn" onClick={handleSend}>
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Customer Info Panel */}
        <div className="customer-panel">
          <div className="customer-panel-title">Customer Info</div>
          <div className="customer-info-row">
            <div className="customer-info-item">
              <span className="ci-label">Name</span>
              <span className="ci-value">{ticket.user?.name || currentUser?.name || 'Jyothi Kumari'}</span>
            </div>
            <div className="customer-info-item">
              <span className="ci-label">Email</span>
              <span className="ci-value" style={{ fontSize: '12px' }}>{ticket.user?.email || currentUser?.email || 'jyothi@example.com'}</span>
            </div>
            <div className="customer-info-item">
              <span className="ci-label">Customer ID</span>
              <span className="ci-value">{ticket.user?.id || 'Customer ID: 12345'}</span>
            </div>
            <div className="customer-info-item">
              <span className="ci-label">Phone</span>
              <span className="ci-value">{ticket.user?.phone || '+91 98765 43210'}</span>
            </div>
            <div className="customer-info-item">
              <span className="ci-label">Total Tickets</span>
              <span className="ci-value">{ticket.user?.tickets || 9}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
            <div className="customer-panel-title" style={{ marginBottom: '12px' }}>Assigned To</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', background: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={15} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{ticket.assignedTo || 'Support Team'}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>Support Agent</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '14px', borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
            <div className="customer-panel-title" style={{ marginBottom: '8px' }}>Ticket Details</div>
            <div className="customer-info-item" style={{ marginBottom: '8px' }}>
              <span className="ci-label">Category</span>
              <span className="badge-category" style={{ marginTop: '4px', display: 'inline-block' }}>{ticket.category}</span>
            </div>
            <div className="customer-info-item" style={{ marginBottom: '8px' }}>
              <span className="ci-label">Priority</span>
              <span className={`${getPriorityBadge(ticket.priority)}`} style={{ marginTop: '4px', display: 'inline-block' }}>{ticket.priority}</span>
            </div>
            <div className="customer-info-item">
              <span className="ci-label">Created</span>
              <span className="ci-value" style={{ fontSize: '12px' }}>{ticket.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetail;
