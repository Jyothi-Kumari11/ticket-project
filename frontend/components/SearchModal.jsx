import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Ticket, FileText, ArrowRight, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { tickets, currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(false);
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticketId.toLowerCase().includes(query.toLowerCase()) ||
      t.subject.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  );

  const sampleArticles = [
    { title: 'How to reset your password and manage 2FA', category: 'Account' },
    { title: 'Understanding billing cycles & refund policies', category: 'Billing' },
    { title: 'Troubleshooting SSO authorization timeout (ERR_AUTH_502)', category: 'Technical' },
    { title: 'Connecting webhook integrations and API tokens', category: 'API' }
  ].filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={20} className="search-modal-icon" />
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search tickets by ID, subject, category or knowledge base..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="icon-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="search-modal-results">
          {/* Tickets Section */}
          <div className="search-result-group">
            <span className="search-group-title">
              <Ticket size={14} /> Tickets ({filteredTickets.length})
            </span>
            {filteredTickets.length === 0 ? (
              <p className="search-no-items">No tickets match "{query}"</p>
            ) : (
              filteredTickets.slice(0, 5).map((t) => (
                <div
                  key={t.ticketId}
                  className="search-result-item"
                  onClick={() => {
                    onClose();
                    navigate(
                      currentUser.role === 'admin'
                        ? `/app/admin/ticket/${t.ticketId}`
                        : `/app/user/ticket/${t.ticketId}`
                    );
                  }}
                >
                  <div className="search-ticket-meta">
                    <span className="search-ticket-id">{t.ticketId}</span>
                    <span className="search-ticket-subject">{t.subject}</span>
                  </div>
                  <div className="search-ticket-right">
                    <StatusBadge status={t.status} />
                    <ArrowRight size={14} color="#94A3B8" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Knowledge base */}
          <div className="search-result-group">
            <span className="search-group-title">
              <FileText size={14} /> Knowledge Base ({sampleArticles.length})
            </span>
            {sampleArticles.map((art, idx) => (
              <div
                key={idx}
                className="search-result-item"
                onClick={() => {
                  onClose();
                  navigate('/app/user/knowledge-base');
                }}
              >
                <div className="search-ticket-meta">
                  <span className="kb-tag">{art.category}</span>
                  <span className="search-ticket-subject">{art.title}</span>
                </div>
                <ArrowRight size={14} color="#94A3B8" />
              </div>
            ))}
          </div>
        </div>

        <div className="search-modal-footer">
          <span>Tip: Use <kbd>ESC</kbd> to close</span>
          <span>Switch role anytime via top navigation</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
