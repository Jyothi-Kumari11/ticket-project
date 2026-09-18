import React from 'react';

const StatusBadge = ({ status }) => {
  const getVariant = (st) => {
    switch (st?.toLowerCase()) {
      case 'open':
        return { class: 'badge-open', label: 'Open' };
      case 'in progress':
        return { class: 'badge-progress', label: 'In Progress' };
      case 'waiting for user':
        return { class: 'badge-waiting', label: 'Waiting for User' };
      case 'resolved':
        return { class: 'badge-resolved', label: 'Resolved' };
      case 'closed':
        return { class: 'badge-closed', label: 'Closed' };
      default:
        return { class: 'badge-open', label: st || 'Open' };
    }
  };

  const variant = getVariant(status);

  return (
    <span className={`badge ${variant.class}`}>
      <span className="badge-dot"></span>
      {variant.label}
    </span>
  );
};

export { StatusBadge };
export default StatusBadge;
