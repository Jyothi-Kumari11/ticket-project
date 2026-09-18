import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const Timeline = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isCompleted = item.completed;

          return (
            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', position: 'relative' }}>
              {/* Connector line */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '28px',
                    bottom: '-16px',
                    width: '2px',
                    backgroundColor: isCompleted ? '#4F46E5' : '#E2E8F0',
                    zIndex: 0
                  }}
                />
              )}

              {/* Step Node */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#4F46E5' : '#FFFFFF',
                  border: isCompleted ? 'none' : '2px solid #CBD5E1',
                  color: isCompleted ? '#FFFFFF' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  flexShrink: 0
                }}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={14} />}
              </div>

              {/* Step info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isCompleted ? '#0F172A' : '#64748B' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                  <Clock size={12} />
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
