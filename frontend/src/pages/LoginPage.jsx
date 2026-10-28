import React, { useState } from 'react';
import { useAuth, demoProfiles } from '../context/AuthContext';
import { Trash2, ShieldCheck, Truck, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, Sparkles, Compass } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('ADMIN'); // 'ADMIN' or 'DRIVER'
  const [email, setEmail] = useState('admin@smartwaste.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'ADMIN') {
      setEmail(demoProfiles.ADMIN.email);
      setPassword('admin123');
    } else {
      setEmail(demoProfiles.DRIVER.email);
      setPassword('driver123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(selectedRole, email, password, rememberMe);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    }, 350);
  };

  const handleQuickLogin = (role) => {
    setIsLoading(true);
    setTimeout(() => {
      const profile = demoProfiles[role];
      login(role, profile.email, 'demo123', true);
      setIsLoading(false);
    }, 250);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        filter: 'blur(45px)',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2rem 1.75rem',
        borderRadius: '24px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.45)',
            marginBottom: '0.85rem'
          }}>
            <Trash2 size={30} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            BinFlow <span style={{ color: 'var(--accent-emerald)' }}>Tracker</span> IoT
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Intelligent Municipal Waste Management System
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={14} color="var(--accent-emerald)" /> Select Your Operational Role
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid var(--border-color)'
          }}>
            {/* Admin Role Button */}
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                border: selectedRole === 'ADMIN' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                background: selectedRole === 'ADMIN' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.25) 100%)' : 'transparent',
                color: selectedRole === 'ADMIN' ? '#34d399' : 'var(--text-secondary)',
                fontWeight: selectedRole === 'ADMIN' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldCheck size={18} color={selectedRole === 'ADMIN' ? '#10b981' : '#94a3b8'} />
              <span>Authority / Admin</span>
            </button>

            {/* Driver Role Button */}
            <button
              type="button"
              onClick={() => handleRoleSelect('DRIVER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '10px',
                border: selectedRole === 'DRIVER' ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
                background: selectedRole === 'DRIVER' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(2, 132, 199, 0.25) 100%)' : 'transparent',
                color: selectedRole === 'DRIVER' ? '#38bdf8' : 'var(--text-secondary)',
                fontWeight: selectedRole === 'DRIVER' ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Truck size={18} color={selectedRole === 'DRIVER' ? '#06b6d4' : '#94a3b8'} />
              <span>Collection Driver</span>
            </button>
          </div>
        </div>

        {/* Role Brief Description Banner */}
        <div style={{
          padding: '0.75rem 0.9rem',
          borderRadius: '12px',
          background: selectedRole === 'ADMIN' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(6, 182, 212, 0.08)',
          border: `1px solid ${selectedRole === 'ADMIN' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(6, 182, 212, 0.25)'}`,
          marginBottom: '1.35rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>
            {selectedRole === 'ADMIN' ? '👨‍💼' : '🚛'}
          </span>
          <div>
            <strong style={{ color: selectedRole === 'ADMIN' ? '#34d399' : '#38bdf8', display: 'block', fontSize: '0.82rem' }}>
              {selectedRole === 'ADMIN' ? 'Municipal Authority Central' : 'Field Collection Console'}
            </strong>
            <span>
              {selectedRole === 'ADMIN'
                ? 'Access central city dashboard, GPS bin map, live LoRaWAN sensor feeds & analytics.'
                : 'Access active dispatch trips, vehicle routes, live weight logging & status completion.'}
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fb7185',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@smartwaste.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
              />
              Remember my session
            </label>
            <span style={{ color: 'var(--accent-cyan)', fontSize: '0.78rem' }}>Demo credentials pre-filled</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              gap: '0.6rem'
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to {selectedRole === 'ADMIN' ? 'Admin Central' : 'Driver Portal'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo 1-Click Login Section */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Demo Access
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem',
                gap: '0.4rem',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '0.6rem 0.5rem'
              }}
            >
              <span>👨‍💼</span> Log in as Admin
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('DRIVER')}
              className="btn btn-secondary btn-sm"
              style={{
                fontSize: '0.78rem',
                gap: '0.4rem',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#38bdf8',
                padding: '0.6rem 0.5rem'
              }}
            >
              <span>🚛</span> Log in as Driver
            </button>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', zIndex: 1 }}>
        BinFlow Tracker IoT Municipal Environmental Operations • {new Date().getFullYear()}
      </div>
    </div>
  );
};
