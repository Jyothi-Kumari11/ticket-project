import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getVariant = (prio) => {
    switch (prio?.toLowerCase()) {
      case 'low':
        return { class: 'priority-low', label: 'Low' };
      case 'medium':
        return { class: 'priority-medium', label: 'Medium' };
      case 'high':
        return { class: 'priority-high', label: 'High' };
      case 'critical':
        return { class: 'priority-critical', label: 'Critical' };
      default:
        return { class: 'priority-medium', label: 'Medium' };
    }
  };

  const variant = getVariant(priority);

  return (
    <span className={`badge ${variant.class}`}>
      {variant.label}
    </span>
  );
};

export { PriorityBadge };
export default PriorityBadge;
