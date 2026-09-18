import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const calculateSlaInfo = (createdAt, priority, status) => {
  if (status === 'Resolved' || status === 'Closed') {
    return { status: 'met', label: 'SLA Met', minutesLeft: 0, percentage: 100 };
  }

  // SLA Hours by priority
  const slaHoursMap = {
    Critical: 2,
    High: 6,
    Medium: 24,
    Low: 48
  };

  const maxHours = slaHoursMap[priority] || 24;
  const maxMilliseconds = maxHours * 60 * 60 * 1000;
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsedMs = Math.max(0, now - createdTime);
  const remainingMs = maxMilliseconds - elapsedMs;

  const minutesLeft = Math.floor(remainingMs / (1000 * 60));
  const percentage = Math.min(100, Math.max(0, Math.round((elapsedMs / maxMilliseconds) * 100)));

  if (remainingMs <= 0) {
    const overdueMinutes = Math.abs(minutesLeft);
    const overdueHours = Math.floor(overdueMinutes / 60);
    return {
      status: 'breached',
      label: overdueHours > 0 ? `Breached by ${overdueHours}h` : `Breached by ${overdueMinutes}m`,
      minutesLeft,
      percentage: 100
    };
  }

  if (remainingMs <= 60 * 60 * 1000) {
    return {
      status: 'warning',
      label: `Urgent: ${minutesLeft}m left`,
      minutesLeft,
      percentage
    };
  }

  const hoursLeft = Math.floor(minutesLeft / 60);
  const minsRemaining = minutesLeft % 60;
  return {
    status: 'ontrack',
    label: hoursLeft > 0 ? `${hoursLeft}h ${minsRemaining}m left` : `${minsRemaining}m left`,
    minutesLeft,
    percentage
  };
};

export const SlaBadge = ({ createdAt, priority, status }) => {
  const [sla, setSla] = useState(() => calculateSlaInfo(createdAt, priority, status));

  useEffect(() => {
    const timer = setInterval(() => {
      setSla(calculateSlaInfo(createdAt, priority, status));
    }, 60000);
    return () => clearInterval(timer);
  }, [createdAt, priority, status]);

  if (status === 'Resolved' || status === 'Closed') {
    return (
      <span className="sla-badge sla-met">
        <CheckCircle size={12} /> SLA Met
      </span>
    );
  }

  if (sla.status === 'breached') {
    return (
      <span className="sla-badge sla-breached">
        <AlertTriangle size={12} /> {sla.label}
      </span>
    );
  }

  if (sla.status === 'warning') {
    return (
      <span className="sla-badge sla-warning">
        <Clock size={12} /> {sla.label}
      </span>
    );
  }

  return (
    <span className="sla-badge sla-ontrack">
      <Clock size={12} /> {sla.label}
    </span>
  );
};

export const SlaProgressCard = ({ createdAt, priority, status }) => {
  const sla = calculateSlaInfo(createdAt, priority, status);

  return (
    <div className="sla-progress-card">
      <div className="sla-header">
        <div className="sla-title">
          <Clock size={16} />
          <span>SLA Target: {priority === 'Critical' ? '2 Hours' : priority === 'High' ? '6 Hours' : priority === 'Medium' ? '24 Hours' : '48 Hours'}</span>
        </div>
        <SlaBadge createdAt={createdAt} priority={priority} status={status} />
      </div>

      {status !== 'Resolved' && status !== 'Closed' && (
        <div className="sla-progress-bar-container">
          <div 
            className={`sla-progress-bar ${sla.status}`} 
            style={{ width: `${sla.percentage}%` }}
          />
        </div>
      )}
    </div>
  );
};
