const fs = require('fs');
let content = fs.readFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AdminTicketDetail.jsx', 'utf8');

const oldBtns = `<div className="td-action-btns">
            <button className="td-btn td-btn-primary" onClick={() => setShowReportModal(true)}>
              <Printer size={15} /> Generate Incident Report
            </button>
            {isApproved ? (
              <button className="td-btn td-btn-danger" onClick={() => setShowPermanentDeleteModal(true)}>
                <Trash2 size={15} /> Permanently Delete
              </button>
            ) : isPending ? (
              <button className="td-btn td-btn-outline" disabled>
                <Clock size={15} /> Deletion Pending
              </button>
            ) : (
              <button className="td-btn td-btn-outline" onClick={() => setShowDeleteRequestModal(true)}>
                <Trash2 size={15} /> Delete Ticket
              </button>
            )}
          </div>`;

const newBtns = `<div className="td-action-btns" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="td-btn td-btn-primary" 
              onClick={() => setShowReportModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#3B82F6', color: 'white', border: '1px solid #2563EB', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <Printer size={16} /> Generate Incident Report
            </button>
            {isApproved ? (
              <button 
                className="td-btn td-btn-danger" 
                onClick={() => setShowPermanentDeleteModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#EF4444', color: 'white', border: '1px solid #DC2626', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <Trash2 size={16} /> Permanently Delete
              </button>
            ) : isPending ? (
              <button 
                className="td-btn td-btn-outline" 
                disabled
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'not-allowed' }}
              >
                <Clock size={16} /> Deletion Pending
              </button>
            ) : (
              <button 
                className="td-btn td-btn-outline" 
                onClick={() => setShowDeleteRequestModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'white', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              >
                <Trash2 size={16} color="#475569" /> Delete Ticket
              </button>
            )}
          </div>`;

content = content.replace(oldBtns, newBtns);
fs.writeFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AdminTicketDetail.jsx', content);
console.log('Fixed buttons');
