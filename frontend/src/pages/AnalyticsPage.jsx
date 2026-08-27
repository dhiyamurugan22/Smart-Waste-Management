import React from 'react';
import { StatCard } from '../components/StatCard';
import { Leaf, Award, Recycle, Flame, TrendingUp, BarChart2 } from 'lucide-react';

export const AnalyticsPage = ({ metrics }) => {
  return (
    <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Urban Sustainability & Environmental Intelligence
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time CO₂ carbon footprint offset, recycling efficiency ratings, and aggregate municipal trends
        </p>
      </div>

      {/* Environmental Stat Cards */}
      <div className="grid-stats">
        <StatCard
          title="CO₂ Emissions Offset"
          value={`${metrics.co2OffsetKg || 9176} kg`}
          subtitle="Saved through optimized truck routing"
          icon={Leaf}
          color="emerald"
        />
        <StatCard
          title="Total Waste Diverted"
          value={`${metrics.totalWasteCollectedTons || 14.8} Tons`}
          subtitle="Collected & processed this month"
          icon={Recycle}
          color="cyan"
        />
        <StatCard
          title="Trees Saved Equivalent"
          value={`${metrics.treesSavedEquivalent || 251} 🌲`}
          subtitle="Carbon sequestration equivalent"
          icon={Award}
          color="violet"
        />
        <StatCard
          title="Recycling Compliance Rate"
          value="78.4%"
          subtitle="+4.2% higher than municipal target"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Breakdown Grid */}
      <div className="grid-2col" style={{ marginTop: '1.5rem' }}>
        
        {/* Waste Stream Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="var(--accent-emerald)" /> Waste Composition Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '3px', background: '#10b981' }}></span> Organic / Compostable Waste
                </span>
                <strong>42% (6.2 Tons)</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill low" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '3px', background: '#3b82f6' }}></span> Recyclables (Plastic, Paper, Glass)
                </span>
                <strong>36% (5.3 Tons)</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '36%', background: '#3b82f6' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '3px', background: '#64748b' }}></span> Non-Recyclable General Landfill
                </span>
                <strong>17% (2.5 Tons)</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill empty" style={{ width: '17%' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '3px', background: '#f43f5e' }}></span> Hazardous & E-Waste
                </span>
                <strong>5% (0.8 Tons)</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill overflowing" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Collection Heatmap Metrics */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Zone Performance Matrix</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>North Zone (IT Corridor)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High volume recyclable stream</p>
              </div>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>98% SLA Met</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Central Zone (Commercial & Markets)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High organic accumulation rate</p>
              </div>
              <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>92% SLA Met</span>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>South Zone (Residential Suburbs)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Low overflow incidence rate</p>
              </div>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>99% SLA Met</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
