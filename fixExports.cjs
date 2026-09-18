const fs = require('fs');
let content = fs.readFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AuditLogs.jsx', 'utf8');

// 1. Add export handlers after the useState line
const oldConst = `const AuditLogs = () => {
  const { tickets } = useApp();
  const [activeTab, setActiveTab] = useState('30d');`;

const newConst = `const AuditLogs = () => {
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
  };`;

content = content.replace(oldConst, newConst);

// 2. Wire up handlers to buttons
const oldButtons = `          <button className="btn btn-secondary"><Download size={14} /> Export PDF</button>
          <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>`;
const newButtons = `          <button className="btn btn-secondary" onClick={handleExportPDF} style={{ display:'flex', alignItems:'center', gap:'6px' }}><Download size={14} /> Export PDF</button>
          <button className="btn btn-secondary" onClick={handleExportCSV} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#4F46E5', color:'white', border:'1px solid #4338CA' }}><Download size={14} /> Export CSV</button>`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync('c:/Users/smile/OneDrive/Desktop/ticket project/frontend/pages/Admin/AuditLogs.jsx', content);
console.log('Export buttons wired up');
