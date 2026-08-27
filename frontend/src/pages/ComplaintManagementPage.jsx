import React, { useState } from 'react';
import { StatusBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Truck, CheckCircle2, Clock, MapPin, Eye, MessageSquare } from 'lucide-react';

export const ComplaintManagementPage = ({ complaints, onUpdateStatus, onCreateTask }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchData, setDispatchData] = useState({
    driverName: 'Rajesh Kumar (Driver 1)',
    driverPhone: '+91 94567 89012',
    vehicleNumber: 'TN-09-WM-4421',
    remarks: 'Dispatched collector team for urgent clearing'
  });

  const handleOpenDispatch = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDispatchModalOpen(true);
  };

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    // 1. Update Complaint Status to ASSIGNED
    onUpdateStatus(selectedComplaint.id, {
      status: 'ASSIGNED',
      assignedDriverName: dispatchData.driverName,
      remarks: dispatchData.remarks
    });

    // 2. Create Task for Driver
    onCreateTask({
      title: `Clear ${selectedComplaint.category} - ${selectedComplaint.complaintCode}`,
      description: selectedComplaint.description,
      complaintId: selectedComplaint.id,
      assignedDriverName: dispatchData.driverName,
      driverPhone: dispatchData.driverPhone,
      vehicleNumber: dispatchData.vehicleNumber,
      targetZone: selectedComplaint.zone || 'Central Zone',
      priority: selectedComplaint.priority || 'HIGH',
      estimatedDistanceKm: 5.2,
      estimatedDurationMinutes: 30
    });

    setIsDispatchModalOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Citizen Complaints Dispatch</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review citizen incident submissions, inspect attached photos and assign collection drivers
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Ticket Code</th>
              <th>Citizen Details</th>
              <th>Issue & Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Photo Evidence</th>
              <th>Dispatch Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(cmp => (
              <tr key={cmp.id}>
                <td>
                  <strong style={{ color: 'var(--text-primary)' }}>{cmp.complaintCode}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(cmp.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cmp.citizenName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cmp.citizenPhone}</div>
                </td>
                <td>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{cmp.title}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={12} color="var(--accent-emerald)" />
                    <span>{cmp.locationAddress}</span>
                  </div>
                </td>
                <td>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: cmp.priority === 'HIGH' ? '#f43f5e' : '#f59e0b',
                    background: cmp.priority === 'HIGH' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                  }}>
                    {cmp.priority}
                  </span>
                </td>
                <td>
                  <StatusBadge status={cmp.status} />
                  {cmp.assignedDriverName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Driver: {cmp.assignedDriverName}
                    </div>
                  )}
                </td>
                <td>
                  {cmp.imageUrl ? (
                    <a href={cmp.imageUrl} target="_blank" rel="noreferrer">
                      <img
                        src={cmp.imageUrl}
                        alt="Evidence"
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No Image</span>
                  )}
                </td>
                <td>
                  {cmp.status === 'PENDING' ? (
                    <button
                      onClick={() => handleOpenDispatch(cmp)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <Truck size={14} /> Assign Driver
                    </button>
                  ) : cmp.status !== 'RESOLVED' ? (
                    <button
                      onClick={() => onUpdateStatus(cmp.id, { status: 'RESOLVED', remarks: 'Marked resolved by admin' })}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                    >
                      <CheckCircle2 size={14} /> Mark Done
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispatch Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title={`Dispatch Collection Team - ${selectedComplaint?.complaintCode}`}
      >
        <form onSubmit={handleDispatchSubmit}>
          <div className="form-group">
            <label className="form-label">Assign Waste Collector / Driver</label>
            <select
              className="form-select"
              value={dispatchData.driverName}
              onChange={(e) => {
                const name = e.target.value;
                if (name.includes('Rajesh')) {
                  setDispatchData({
                    ...dispatchData,
                    driverName: name,
                    driverPhone: '+91 94567 89012',
                    vehicleNumber: 'TN-09-WM-4421'
                  });
                } else {
                  setDispatchData({
                    ...dispatchData,
                    driverName: name,
                    driverPhone: '+91 98111 22334',
                    vehicleNumber: 'TN-09-WM-8890'
                  });
                }
              }}
            >
              <option value="Rajesh Kumar (Driver 1)">Rajesh Kumar (Truck TN-09-WM-4421 - North Depot)</option>
              <option value="Suresh Babu (Driver 2)">Suresh Babu (Truck TN-09-WM-8890 - South Depot)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dispatch Notes & Priority Instructions</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={dispatchData.remarks}
              onChange={(e) => setDispatchData({ ...dispatchData, remarks: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsDispatchModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Dispatch
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
