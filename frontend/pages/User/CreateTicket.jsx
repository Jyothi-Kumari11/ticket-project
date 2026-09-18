import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X, Upload, Send, ArrowLeft, RotateCcw,
  Bold, Italic, Underline, List, ListOrdered, Link2, Image, Smile,
  Lightbulb, BookOpen, Clock
} from 'lucide-react';
import AIChat from '../../components/AIChat';

// ── Main CreateTicket Component ────────────────────────────────────────────
const CreateTicket = () => {
  const { createTicket, showToast, currentUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    priority: 'Medium',
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    'Technical Issue',
    'Account & Login',
    'Payment & Billing',
    'Network',
    'Service Issue',
    'Feature Request',
    'Other',
  ];

  const priorities = [
    { id: 'Low',      label: 'Low',      color: '#22c55e', desc: 'Non-urgent, informational' },
    { id: 'Medium',   label: 'Medium',   color: '#f59e0b', desc: 'Moderate impact' },
    { id: 'High',     label: 'High',     color: '#f97316', desc: 'Affects important work' },
    { id: 'Critical', label: 'Critical', color: '#a855f7', desc: 'Severe, needs instant fix' },
  ];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (files) => {
    const newFiles = Array.from(files).map(f => ({ name: f.name, size: f.size, file: f }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleReset = () => {
    setFormData({ subject: '', category: '', description: '', priority: 'Medium' });
    setAttachments([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.category || !formData.description.trim()) {
      showToast?.('Please fill in all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await createTicket?.({ ...formData, attachments: attachments.map(a => a.name) });
      showToast?.('Ticket submitted successfully!', 'success');
      navigate('/app/user/tickets');
    } catch {
      showToast?.('Failed to submit ticket. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ct-page">
      {/* Page Header */}
      <div className="ct-header">
        <button className="ct-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="ct-title">Create a New Ticket</h1>
          <p className="ct-subtitle">Tell us what problem you're experiencing and we'll help resolve it.</p>
        </div>
      </div>

      <div className="ct-body">
        {/* ── Left: Form ── */}
        <form className="ct-form-card" onSubmit={handleSubmit}>

          {/* Subject + Category row */}
          <div className="ct-row-2">
            <div className="ct-field">
              <label className="ct-label">
                <span className="ct-label-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </span>
                Subject <span className="ct-required">*</span>
              </label>
              <input
                className="ct-input"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Briefly describe your issue..."
                maxLength={100}
                required
              />
              <span className="ct-char-count">{formData.subject.length}/100</span>
            </div>

            <div className="ct-field">
              <label className="ct-label">
                <span className="ct-label-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </span>
                Category <span className="ct-required">*</span>
              </label>
              <select
                className="ct-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="ct-field">
            <label className="ct-label">
              <span className="ct-label-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              Description <span className="ct-required">*</span>
            </label>
            {/* Mini toolbar */}
            <div className="ct-toolbar">
              {[Bold, Italic, Underline].map((Icon, i) => (
                <button key={i} type="button" className="ct-tool-btn"><Icon size={13} /></button>
              ))}
              <div className="ct-toolbar-sep" />
              {[ListOrdered, List].map((Icon, i) => (
                <button key={i} type="button" className="ct-tool-btn"><Icon size={13} /></button>
              ))}
              <div className="ct-toolbar-sep" />
              {[Link2, Image, Smile].map((Icon, i) => (
                <button key={i} type="button" className="ct-tool-btn"><Icon size={13} /></button>
              ))}
            </div>
            <textarea
              className="ct-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain your problem in detail..."
              rows={6}
              maxLength={2000}
              required
            />
            <span className="ct-char-count">{formData.description.length}/2000</span>
          </div>

          {/* Priority */}
          <div className="ct-field">
            <label className="ct-label">
              <span className="ct-label-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </span>
              Priority <span className="ct-required">*</span>
            </label>
            <div className="ct-priority-grid">
              {priorities.map(p => (
                <div
                  key={p.id}
                  className={`ct-priority-card ${formData.priority === p.id ? 'ct-priority-selected' : ''}`}
                  style={formData.priority === p.id ? { borderColor: p.color, background: `${p.color}10` } : {}}
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.id }))}
                >
                  {formData.priority === p.id && (
                    <span className="ct-priority-badge" style={{ background: p.color }}>Recommended</span>
                  )}
                  <span className="ct-priority-dot" style={{ background: p.color }} />
                  <span className="ct-priority-name">{p.label}</span>
                  <span className="ct-priority-desc">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="ct-field">
            <label className="ct-label">
              <span className="ct-label-icon"><Upload size={14} /></span>
              Attachments <span className="ct-optional">(Optional)</span>
            </label>
            <p className="ct-attach-hint">Add screenshots or files to help us understand the issue better.</p>
            <div
              className={`ct-drop-zone ${dragOver ? 'ct-drop-zone-active' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('ct-file-input').click()}
            >
              <div className="ct-drop-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
              </div>
              <p className="ct-drop-text">Drag and drop files here, or <span>click to browse</span></p>
              <p className="ct-drop-hint">Supports: JPG, PNG, PDF, DOC, DOCX (Max 10MB)</p>
              <input id="ct-file-input" type="file" multiple style={{ display: 'none' }} onChange={e => handleFileChange(e.target.files)} />
            </div>

            {attachments.length > 0 && (
              <div className="ct-attachments-list">
                {attachments.map((a, i) => (
                  <div key={i} className="ct-attach-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>{a.name}</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ct-form-actions">
            <button type="button" className="ct-reset-btn" onClick={handleReset}>
              <RotateCcw size={14} /> Reset
            </button>
            <button type="submit" className="ct-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="ct-spinner" />
              ) : (
                <><Send size={15} /> Submit Ticket</>
              )}
            </button>
          </div>

          {/* Footer tips */}
          <div className="ct-footer-tips">
            <div className="ct-tip">
              <Lightbulb size={14} />
              <span><strong>Quick Tips:</strong> Be specific and provide as much detail as possible.</span>
            </div>
            <div className="ct-tip">
              <BookOpen size={14} />
              <span><strong>Need Help?</strong> Check our help center for common issues.</span>
            </div>
            <div className="ct-tip">
              <Clock size={14} />
              <span><strong>Service Level Agreement:</strong> We aim to respond within 24 hours.</span>
            </div>
          </div>
        </form>

        {/* ── Right: AI Chat ── */}
        <AIChat userName={currentUser?.name} />
      </div>
    </div>
  );
};

export default CreateTicket;
