import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s?.toUpperCase()) {
      case 'OVERFLOWING':
      case 'EMERGENCY':
      case 'CRITICAL':
      case 'REJECTED':
        return 'badge-overflowing';
      case 'FULL':
      case 'HIGH':
      case 'PENDING':
        return 'badge-full';
      case 'MEDIUM':
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return 'badge-medium';
      case 'LOW':
      case 'RESOLVED':
      case 'COMPLETED':
        return 'badge-low';
      case 'EMPTY':
      default:
        return 'badge-empty';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1"></span>
      {status?.replace('_', ' ')}
    </span>
  );
};
