import React, { useState, useEffect } from 'react';
import { fetchAllDrivers, standardFleetDrivers } from '../data/drivers';
import { X, Truck, Trash2, MapPin, AlertCircle, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export const AssignTaskModal = ({ isOpen, onClose, onAssign, bins = [], initialBinId = null }) => {
  const [drivers, setDrivers] = useState(standardFleetDrivers);
  const [selectedDriverEmail, setSelectedDriverEmail] = useState(standardFleetDrivers[0]?.email || '');
  const [selectedBinId, setSelectedBinId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [targetZone, setTargetZone] = useState('North Zone');
  const [priority, setPriority] = useState('HIGH');
  const [notes, setNotes] = useState('');
  const [estimatedDistance, setEstimatedDistance] = useState('4.8');
  const [estimatedDuration, setEstimatedDuration] = useState('25');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load registered drivers on mount
  useEffect(() => {
    fetchAllDrivers().then(list => {
      if (list && list.length > 0) {
        setDrivers(list);
        if (!selectedDriverEmail) {
          setSelectedDriverEmail(list[0].email);
        }
      }
    });
  }, []);

  // Update form if initialBinId changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const targetBin = bins.find(b => b.id === initialBinId) || bins.find(b => b.currentFillLevel >= 80) || bins[0];
      if (targetBin) {
        setSelectedBinId(targetBin.id);
        setTargetZone(targetBin.zone || 'North Zone');
        setTaskTitle(`Emergency Emptying: ${targetBin.binCode} (${targetBin.locationName})`);
        setPriority(targetBin.currentFillLevel >= 85 ? 'URGENT' : 'HIGH');
      } else {
        setSelectedBinId('');
        setTaskTitle('Urban Waste Collection Route Dispatch');
      }
    }
  }, [isOpen, initialBinId, bins]);

  if (!isOpen) return null;

  const handleBinChange = (binId) => {
    setSelectedBinId(binId);
    const bin = bins.find(b => b.id === binId);
    if (bin) {
      setTargetZone(bin.zone || 'North Zone');
      setTaskTitle(`Collection Pickup: ${bin.binCode} - ${bin.locationName}`);
      setPriority(bin.currentFillLevel >= 85 ? 'URGENT' : bin.currentFillLevel >= 60 ? 'HIGH' : 'NORMAL');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setIsSubmitting(true);

    const driver = drivers.find(d => d.email.toLowerCase() === selectedDriverEmail.toLowerCase()) || drivers[0];
    const bin = bins.find(b => b.id === selectedBinId);

    const taskData = {
      title: taskTitle.trim(),
      description: notes.trim() || `Empty and clean ${bin ? `${bin.binCode} at ${bin.locationName}` : 'designated area'}`,
      targetZone: targetZone,
      priority: priority,
      binId: bin ? bin.id : null,
      binIds: bin ? [bin.id] : [],
      binCode: bin ? bin.binCode : 'GENERAL-ROUTE',
      locationName: bin ? bin.locationName : `${targetZone} Central`,
      assignedDriverId: driver ? driver.id : null,
      assignedDriverName: driver ? driver.name : 'Rajesh Kumar',
      assignedDriverEmail: driver ? driver.email : 'driver.rajesh@smartwaste.com',
      assignedDriverVehicle: driver ? driver.vehicle : 'TN-09-WM-4421',
      assignedDriverAvatar: driver ? driver.avatar : '🚛',
      estimatedDistanceKm: parseFloat(estimatedDistance) || 5.0,
      estimatedDurationMinutes: parseInt(estimatedDuration) || 30,
      status: 'PENDING'
    };

    try {
      await onAssign(taskData);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      setIsSubmitting(false);
    }
  };

  const selectedDriver = drivers.find(d => d.email.toLowerCase() === selectedDriverEmail.toLowerCase()) || drivers[0];
  const selectedBin = bins.find(b => b.id === selectedBinId);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Dispatch Task to Driver</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Assigned trip will appear immediately in the respective driver's portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Select Driver */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={15} color="#38bdf8" /> Assign To Driver (Recipient)
            </label>
            <select
              value={selectedDriverEmail}
              onChange={(e) => setSelectedDriverEmail(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.88rem' }}
              required
            >
              {drivers.map(d => (
                <option key={d.email} value={d.email} style={{ background: '#1e293b' }}>
                  {d.name} — {d.vehicle || 'Fleet Truck'} ({d.zone || 'All Zones'}) — {d.email}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Driver Info Card */}
          {selectedDriver && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{selectedDriver.avatar || '🚛'}</span>
                <div>
                  <strong style={{ color: '#38bdf8', display: 'block' }}>{selectedDriver.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{selectedDriver.email}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Vehicle: {selectedDriver.vehicle}</span>
                <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.75rem' }}>{selectedDriver.zone}</span>
              </div>
            </div>
          )}

          {/* Target Smart Bin Selection */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Trash2 size={15} color="#10b981" /> Target Smart Bin (Optional / Auto-Fills)
            </label>
            <select
              value={selectedBinId}
              onChange={(e) => handleBinChange(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.88rem' }}
            >
              <option value="" style={{ background: '#1e293b' }}>-- General Zone Route (No Specific Bin) --</option>
              {bins.map(b => (
                <option key={b.id} value={b.id} style={{ background: '#1e293b' }}>
                  {b.binCode} — {b.locationName} ({b.currentFillLevel}% Fill - {b.zone}) {b.currentFillLevel >= 80 ? '⚠️ CRITICAL' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Task Title</label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Empty Overflowing Bin at Central Market"
              className="form-input"
            />
          </div>

          {/* Zone & Priority Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#10b981" /> Target Zone
              </label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="North Zone" style={{ background: '#1e293b' }}>North Zone</option>
                <option value="South Zone" style={{ background: '#1e293b' }}>South Zone</option>
                <option value="Central Zone" style={{ background: '#1e293b' }}>Central Zone</option>
                <option value="East Zone" style={{ background: '#1e293b' }}>East Zone</option>
                <option value="West Zone" style={{ background: '#1e293b' }}>West Zone</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} color="#f59e0b" /> Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="URGENT" style={{ background: '#1e293b' }}>🔴 Urgent (Immediate)</option>
                <option value="HIGH" style={{ background: '#1e293b' }}>🟠 High Priority</option>
                <option value="NORMAL" style={{ background: '#1e293b' }}>🟢 Normal</option>
              </select>
            </div>
          </div>

          {/* Distance & Duration Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Navigation size={14} color="#06b6d4" /> Est. Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={estimatedDistance}
                onChange={(e) => setEstimatedDistance(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} color="#f59e0b" /> Est. Duration (mins)
              </label>
              <input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Special Instructions / Notes */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Driver Instructions & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Narrow street, please use compact loader. Sensor shows 92% full."
              className="form-input"
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ gap: '0.5rem' }}
            >
              {isSubmitting ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <Truck size={17} />
                  <span>Assign & Dispatch to {selectedDriver ? selectedDriver.name.split(' ')[0] : 'Driver'}</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
