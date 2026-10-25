import React, { useState } from 'react';
import { isFirebaseConfigured, firebaseConfig, saveFirebaseConfig, clearFirebaseConfig } from '../firebase/config';
import { Database, CheckCircle, AlertTriangle, ExternalLink, X, Copy, Zap } from 'lucide-react';

export const FirebaseModal = ({ isOpen, onClose }) => {
  const [configInput, setConfigInput] = useState('');
  const [error, setError] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  if (!isOpen) return null;

  const handleParseAndSave = () => {
    setError('');
    try {
      let trimmed = configInput.trim();
      if (!trimmed) {
        setError('Please paste your Firebase configuration.');
        return;
      }

      // If user pasted "const firebaseConfig = { ... };"
      if (trimmed.includes('{') && trimmed.includes('}')) {
        const start = trimmed.indexOf('{');
        const end = trimmed.lastIndexOf('}');
        let jsonLike = trimmed.substring(start, end + 1);

        // Convert JS object keys to valid JSON format
        // e.g. apiKey: "..." -> "apiKey": "..."
        jsonLike = jsonLike
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
          .replace(/'/g, '"')
          .replace(/,(\s*})/g, '$1'); // remove trailing commas

        const parsed = JSON.parse(jsonLike);

        if (!parsed.apiKey || !parsed.projectId) {
          setError('Config must include at least "apiKey" and "projectId".');
          return;
        }

        saveFirebaseConfig(parsed);
      } else {
        setError('Could not recognize Firebase config format. Please copy the whole object from Firebase Console.');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to parse config. Make sure to copy the entire "const firebaseConfig = { ... }" snippet from Firebase.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        color: '#f8fafc',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: isFirebaseConfigured
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Database size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Firebase Database Setup</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0' }}>
              {isFirebaseConfigured
                ? `Connected live to Firestore (${firebaseConfig.projectId})`
                : 'Running in Offline Demo Mode (Mock Storage)'}
            </p>
          </div>
        </div>

        {/* Current Status Box */}
        <div style={{
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: isFirebaseConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${isFirebaseConfigured ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isFirebaseConfigured ? (
              <CheckCircle size={18} style={{ color: '#34d399' }} />
            ) : (
              <AlertTriangle size={18} style={{ color: '#fbbf24' }} />
            )}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {isFirebaseConfigured ? 'Database Status: LIVE CLOUD' : 'Database Status: DEMO MODE'}
            </span>
          </div>

          {isFirebaseConfigured && (
            <button
              onClick={clearFirebaseConfig}
              className="btn btn-sm"
              style={{
                fontSize: '0.75rem',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Setup Form */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#cbd5e1' }}>
            Paste your Firebase Web Config snippet:
          </label>
          <textarea
            rows={5}
            value={configInput}
            onChange={(e) => setConfigInput(e.target.value)}
            placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "smart-waste-xxx.firebaseapp.com",\n  projectId: "smart-waste-xxx",\n  storageBucket: "smart-waste-xxx.appspot.com",\n  messagingSenderId: "123456789",\n  appId: "1:123456789:web:abcdef..."\n};`}
            style={{
              width: '100%',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem', marginBottom: 0 }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            onClick={handleParseAndSave}
            className="btn btn-primary"
            style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.4rem' }}
          >
            <Zap size={16} /> Save & Connect Live
          </button>
          <button
            onClick={() => setShowHelper(!showHelper)}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            {showHelper ? 'Hide Guide' : 'How to get keys?'}
          </button>
        </div>

        {/* Quick Guide */}
        {showHelper && (
          <div style={{
            background: '#1e293b',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
            border: '1px solid #334155'
          }}>
            <p style={{ fontWeight: 700, margin: '0 0 6px 0', color: '#38bdf8' }}>3-Step Free Setup:</p>
            <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>Firebase Console <ExternalLink size={10} style={{ display: 'inline' }} /></a> & create a free project.</li>
              <li>Click <strong>Build ➔ Firestore Database</strong> ➔ Create database in <strong>Test mode</strong>.</li>
              <li>Click <strong>Project settings</strong> ➔ scroll to <strong>Your apps</strong> ➔ select <strong>Web (&lt;/&gt;)</strong> and copy the <code>firebaseConfig</code>.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};
