import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { StatusBadge } from './Badge';
import { Trash2, Thermometer, Battery, MapPin } from 'lucide-react';

export const BinMap = ({ bins = [], height = '450px', center = [13.0827, 80.2707], zoom = 14, onEmptyBin }) => {
  const getColor = (status, fill) => {
    if (status === 'OVERFLOWING' || fill >= 95) return '#f43f5e';
    if (status === 'FULL' || fill >= 80) return '#f97316';
    if (status === 'MEDIUM' || fill >= 40) return '#f59e0b';
    if (status === 'LOW' || fill >= 15) return '#10b981';
    return '#64748b';
  };

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {bins.map((bin) => {
          const color = getColor(bin.status, bin.currentFillLevel);
          return (
            <CircleMarker
              key={bin.id}
              center={[bin.latitude || 13.0827, bin.longitude || 80.2707]}
              radius={12}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: '#ffffff',
                weight: 2
              }}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '180px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{bin.binCode}</strong>
                    <StatusBadge status={bin.status} />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {bin.locationName}
                  </p>
                  <div style={{ margin: '8px 0', background: '#f1f5f9', padding: '6px 8px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                      <span>Fill Level</span>
                      <span>{bin.currentFillLevel}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                      <div style={{ width: `${bin.currentFillLevel}%`, height: '100%', background: color }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    <span>🌡️ {bin.temperature || 26}°C</span>
                    <span>🔋 {bin.batteryLevel || 90}%</span>
                    <span>📦 {bin.capacityLiters || 500}L</span>
                  </div>
                  {onEmptyBin && bin.currentFillLevel > 0 && (
                    <button
                      onClick={() => onEmptyBin(bin.id)}
                      style={{
                        width: '100%',
                        padding: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Empty Bin Now
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};
