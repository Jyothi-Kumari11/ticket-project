import React from 'react';

export const SkeletonCard = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    <div className="skeleton" style={{ height: '20px', width: '40%' }}></div>
    <div className="skeleton" style={{ height: '36px', width: '70%' }}></div>
    <div className="skeleton" style={{ height: '14px', width: '50%' }}></div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="table-container">
    <table className="custom-table">
      <thead>
        <tr>
          <th><div className="skeleton" style={{ height: '14px', width: '60px' }}></div></th>
          <th><div className="skeleton" style={{ height: '14px', width: '120px' }}></div></th>
          <th><div className="skeleton" style={{ height: '14px', width: '80px' }}></div></th>
          <th><div className="skeleton" style={{ height: '14px', width: '70px' }}></div></th>
          <th><div className="skeleton" style={{ height: '14px', width: '90px' }}></div></th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx}>
            <td><div className="skeleton" style={{ height: '16px', width: '90px' }}></div></td>
            <td><div className="skeleton" style={{ height: '16px', width: '180px' }}></div></td>
            <td><div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '12px' }}></div></td>
            <td><div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: '12px' }}></div></td>
            <td><div className="skeleton" style={{ height: '16px', width: '100px' }}></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
