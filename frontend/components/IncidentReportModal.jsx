import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle, AlertCircle, Clock, Building, User, Mail, Phone, Calendar } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

export const IncidentReportModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="incident-report-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header report-no-print">
          <div className="modal-title-box">
            <ShieldCheck size={22} className="modal-icon-accent" />
            <div>
              <h3 className="modal-title">Incident Audit & Resolution Report</h3>
              <p className="modal-subtitle">Official compliance summary for {ticket.ticketId}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button className="icon-btn-ghost" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="printable-report-body" id="incidentReportPrintArea">
          {/* Company & Document Header */}
          <div className="report-doc-header">
            <div className="report-brand">
              <div className="report-logo-badge">RD</div>
              <div>
                <h2>ResolveDesk Systems</h2>
                <p>Enterprise Incident Management & SLA Compliance</p>
              </div>
            </div>
            <div className="report-meta-header">
              <div className="report-id-box">
                <span className="label">DOCUMENT REF:</span>
                <span className="value">{ticket.ticketId}</span>
              </div>
              <div className="report-date-box">
                <span className="label">GENERATED ON:</span>
                <span className="value">{new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>
          </div>

          <hr className="report-divider" />

          {/* Ticket High-Level Summary Grid */}
          <div className="report-grid-3">
            <div className="report-box">
              <span className="report-label">INCIDENT STATUS</span>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <div className="report-box">
              <span className="report-label">SEVERITY PRIORITY</span>
              <div style={{ marginTop: '4px' }}>
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>
            <div className="report-box">
              <span className="report-label">CATEGORY</span>
              <p className="report-val-text">{ticket.category}</p>
            </div>
          </div>

          {/* Customer & Assignment Information */}
          <div className="report-section">
            <h4 className="report-section-title">1. Stakeholder Information</h4>
            <div className="report-stakeholders-grid">
              <div className="stakeholder-card">
                <h5><User size={14} /> Requester Profile</h5>
                <p><strong>Name:</strong> {ticket.userName}</p>
                <p><strong>Email:</strong> {ticket.userEmail}</p>
                <p><strong>Phone:</strong> {ticket.userPhone || 'N/A'}</p>
                <p><strong>User ID:</strong> {ticket.userId}</p>
              </div>
              <div className="stakeholder-card">
                <h5><Building size={14} /> Assigned Resolution Unit</h5>
                <p><strong>Assigned Group:</strong> {ticket.assignedTo || 'Unassigned'}</p>
                <p><strong>Resolution SLA:</strong> {ticket.priority === 'Critical' ? '2 Hours' : ticket.priority === 'High' ? '6 Hours' : '24 Hours'}</p>
                <p><strong>Current State:</strong> {ticket.status}</p>
              </div>
            </div>
          </div>

          {/* Incident Description */}
          <div className="report-section">
            <h4 className="report-section-title">2. Incident Statement & Context</h4>
            <div className="report-description-box">
              <p className="report-subject"><strong>Subject:</strong> {ticket.subject}</p>
              <p className="report-desc-text">{ticket.description}</p>
            </div>
          </div>

          {/* Resolution Timeline */}
          <div className="report-section">
            <h4 className="report-section-title">3. Audit Lifecycle & Timeline</h4>
            <div className="report-timeline-table">
              <table>
                <thead>
                  <tr>
                    <th>Milestone</th>
                    <th>Status</th>
                    <th>Recorded Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.timeline?.map((step, idx) => (
                    <tr key={idx}>
                      <td><strong>{step.step}</strong></td>
                      <td>
                        <span className={`status-pill ${step.completed ? 'completed' : 'pending'}`}>
                          {step.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td>{step.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Public Exchange History */}
          {ticket.comments && ticket.comments.length > 0 && (
            <div className="report-section">
              <h4 className="report-section-title">4. Recorded Communications ({ticket.comments.length})</h4>
              <div className="report-comments-list">
                {ticket.comments.map((comm, idx) => (
                  <div key={idx} className="report-comment-item">
                    <div className="report-comm-header">
                      <strong>{comm.sender} ({comm.role === 'admin' ? 'Support Staff' : 'Customer'})</strong>
                      <span>{comm.timestamp}</span>
                    </div>
                    <p>{comm.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Footer & Sign-off */}
          <div className="report-compliance-footer">
            <div className="compliance-stamp">
              <ShieldCheck size={28} />
              <div>
                <h5>VERIFIED DIGITAL COMPLIANCE</h5>
                <p>Recorded in ResolveDesk Immutable Audit Store under ISO/IEC 27001 & GDPR standards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer report-no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print Official Document
          </button>
        </div>
      </div>
    </div>
  );
};
