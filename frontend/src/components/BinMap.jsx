import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StatusBadge } from './Badge';
import { Trash2, Thermometer, Battery, MapPin, Compass } from 'lucide-react';

// Controller to fix Leaflet size rendering and auto-fit to bins
function MapResizer({ bins, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately and when container sizes adjust
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Auto-center or fit bounds when bins change
  useEffect(() => {
    if (bins && bins.length > 0) {
      const validBins = bins.filter(b => typeof b.latitude === 'number' && typeof b.longitude === 'number');
      if (validBins.length === 1) {
        map.setView([validBins[0].latitude, validBins[0].longitude], 15);
      } else if (validBins.length > 1) {
        const bounds = validBins.map(b => [b.latitude, b.longitude]);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    } else if (center) {
      map.setView(center, zoom || 14);
    }
  }, [bins, map, center, zoom]);

  return null;
}

export const BinMap = ({ bins = [], height = '420px', center = [13.0827, 80.2707], zoom = 14, onEmptyBin }) => {
  const getColor = (status, fill) => {
    if (status === 'OVERFLOWING' || fill >= 95) return '#f43f5e';
    if (status === 'FULL' || fill >= 80) return '#f97316';
    if (status === 'MEDIUM' || fill >= 40) return '#f59e0b';
    if (status === 'LOW' || fill >= 15) return '#10b981';
    return '#64748b';
  };

  return (
    <div style={{
      height: height || '420px',
      width: '100%',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      position: 'relative',
      background: '#0b1120'
    }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapResizer bins={bins} center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        {bins.map((bin) => {
          const color = getColor(bin.status, bin.currentFillLevel);
          const lat = typeof bin.latitude === 'number' ? bin.latitude : 13.0827;
          const lng = typeof bin.longitude === 'number' ? bin.longitude : 80.2707;

          return (
            <CircleMarker
              key={bin.id}
              center={[lat, lng]}
              radius={13}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.9,
                color: '#ffffff',
                weight: 2
              }}
            >
              <Popup>
                <div style={{ padding: '4px', minWidth: '190px' }}>
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
                        padding: '8px',
                        minHeight: '36px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
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

      {/* Subtle indicator when 0 bins are deployed */}
      {bins.length === 0 && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <Compass size={14} color="#10b981" />
          <span>Interactive Map Ready • Deploy smart bins to view live GPS telemetry</span>
        </div>
      )}
    </div>
  );
};
