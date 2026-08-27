import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, UserCheck, RefreshCw, Radio } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onSimulateTick, isSimulating }) => {
  const { currentUser, switchRole } = useAuth();

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.85rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('admin-dashboard')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <Trash2 size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              EcoTrack <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600 }}>IoT</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Smart Waste Management</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('bins')}
            className={`btn btn-sm ${activeTab === 'bins' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Bins Monitor
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`btn btn-sm ${activeTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Complaints
          </button>
          <button
            onClick={() => setActiveTab('citizen-report')}
            className={`btn btn-sm ${activeTab === 'citizen-report' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Report Waste
          </button>
          <button
            onClick={() => setActiveTab('driver-portal')}
            className={`btn btn-sm ${activeTab === 'driver-portal' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Driver Portal
          </button>
          <button
            onClick={() => setActiveTab('iot-telemetry')}
            className={`btn btn-sm ${activeTab === 'iot-telemetry' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Radio size={14} /> Live IoT
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Analytics
          </button>
        </div>

        {/* Controls: Live IoT Tick & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onSimulateTick}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.8rem', gap: '0.4rem', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#38bdf8' }}
            title="Simulate real-time sensor fluctuation"
          >
            <RefreshCw size={14} className={isSimulating ? 'spin' : ''} />
            IoT Tick
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.6rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '1.1rem' }}>{currentUser.avatar}</span>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ADMIN" style={{ background: '#1e293b' }}>Admin / Authority</option>
              <option value="CITIZEN" style={{ background: '#1e293b' }}>Citizen (Priya)</option>
              <option value="DRIVER" style={{ background: '#1e293b' }}>Driver (Rajesh)</option>
            </select>
          </div>
        </div>

      </div>
    </nav>
  );
};
