import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/Badge';
import {
  Truck,
  Navigation,
  CheckCircle2,
  Play,
  MapPin,
  Scale,
  Clock,
  AlertCircle,
  Calendar,
  Sparkles,
  Inbox
} from 'lucide-react';

export const DriverTasksPage = ({ tasks = [], onUpdateTaskStatus }) => {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('my-tasks'); // 'my-tasks' or 'all-tasks'
  const [wasteInputs, setWasteInputs] = useState({});

  // Matching helper for assigned tasks
  const isAssignedToMe = (task) => {
    if (!currentUser) return true;
    const userEmail = (currentUser.email || '').toLowerCase();
    const userName = (currentUser.name || '').toLowerCase();
    const taskDriverEmail = (task.assignedDriverEmail || '').toLowerCase();
    const taskDriverName = (task.assignedDriverName || '').toLowerCase();

    if (taskDriverEmail && userEmail && taskDriverEmail === userEmail) return true;
    if (taskDriverName && userName && taskDriverName === userName) return true;
    if (task.assignedDriverId && currentUser.uid && task.assignedDriverId === currentUser.uid) return true;
    // If no driver specified on the task, treat as open pool
    if (!taskDriverEmail && !taskDriverName) return true;
    return false;
  };

  const myTasks = tasks.filter(isAssignedToMe);
  const displayedTasks = activeFilter === 'my-tasks' ? myTasks : tasks;

  const myPendingCount = myTasks.filter(t => t.status === 'PENDING').length;
  const myInProgressCount = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const myCompletedCount = myTasks.filter(t => t.status === 'COMPLETED').length;
  const totalWeightCollected = myTasks
    .filter(t => t.status === 'COMPLETED' && t.wasteCollectedKg)
    .reduce((sum, t) => sum + parseFloat(t.wasteCollectedKg || 0), 0);

  const handleStatusChange = (taskId, newStatus) => {
    const weight = parseFloat(wasteInputs[taskId] || '320');
    onUpdateTaskStatus(taskId, newStatus, `Collection completed by ${currentUser?.name || 'Driver'}`, weight);
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
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4',
            fontSize: '1.6rem',
            flexShrink: 0
          }}>
            {currentUser?.avatar || '🚛'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Collection Driver'}
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                DRIVER PORTAL
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
              Vehicle: <strong style={{ color: '#38bdf8' }}>{currentUser?.vehicle || 'TN-09-WM-4421'}</strong> | Account: <strong>{currentUser?.email}</strong>
            </p>
          </div>
        </div>

        {/* Real-time Status Badge */}
        <div style={{
          textAlign: 'right',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '0.5rem 0.9rem',
          borderRadius: '10px',
          border: '1px solid rgba(16, 185, 129, 0.25)'
        }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Shift Status
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            Active on Dispatch Duty
          </div>
        </div>
      </div>

      {/* Driver Quick KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div className="glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned To Me</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', margin: '2px 0' }}>{myTasks.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total tasks</div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Pickup</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', margin: '2px 0' }}>{myPendingCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Awaiting start</div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Progress</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#06b6d4', margin: '2px 0' }}>{myInProgressCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>On current route</div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Trips</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', margin: '2px 0' }}>{myCompletedCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Emptied bins</div>
        </div>
        <div className="glass-panel" style={{ padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Waste Collected</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa', margin: '2px 0' }}>{totalWeightCollected} kg</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Logged net weight</div>
        </div>
      </div>

      {/* Filter Tabs (Assigned to Me vs All Tasks) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveFilter('my-tasks')}
            className={`btn btn-sm ${activeFilter === 'my-tasks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            <Truck size={14} /> My Assigned Tasks ({myTasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('all-tasks')}
            className={`btn btn-sm ${activeFilter === 'all-tasks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            <Inbox size={14} /> All Fleet Tasks ({tasks.length})
          </button>
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing {displayedTasks.length} {activeFilter === 'my-tasks' ? 'tasks assigned to you' : 'total fleet tasks'}
        </span>
      </div>

      {/* Task List */}
      {displayedTasks.length === 0 ? (
        <div className="glass-panel" style={{
          padding: '3rem 1.5rem',
          textAlign: 'center',
          borderRadius: '16px'
        }}>
          <Inbox size={42} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            {activeFilter === 'my-tasks'
              ? 'No Collection Tasks Assigned to You Yet'
              : 'No Active Dispatches in the System'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
            {activeFilter === 'my-tasks'
              ? 'When the Municipal Authority assigns a collection task to your driver profile, it will appear here in real time.'
              : 'The municipal fleet currently has zero open collection trips dispatched.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedTasks.map(task => {
            const isPending = task.status === 'PENDING';
            const isInProgress = task.status === 'IN_PROGRESS';
            const isCompleted = task.status === 'COMPLETED';
            const isMine = isAssignedToMe(task);

            const priorityColor = task.priority === 'URGENT' ? '#f43f5e' : task.priority === 'HIGH' ? '#f59e0b' : '#10b981';

            return (
              <div
                key={task.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderLeft: `5px solid ${isCompleted ? '#10b981' : isInProgress ? '#06b6d4' : '#f59e0b'}`,
                  position: 'relative'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {task.title}
                      </h4>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}>
                        {task.taskCode || task.id}
                      </span>
                      {isMine && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(6, 182, 212, 0.2)',
                          color: '#38bdf8',
                          border: '1px solid rgba(6, 182, 212, 0.3)'
                        }}>
                          🎯 Assigned To You
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: `${priorityColor}20`,
                        color: priorityColor,
                        border: `1px solid ${priorityColor}40`
                      }}>
                        {task.priority || 'HIGH'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {task.description}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                {/* Route & Distance Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
                  gap: '0.65rem',
                  background: 'rgba(15, 23, 42, 0.55)',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  margin: '0.85rem 0',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#10b981" flexShrink={0} />
                    <span>Zone: <strong>{task.targetZone || 'North Zone'}</strong></span>
                  </div>
                  {task.binCode && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#06b6d4', fontWeight: 700 }}>Bin:</span>
                      <strong>{task.binCode}</strong>
                    </div>
                  )}
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

                {/* Assigned Driver Details Info Banner */}
                {task.assignedDriverName && (
                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '0.85rem'
                  }}>
                    <span>Driver:</span>
                    <strong style={{ color: '#f8fafc' }}>{task.assignedDriverName}</strong>
                    {task.assignedDriverVehicle && <span>({task.assignedDriverVehicle})</span>}
                    {task.assignedDriverEmail && <span>• {task.assignedDriverEmail}</span>}
                  </div>
                )}

                {/* Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
                    {!isCompleted && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', maxWidth: '240px' }}>
                        <Scale size={16} color="var(--text-muted)" flexShrink={0} />
                        <input
                          type="number"
                          placeholder="Waste (kg), e.g. 350"
                          value={wasteInputs[task.id] || ''}
                          onChange={(e) => setWasteInputs({ ...wasteInputs, [task.id]: e.target.value })}
                          className="form-input"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', minHeight: '38px' }}
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 220px', justifyContent: 'flex-end' }}>
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'IN_PROGRESS')}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)', width: '100%', maxWidth: '260px', gap: '6px' }}
                      >
                        <Play size={14} /> Start Route & Navigation
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', maxWidth: '260px', gap: '6px' }}
                      >
                        <CheckCircle2 size={14} /> Confirm Emptied & Log Weight
                      </button>
                    )}
                    {isCompleted && (
                      <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={18} /> Collection Trip Completed
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
