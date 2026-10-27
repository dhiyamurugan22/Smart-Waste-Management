import React, { useState } from 'react';
import { StatusBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Plus, Trash2, Search, Filter, Thermometer, Battery, MapPin, LayoutList, LayoutGrid } from 'lucide-react';

export const BinManagementPage = ({ bins, onAddBin, onEmptyBin, onDeleteBin, onClearAllBins }) => {
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

  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'cards', 'table'

  const getFillClass = (fill) => {
    if (fill >= 95) return 'overflowing';
    if (fill >= 80) return 'full';
    if (fill >= 40) return 'medium';
    if (fill >= 15) return 'low';
    return 'empty';
  };

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
    <div className="page-container">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Waste Bins Infrastructure</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Inspect bin capacity, battery status, IoT sensors and zone allocation
          </p>
        </div>
        <div className="page-header-actions">
          {bins.length > 0 && onClearAllBins && (
            <button
              onClick={onClearAllBins}
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              title="Delete all sample bins from database"
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> Deploy Bin
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '0.85rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 220px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search Bin Code or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
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

        {/* View Mode Toggle: Cards / Table */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.6)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)', marginLeft: 'auto' }}>
          <button
            onClick={() => setViewMode('cards')}
            className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
            title="Card View"
            aria-label="Card View"
          >
            <LayoutGrid size={15} /> <span className="desktop-only">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
            title="Table View"
            aria-label="Table View"
          >
            <LayoutList size={15} /> <span className="desktop-only">Table</span>
          </button>
        </div>
      </div>

      {filteredBins.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Trash2 size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No Smart Bins Found</p>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>Click "+ Deploy Bin" above to add your smart bin or clear search filters.</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (displayed on mobile or when viewMode === 'cards') */}
          <div className={viewMode === 'table' ? 'desktop-only' : (viewMode === 'cards' ? 'block' : 'mobile-only')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '0.85rem' }}>
              {filteredBins.map(bin => {
                const fillClass = getFillClass(bin.currentFillLevel);
                return (
                  <div key={bin.id} className="mobile-bin-card">
                    {/* Header: Code + Category + Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{bin.binCode}</strong>
                        <span style={{
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: bin.binType === 'RECYCLABLE' ? 'rgba(59, 130, 246, 0.15)' : bin.binType === 'ORGANIC' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                          color: bin.binType === 'RECYCLABLE' ? '#60a5fa' : bin.binType === 'ORGANIC' ? '#34d399' : '#cbd5e1'
                        }}>
                          {bin.binType}
                        </span>
                      </div>
                      <StatusBadge status={bin.status} />
                    </div>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      <MapPin size={15} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bin.locationName}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {bin.zone}</span>
                    </div>

                    {/* Fill Level Bar */}
                    <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.65rem 0.85rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Capacity Fill Level</span>
                        <span style={{ color: bin.currentFillLevel >= 80 ? '#fb7185' : '#34d399' }}>{bin.currentFillLevel}%</span>
                      </div>
                      <div className="progress-track">
                        <div className={`progress-fill ${fillClass}`} style={{ width: `${bin.currentFillLevel}%` }}></div>
                      </div>
                    </div>

                    {/* Sensor Telemetry Pills & Capacity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Thermometer size={14} color="#f59e0b" /> {bin.temperature || 26}°C</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Battery size={14} color="#10b981" /> {bin.batteryLevel || 90}%</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)' }}>📦 {bin.capacityLiters} L</span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <button
                        onClick={() => onEmptyBin(bin.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1, fontSize: '0.8rem' }}
                      >
                        Empty Bin
                      </button>
                      {onDeleteBin && (
                        <button
                          onClick={() => onDeleteBin(bin.id)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.4rem 0.8rem', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                          title="Delete Bin"
                          aria-label="Delete Bin"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Table View (wrapped in responsive scroller) */}
          <div className={viewMode === 'cards' ? 'mobile-only' : (viewMode === 'table' ? 'block' : 'desktop-only')}>
            <div className="glass-panel table-responsive-wrapper">
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
                    const fillClass = getFillClass(bin.currentFillLevel);
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
                            <div className={`progress-fill ${fillClass}`} style={{ width: `${bin.currentFillLevel}%` }}></div>
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
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => onEmptyBin(bin.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              title="Clear waste bin contents"
                            >
                              Empty
                            </button>
                            {onDeleteBin && (
                              <button
                                onClick={() => onDeleteBin(bin.id)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                title="Permanently remove this bin"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
          <div className="responsive-form-grid">
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
          <div className="responsive-form-grid">
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
              Register Bin
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
