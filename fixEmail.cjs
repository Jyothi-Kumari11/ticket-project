const fs = require('fs');
let content = fs.readFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AdminTicketDetail.jsx', 'utf8');

// Replace the Email row to allow wrapping
const oldEmailRow = `<span className="td-cust-detail-val" style={{ color: '#0F172A', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ticket.userEmail}</span>`;
const newEmailRow = `<span className="td-cust-detail-val" style={{ color: '#0F172A', fontWeight: '600', wordBreak: 'break-all', lineHeight: '1.4' }}>{ticket.userEmail}</span>`;

content = content.replace(oldEmailRow, newEmailRow);

// Also change the align-items on the grid rows to flex-start so icons align properly if wrapping occurs
const oldGrid = `gridTemplateColumns: '24px 90px 1fr', alignItems: 'center'`;
const newGrid = `gridTemplateColumns: '24px 90px 1fr', alignItems: 'flex-start'`;
content = content.split(oldGrid).join(newGrid);

fs.writeFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AdminTicketDetail.jsx', content);
console.log('Fixed email truncation');
