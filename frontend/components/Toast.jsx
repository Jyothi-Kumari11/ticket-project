import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast }) => {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} color="#10B981" />;
      case 'danger':
      case 'error':
        return <AlertCircle size={18} color="#EF4444" />;
      case 'warning':
        return <AlertCircle size={18} color="#F59E0B" />;
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: '#0F172A',
        color: '#FFFFFF',
        padding: '0.875rem 1.25rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: 600,
        maxWidth: '380px',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {getIcon()}
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
};

export default Toast;
