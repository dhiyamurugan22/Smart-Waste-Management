import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, RefreshCw, Radio, LogOut, ShieldCheck, Truck, LayoutDashboard, BarChart2 } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onSimulateTick, isSimulating }) => {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleBrandClick = () => {
    setActiveTab(isAdmin ? 'admin-dashboard' : 'driver-portal');
  };

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0.75rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto', gap: '0.5rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', flexShrink: 0 }} onClick={handleBrandClick}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: isAdmin ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: isAdmin ? '0 0 15px rgba(16, 185, 129, 0.4)' : '0 0 15px rgba(6, 182, 212, 0.4)',
            flexShrink: 0
          }}>
            {isAdmin ? <Trash2 size={20} /> : <Truck size={20} />}
          </div>
          <div>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, margin: 0 }}>
              BinFlow <span style={{ color: isAdmin ? 'var(--accent-emerald)' : 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 600 }}>IoT</span>
            </h1>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>
              {isAdmin ? 'Municipal Operations Central' : 'Field Driver Portal'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop only) */}
        <div className="desktop-only" style={{ alignItems: 'center', gap: '0.35rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {isAdmin ? (
            <>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('driver-portal')}
                className={`btn btn-sm ${activeTab === 'driver-portal' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Truck size={14} /> My Assigned Trips
              </button>
              <button
                onClick={() => setActiveTab('iot-telemetry')}
                className={`btn btn-sm ${activeTab === 'iot-telemetry' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Radio size={14} /> Live City Sensor Mesh
              </button>
            </>
          )}
        </div>

        {/* Controls: Live IoT Telemetry & User Profile with Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

          <button
            onClick={onSimulateTick}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', gap: '0.35rem', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#38bdf8' }}
            title="Simulate real-time sensor fluctuation"
            aria-label="Trigger IoT Telemetry Tick"
          >
            <RefreshCw size={13} className={isSimulating ? 'spin' : ''} />
            <span className="desktop-only">IoT Tick</span>
            <span className="mobile-only">Tick</span>
          </button>

          {/* User Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.25rem 0.6rem',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <span style={{ fontSize: '1.05rem' }}>{currentUser?.avatar || '👤'}</span>
            <div className="desktop-only" style={{ flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser?.name || (isAdmin ? 'Admin' : 'Driver')}
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 600,
                color: isAdmin ? '#34d399' : '#38bdf8',
                letterSpacing: '0.04em'
              }}>
                {isAdmin ? 'MUNICIPAL ADMIN' : 'COLLECTION DRIVER'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.4rem 0.65rem',
              fontSize: '0.78rem',
              gap: '0.35rem',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
            title="Sign out of operations"
            aria-label="Sign out"
          >
            <LogOut size={13} />
            <span className="desktop-only">Sign Out</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
