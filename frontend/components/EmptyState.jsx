import React from 'react';
import { Ticket, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Ticket,
  title = "No Tickets Found",
  description = "You don't have any complaints matching your current filters.",
  actionText = "Create New Ticket",
  actionLink = "/app/user/create-ticket"
}) => {
  return (
    <div
      style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px border #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#EEF2FF',
          color: '#4F46E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
        {title}
      </h3>

      <p style={{ color: '#64748B', maxWidth: '400px', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-md">
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
