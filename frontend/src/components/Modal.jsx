import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        background: '#1e293b',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} className="btn-secondary btn-sm" style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
