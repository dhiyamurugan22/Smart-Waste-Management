import React, { useState } from 'react';
import { StatusBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Plus, Trash2, Search, Filter, Thermometer, Battery, MapPin } from 'lucide-react';

export const BinManagementPage = ({ bins, onAddBin, onEmptyBin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New bin form state
  const [newBin, setNewBin] = useState({
    binCode: '',
    locationName: '',
    latitude: 13.0827,
    longitude: 80.2707,
    zone: 'North Zone',
    binType: 'GENERAL',
    capacityLiters: 500,
    currentFillLevel: 10
  });

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.binCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bin.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'ALL' || bin.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onAddBin(newBin);
    setIsModalOpen(false);
    setNewBin({
      binCode: '',
      locationName: '',
      latitude: 13.0827,
      longitude: 80.2707,
      zone: 'North Zone',
      binType: 'GENERAL',
      capacityLiters: 500,
      currentFillLevel: 10
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Waste Bins Infrastructure</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Inspect bin capacity, battery status, IoT sensors and zone allocation
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} /> Deploy New Smart Bin
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Bin Code or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ width: '200px' }}>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="form-select"
          >
            <option value="ALL">All Urban Zones</option>
            <option value="North Zone">North Zone</option>
            <option value="Central Zone">Central Zone</option>
            <option value="South Zone">South Zone</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Bin ID & Code</th>
              <th>Location & Zone</th>
              <th>Waste Category</th>
              <th>Fill Level & Status</th>
              <th>IoT Telemetry</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBins.map(bin => {
              const getFillClass = (fill) => {
                if (fill >= 95) return 'overflowing';
                if (fill >= 80) return 'full';
                if (fill >= 40) return 'medium';
                if (fill >= 15) return 'low';
                return 'empty';
              };

              return (
                <tr key={bin.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{bin.binCode}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {bin.id}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="var(--accent-emerald)" />
                      <span>{bin.locationName}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{bin.zone}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: bin.binType === 'RECYCLABLE' ? 'rgba(59, 130, 246, 0.15)' : bin.binType === 'ORGANIC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                      color: bin.binType === 'RECYCLABLE' ? '#60a5fa' : bin.binType === 'ORGANIC' ? '#34d399' : '#cbd5e1'
                    }}>
                      {bin.binType}
                    </span>
                  </td>
                  <td style={{ minWidth: '160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span>{bin.currentFillLevel}%</span>
                      <StatusBadge status={bin.status} />
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${getFillClass(bin.currentFillLevel)}`} style={{ width: `${bin.currentFillLevel}%` }}></div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Thermometer size={14} color="#f59e0b" /> {bin.temperature || 26}°C</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Battery size={14} color="#10b981" /> {bin.batteryLevel || 90}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{bin.capacityLiters} L</span>
                  </td>
                  <td>
                    <button
                      onClick={() => onEmptyBin(bin.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem' }}
                      title="Clear waste bin contents"
                    >
                      Empty
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Bin Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Deploy New Smart Bin">
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Bin Code identifier</label>
            <input
              type="text"
              required
              placeholder="e.g. BIN-106"
              className="form-input"
              value={newBin.binCode}
              onChange={(e) => setNewBin({ ...newBin, binCode: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location / Street Landmark</label>
            <input
              type="text"
              required
              placeholder="e.g. Marina Promenade South Walkway"
              className="form-input"
              value={newBin.locationName}
              onChange={(e) => setNewBin({ ...newBin, locationName: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Zone</label>
              <select
                className="form-select"
                value={newBin.zone}
                onChange={(e) => setNewBin({ ...newBin, zone: e.target.value })}
              >
                <option value="North Zone">North Zone</option>
                <option value="Central Zone">Central Zone</option>
                <option value="South Zone">South Zone</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Waste Type</label>
              <select
                className="form-select"
                value={newBin.binType}
                onChange={(e) => setNewBin({ ...newBin, binType: e.target.value })}
              >
                <option value="GENERAL">General Waste</option>
                <option value="RECYCLABLE">Recyclable (Plastic/Paper)</option>
                <option value="ORGANIC">Organic / Compostable</option>
                <option value="HAZARDOUS">Hazardous / E-Waste</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="0.0001"
                className="form-input"
                value={newBin.latitude}
                onChange={(e) => setNewBin({ ...newBin, latitude: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="0.0001"
                className="form-input"
                value={newBin.longitude}
                onChange={(e) => setNewBin({ ...newBin, longitude: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Capacity (Liters)</label>
            <input
              type="number"
              className="form-input"
              value={newBin.capacityLiters}
              onChange={(e) => setNewBin({ ...newBin, capacityLiters: parseInt(e.target.value) })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Bin
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
