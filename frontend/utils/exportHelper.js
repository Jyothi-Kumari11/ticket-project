// Export Helper for CSV & JSON downloads

export const exportTicketsToCSV = (tickets, filename = 'resolvedesk_tickets.csv') => {
  if (!tickets || tickets.length === 0) return;

  const headers = [
    'Ticket ID',
    'Subject',
    'Customer Name',
    'Customer Email',
    'Category',
    'Priority',
    'Status',
    'Assigned To',
    'Created At',
    'Updated At',
    'Resolved At'
  ];

  const rows = tickets.map(t => [
    `"${t.ticketId || ''}"`,
    `"${(t.subject || '').replace(/"/g, '""')}"`,
    `"${(t.userName || '').replace(/"/g, '""')}"`,
    `"${t.userEmail || ''}"`,
    `"${t.category || ''}"`,
    `"${t.priority || ''}"`,
    `"${t.status || ''}"`,
    `"${t.assignedTo || ''}"`,
    `"${t.createdAt || ''}"`,
    `"${t.updatedAt || ''}"`,
    `"${t.resolvedAt || 'N/A'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const exportAuditLogsToCSV = (logs, filename = 'resolvedesk_audit_logs.csv') => {
  if (!logs || logs.length === 0) return;

  const headers = ['Log ID', 'Actor', 'Role', 'Action', 'Ticket ID', 'Timestamp'];
  const rows = logs.map(l => [
    `"${l.id || ''}"`,
    `"${(l.actor || '').replace(/"/g, '""')}"`,
    `"${l.role || ''}"`,
    `"${(l.action || '').replace(/"/g, '""')}"`,
    `"${l.ticketId || 'N/A'}"`,
    `"${l.timestamp || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

export const exportUsersToCSV = (users, filename = 'resolvedesk_users.csv') => {
  if (!users || users.length === 0) return;

  const headers = ['Name', 'Email', 'Role', 'Status', 'Tickets', 'Created At'];
  const rows = users.map(u => [
    `"${(u.name || '').replace(/"/g, '""')}"`,
    `"${(u.email || '').replace(/"/g, '""')}"`,
    `"${u.role || ''}"`,
    `"${u.status || ''}"`,
    `"${u.tickets ?? 0}"`,
    `"${u.createdAt || ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
