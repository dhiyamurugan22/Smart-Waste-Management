import React, { useState } from 'react';
import { StatCard } from '../components/StatCard';
import { BinMap } from '../components/BinMap';
import { StatusBadge } from '../components/Badge';
import { AssignTaskModal } from '../components/AssignTaskModal';
import {
  Trash2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  TrendingUp,
  Truck,
  Plus,
  Clock,
  MapPin,
  Calendar,
  Send
} from 'lucide-react';

export const AdminDashboard = ({ metrics = {}, bins = [], tasks = [], onEmptyBin, onCreateTask, setActiveTab }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalInitialBinId, setModalInitialBinId] = useState(null);

  const criticalBins = bins.filter(b => b.currentFillLevel >= 80);
  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const handleOpenAssignModal = (binId = null) => {
    setModalInitialBinId(binId);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="page-container">
      
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Authority Operations Central
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time urban waste monitoring, sensor telemetry & automated driver dispatch
          </p>
        </div>
        <div className="page-header-actions">
          <button onClick={() => setActiveTab('bins')} className="btn btn-secondary btn-sm">
            <Plus size={16} /> Deploy Bin
          </button>
          <button
            onClick={() => handleOpenAssignModal(null)}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', gap: '0.4rem' }}
          >
            <Truck size={16} /> Assign Task to Driver
          </button>
          <button onClick={() => setActiveTab('iot-telemetry')} className="btn btn-secondary btn-sm">
            <TrendingUp size={16} /> Live IoT Feeds
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
          title="Active Driver Trips"
          value={activeTasks.length}
          subtitle="Dispatched to collection fleet"
          icon={Truck}
          color="amber"
        />
        <StatCard
          title="Completed Dispatches"
          value={completedTasks.length}
          subtitle="Successfully emptied & verified"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Map and Critical List */}
      <div className="grid-2col" style={{ marginBottom: '1.5rem' }}>
        
        {/* Interactive Live Map */}
        <div className="glass-panel" style={{ padding: '1.1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Sensor Geospatial Map</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>GPS-tagged smart bins color-coded by capacity threshold</p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> &lt;40%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> 40-79%</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }}></span> &ge;80%</span>
            </div>
          </div>
          <BinMap bins={bins} height="420px" onEmptyBin={onEmptyBin} />
        </div>

        {/* Priority Action Items */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="#f43f5e" /> Critical Bins Alert
            </h3>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', color: '#fb7185', fontWeight: 700 }}>
              {criticalBins.length} Urgent
            </span>
          </div>
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenAssignModal(bin.id)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.4rem', gap: '4px' }}
                    >
                      <Send size={13} /> Assign Driver
                    </button>
                    <button
                      onClick={() => onEmptyBin(bin.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.4rem' }}
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

      {/* Driver Dispatches & Tasks Table */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="#06b6d4" /> Active Driver Tasks & Fleet Dispatch
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Tasks dispatched to collection drivers with real-time status tracking
            </p>
          </div>
          <button
            onClick={() => handleOpenAssignModal(null)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.4)' }}
          >
            <Plus size={15} /> New Task Dispatch
          </button>
        </div>

        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
            <Truck size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>No Active Driver Dispatches</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1rem' }}>
              Assign a collection trip to a driver to dispatch collection vehicles to overflowing or scheduled smart bins.
            </p>
            <button
              onClick={() => handleOpenAssignModal(null)}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <Truck size={15} /> Dispatch First Task
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Task Code</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Task Details</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Assigned Driver</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Target Zone</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Priority</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const priorityColor = task.priority === 'URGENT' ? '#f43f5e' : task.priority === 'HIGH' ? '#f59e0b' : '#10b981';
                  return (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.2s'
                      }}
                    >
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#38bdf8' }}>
                        {task.taskCode || task.id}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {task.description || (task.binCode ? `Bin: ${task.binCode}` : 'Zone Route')}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '1.1rem' }}>{task.assignedDriverAvatar || '🚛'}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                              {task.assignedDriverName || 'Rajesh Kumar'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {task.assignedDriverVehicle || task.assignedDriverEmail || 'Sanitation Fleet'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="#10b981" />
                          <span>{task.targetZone || 'North Zone'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: `${priorityColor}20`,
                          color: priorityColor,
                          border: `1px solid ${priorityColor}50`
                        }}>
                          {task.priority || 'HIGH'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <StatusBadge status={task.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={onCreateTask}
        bins={bins}
        initialBinId={modalInitialBinId}
      />

    </div>
  );
};
