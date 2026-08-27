import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/Badge';
import { Radio, RefreshCw, Thermometer, Battery, Wifi, Activity, Cpu } from 'lucide-react';

export const IoTMonitorPage = ({ bins, onSimulateTick }) => {
  const [autoStream, setAutoStream] = useState(false);

  useEffect(() => {
    let timer;
    if (autoStream) {
      timer = setInterval(() => {
        onSimulateTick();
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [autoStream, onSimulateTick]);

  return (
    <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio size={24} color="#06b6d4" /> IoT Sensor Telemetry & Smart Mesh
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Live LoRaWAN Ultrasonic & Thermal Sensor Readings across Connected Urban Waste Nodes
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setAutoStream(!autoStream)}
            className={`btn btn-sm ${autoStream ? 'btn-danger' : 'btn-secondary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            <Activity size={16} /> {autoStream ? 'Stop Auto-Stream (3s)' : 'Start Auto-Stream (3s)'}
          </button>
          <button onClick={onSimulateTick} className="btn btn-primary btn-sm">
            <RefreshCw size={16} /> Force Telemetry Ping
          </button>
        </div>
      </div>

      {/* Sensor Node Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {bins.map(bin => {
          const isCritical = bin.currentFillLevel >= 80;
          return (
            <div
              key={bin.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderTop: `4px solid ${isCritical ? '#f43f5e' : '#10b981'}`,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={16} color="#06b6d4" />
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{bin.binCode}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                  <Wifi size={14} /> Connected
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {bin.locationName}
              </p>

              {/* Gauge Meter */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: isCritical ? '#f43f5e' : '#10b981', lineHeight: 1 }}>
                  {bin.currentFillLevel}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ultrasonic Fill Level
                </div>
                
                <div className="progress-track" style={{ marginTop: '0.75rem', height: '10px' }}>
                  <div
                    className={`progress-fill ${isCritical ? 'overflowing' : 'low'}`}
                    style={{ width: `${bin.currentFillLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Sensor Metrics Subgrid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="#f59e0b" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Temperature</div>
                    <strong>{bin.temperature || 26.5}°C</strong>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Battery size={16} color="#10b981" />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Battery</div>
                    <strong>{bin.batteryLevel || 95}%</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Type: {bin.binType}</span>
                <StatusBadge status={bin.status} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
