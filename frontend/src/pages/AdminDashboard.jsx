import React from 'react';
import { StatCard } from '../components/StatCard';
import { BinMap } from '../components/BinMap';
import { StatusBadge } from '../components/Badge';
import { Trash2, AlertTriangle, FileText, CheckCircle2, TrendingUp, Truck, Plus } from 'lucide-react';

export const AdminDashboard = ({ metrics, bins, complaints, tasks, onEmptyBin, setActiveTab }) => {
  const criticalBins = bins.filter(b => b.currentFillLevel >= 80);

  return (
    <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Authority Operations Central
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time urban waste monitoring, sensor telemetry & automated collection dispatch
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setActiveTab('bins')} className="btn btn-secondary btn-sm">
            <Plus size={16} /> Add Waste Bin
          </button>
          <button onClick={() => setActiveTab('complaints')} className="btn btn-primary btn-sm">
            <Truck size={16} /> Dispatch Route
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid-stats">
        <StatCard
          title="Monitored Smart Bins"
          value={metrics.totalBins || bins.length}
          subtitle="Connected via LoRaWAN/IoT"
          icon={Trash2}
          color="cyan"
        />
        <StatCard
          title="Critical / Overflowing"
          value={metrics.criticalBins || criticalBins.length}
          subtitle="Requiring immediate pickup"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Active Complaints"
          value={metrics.pendingComplaints || complaints.filter(c => c.status === 'PENDING').length}
          subtitle="Reported by citizens"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Collection Efficiency"
          value={`${metrics.efficiencyRatingPercent || 96}%`}
          subtitle="Resolved within SLA"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Map and Critical List */}
      <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>
        
        {/* Interactive Live Map */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Sensor Geospatial Map</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GPS-tagged smart bins color-coded by capacity threshold</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> &lt;40%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> 40-79%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }}></span> &ge;80%</span>
            </div>
          </div>
          <BinMap bins={bins} height="420px" onEmptyBin={onEmptyBin} />
        </div>

        {/* Priority Action Items */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} color="#f43f5e" /> Critical Bins Alert
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Bins exceeding 80% fill capacity that need immediate dispatch
          </p>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {criticalBins.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                <p>All monitored bins are within normal fill limits.</p>
              </div>
            ) : (
              criticalBins.map(bin => (
                <div
                  key={bin.id}
                  style={{
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>{bin.binCode} ({bin.binType})</strong>
                    <StatusBadge status={bin.status} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{bin.locationName}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#fb7185', fontWeight: 600, marginBottom: '6px' }}>
                    <span>Fill Level</span>
                    <span>{bin.currentFillLevel}%</span>
                  </div>
                  <div className="progress-track" style={{ marginBottom: '8px' }}>
                    <div className="progress-fill overflowing" style={{ width: `${bin.currentFillLevel}%` }}></div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onEmptyBin(bin.id)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', fontSize: '0.75rem', padding: '0.35rem' }}
                    >
                      Instant Empty
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
