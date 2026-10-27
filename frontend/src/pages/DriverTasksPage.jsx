import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/Badge';
import { Truck, Navigation, CheckCircle2, Play, MapPin, Scale, Clock } from 'lucide-react';

export const DriverTasksPage = ({ tasks, onUpdateTaskStatus }) => {
  const { currentUser } = useAuth();
  const [wasteInputs, setWasteInputs] = useState({});

  const handleStatusChange = (taskId, newStatus) => {
    const weight = parseFloat(wasteInputs[taskId] || '320');
    onUpdateTaskStatus(taskId, newStatus, `Collection completed by ${currentUser.name}`, weight);
  };

  return (
    <div className="page-container">
      
      {/* Driver Status Banner */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
            flexShrink: 0
          }}>
            <Truck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Driver: {currentUser.name}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Vehicle: <strong style={{ color: '#38bdf8' }}>{currentUser.vehicle || 'TN-09-WM-4421'}</strong> | Zone: <strong>{currentUser.zone || 'North Zone'}</strong>
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'left', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Active Schedule</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>Shift In Progress</div>
        </div>
      </div>

      {/* Task List */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>Assigned Collection Trips & Dispatches</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => {
          const isPending = task.status === 'PENDING';
          const isInProgress = task.status === 'IN_PROGRESS';
          const isCompleted = task.status === 'COMPLETED';

          return (
            <div
              key={task.id}
              className="glass-panel"
              style={{
                padding: '1.1rem',
                borderLeft: `4px solid ${isCompleted ? '#10b981' : isInProgress ? '#06b6d4' : '#f59e0b'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{task.title}</h4>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
                      {task.taskCode}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{task.description}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>

              {/* Route & Distance Info Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
                gap: '0.65rem',
                background: 'rgba(15, 23, 42, 0.5)',
                padding: '0.75rem 0.85rem',
                borderRadius: '10px',
                margin: '0.85rem 0',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="#10b981" flexShrink={0} />
                  <span>Zone: <strong>{task.targetZone}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={15} color="#06b6d4" flexShrink={0} />
                  <span>Distance: <strong>{task.estimatedDistanceKm || 5.4} km</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#f59e0b" flexShrink={0} />
                  <span>Time: <strong>{task.estimatedDurationMinutes || 30} mins</strong></span>
                </div>
                {isCompleted && task.wasteCollectedKg && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                    <Scale size={15} flexShrink={0} />
                    <span>Collected: <strong>{task.wasteCollectedKg} kg</strong></span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 180px' }}>
                  {!isCompleted && (
                    <>
                      <Scale size={16} color="var(--text-muted)" />
                      <input
                        type="number"
                        placeholder="Waste (kg)"
                        value={wasteInputs[task.id] || ''}
                        onChange={(e) => setWasteInputs({ ...wasteInputs, [task.id]: e.target.value })}
                        className="form-input"
                        style={{ maxWidth: '140px', padding: '0.4rem 0.6rem', fontSize: '0.85rem', minHeight: '38px' }}
                      />
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 200px', justifyContent: 'flex-end' }}>
                  {isPending && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', width: '100%', maxWidth: '280px' }}
                    >
                      <Play size={14} /> Start Route
                    </button>
                  )}
                  {isInProgress && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', maxWidth: '280px' }}
                    >
                      <CheckCircle2 size={14} /> Confirm Emptied
                    </button>
                  )}
                  {isCompleted && (
                    <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Trip Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
