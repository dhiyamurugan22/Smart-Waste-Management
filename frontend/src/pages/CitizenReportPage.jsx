import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/Badge';
import { Upload, MapPin, CheckCircle, AlertCircle, Clock, Camera } from 'lucide-react';

export const CitizenReportPage = ({ complaints, onFileComplaint }) => {
  const { currentUser } = useAuth();
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'OVERFLOWING_BIN',
    description: '',
    locationAddress: 'Gandhi Road Market Square, Corner 3',
    zone: 'Central Zone',
    latitude: 13.0780,
    longitude: 80.2650,
    priority: 'HIGH',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=60'
  });

  const myComplaints = complaints.filter(c => c.citizenEmail === currentUser.email || c.citizenName.includes('Priya') || complaints.length <= 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFileComplaint({
      ...formData,
      userId: currentUser.email,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      citizenPhone: '+91 91234 56789'
    });
    setSubmittedSuccess(true);
    setFormData({
      title: '',
      category: 'OVERFLOWING_BIN',
      description: '',
      locationAddress: '',
      zone: 'Central Zone',
      latitude: 13.0827,
      longitude: 80.2707,
      priority: 'MEDIUM',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60'
    });
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Citizen Cleanliness Portal
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Report overflowing garbage bins, illegal dump sites, or uncollected street waste directly to municipal authorities.
        </p>
      </div>

      <div className="grid-2col">
        
        {/* Report Form */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--accent-emerald)" /> Report Waste Issue
          </h3>

          {submittedSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CheckCircle size={22} />
              <div>
                <strong>Report Registered Successfully!</strong>
                <p style={{ fontSize: '0.8rem' }}>Authorities and nearest collection vehicles have been notified.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="OVERFLOWING_BIN">🗑️ Overflowing Waste Bin</option>
                <option value="UNCOLLECTED_WASTE">🚛 Missed / Uncollected Waste</option>
                <option value="ILLEGAL_DUMPING">⚠️ Illegal Dumping Site</option>
                <option value="DAMAGED_BIN">🛠️ Damaged / Broken Smart Bin</option>
                <option value="OTHER">📌 Other Waste Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brief Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic bin overflowing near market"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location Address / Street Landmark</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. 45 Park Avenue, next to bus stop"
                  className="form-input"
                  value={formData.locationAddress}
                  onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, locationAddress: 'GPS Location: 13.0827° N, 80.2707° E (Detected)' })}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: 'none',
                    color: '#34d399',
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  📍 Use GPS
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Zone</label>
                <select
                  className="form-select"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                >
                  <option value="North Zone">North Zone</option>
                  <option value="Central Zone">Central Zone</option>
                  <option value="South Zone">South Zone</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Urgency Priority</label>
                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low - Routine</option>
                  <option value="MEDIUM">Medium - Normal</option>
                  <option value="HIGH">High - Odor / Spillage</option>
                  <option value="CRITICAL">Critical - Health Hazard</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description of Problem</label>
              <textarea
                rows="3"
                required
                placeholder="Describe the issue in detail..."
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image Evidence (Photo URL / Upload)</label>
              <input
                type="text"
                className="form-input"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Submit Waste Report
            </button>
          </form>
        </div>

        {/* My Activity & Tracking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-cyan)" /> My Filed Complaints
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myComplaints.map(cmp => (
                <div
                  key={cmp.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{cmp.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ticket: {cmp.complaintCode}</div>
                    </div>
                    <StatusBadge status={cmp.status} />
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{cmp.description}</p>
                  
                  {/* Visual Progress Steps */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '4px',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ padding: '4px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>1. Received</div>
                    <div style={{ padding: '4px', borderRadius: '4px', background: cmp.status !== 'PENDING' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: cmp.status !== 'PENDING' ? '#34d399' : 'inherit' }}>2. Assigned</div>
                    <div style={{ padding: '4px', borderRadius: '4px', background: cmp.status === 'IN_PROGRESS' || cmp.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)', color: cmp.status === 'IN_PROGRESS' || cmp.status === 'RESOLVED' ? '#34d399' : 'inherit' }}>3. In Transit</div>
                    <div style={{ padding: '4px', borderRadius: '4px', background: cmp.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)', color: cmp.status === 'RESOLVED' ? '#34d399' : 'inherit' }}>4. Cleaned</div>
                  </div>

                  {cmp.assignedDriverName && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#38bdf8' }}>
                      🚚 Assigned Driver: <strong>{cmp.assignedDriverName}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
