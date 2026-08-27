import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
    rose: { bg: 'rgba(244, 63, 94, 0.12)', text: '#f43f5e', border: 'rgba(244, 63, 94, 0.3)' },
    amber: { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    cyan: { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' },
    violet: { bg: 'rgba(139, 92, 246, 0.12)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</span>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: scheme.bg,
          border: `1px solid ${scheme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: scheme.text
        }}>
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <h3 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</h3>
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{subtitle}</p>
      )}
    </div>
  );
};
