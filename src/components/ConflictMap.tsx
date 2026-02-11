import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Tooltip } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { conflicts, statusColors, type Conflict } from '../data/conflicts';
import ConflictPanel from './ConflictPanel';
import ConflictList from './ConflictList';
import 'leaflet/dist/leaflet.css';

function InitialZoom() {
  const map = useMap();
  const hasZoomed = useRef(false);

  useEffect(() => {
    if (hasZoomed.current) return;
    hasZoomed.current = true;

    map.setView([20, 0], 2, { animate: false });

    const timer = setTimeout(() => {
      map.flyTo([20, 0], 3, {
        duration: 2.5,
        easeLinearity: 0.15,
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function PulsingMarkers({
  onSelect,
  selectedId,
}: {
  onSelect: (c: Conflict) => void;
  selectedId: string | null;
}) {
  const map = useMap();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const baseDelay = 800;
    const timers = conflicts.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), baseDelay + i * 80)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      {conflicts.slice(0, visibleCount).map((conflict) => {
        const baseRadius = 6 + conflict.intensity * 3;
        const isSelected = selectedId === conflict.id;
        const color = statusColors[conflict.status];

        return (
          <CircleMarker
            key={conflict.id}
            center={[conflict.lat, conflict.lng]}
            radius={isSelected ? baseRadius + 4 : baseRadius}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.6,
              weight: isSelected ? 3 : 2,
              className: 'conflict-marker pulse-marker',
            }}
            eventHandlers={{
              click: () => {
                onSelect(conflict);
                map.flyTo([conflict.lat, conflict.lng], 6, {
                  duration: 2,
                  easeLinearity: 0.1,
                });
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              className="conflict-tooltip"
              permanent={false}
            >
              <div className="tooltip-content">
                <span className="tooltip-status" style={{ background: color }} />
                <strong>{conflict.name}</strong>
                <span className="tooltip-type">{conflict.type}</span>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

function MapController({ selectedConflict }: { selectedConflict: Conflict | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedConflict) {
      map.flyTo([selectedConflict.lat, selectedConflict.lng], 6, {
        duration: 2,
        easeLinearity: 0.1,
      });
    }
  }, [selectedConflict, map]);

  return null;
}

export default function ConflictMap() {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [showList, setShowList] = useState(false);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const mapRef = useRef(null);

  const handleSelect = useCallback((conflict: Conflict) => {
    setSelectedConflict(conflict);
    setShowList(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedConflict(null);
  }, []);

  const filteredConflicts = conflicts.filter((c) => {
    if (filterRegion !== 'all' && c.region !== filterRegion) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const regions = [...new Set(conflicts.map((c) => c.region))];
  const statuses = [...new Set(conflicts.map((c) => c.status))];

  return (
    <motion.div
      className="map-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="logo">
            <div className="logo-icon">
              <div className="logo-ring" />
              <div className="logo-dot" />
            </div>
            <div className="logo-text">
              <span className="logo-title">GLOBAL CONFLICT MONITOR</span>
              <span className="logo-subtitle">GEOPOLITICAL INTELLIGENCE SYSTEM</span>
            </div>
          </div>
        </div>
        <div className="top-bar-center">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{conflicts.length}</span>
              <span className="stat-label">TRACKED</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value active-glow">
                {conflicts.filter((c) => c.status === 'active').length}
              </span>
              <span className="stat-label">ACTIVE</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value escalating-glow">
                {conflicts.filter((c) => c.status === 'escalating').length}
              </span>
              <span className="stat-label">ESCALATING</span>
            </div>
          </div>
        </div>
        <div className="top-bar-right">
          <button className="toolbar-btn" onClick={() => setShowList(!showList)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2" rx="0.5" />
              <rect x="1" y="7" width="14" height="2" rx="0.5" />
              <rect x="1" y="12" width="14" height="2" rx="0.5" />
            </svg>
            {showList ? 'MAP' : 'LIST'}
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">REGION</label>
          <select
            className="filter-select"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">STATUS</label>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        {(filterRegion !== 'all' || filterStatus !== 'all') && (
          <button
            className="filter-clear"
            onClick={() => {
              setFilterRegion('all');
              setFilterStatus('all');
            }}
          >
            CLEAR FILTERS
          </button>
        )}
        <div className="filter-results">
          {filteredConflicts.length} conflict{filteredConflicts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Map */}
      {!showList && (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={10}
          className="leaflet-map"
          zoomControl={false}
          ref={mapRef}
          worldCopyJump={true}
          zoomAnimation={true}
          zoomAnimationThreshold={4}
          fadeAnimation={true}
          markerZoomAnimation={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            keepBuffer={6}
          />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
            pane="overlayPane"
            keepBuffer={6}
            className="label-tile-layer"
          />
          <InitialZoom />
          <PulsingMarkers onSelect={handleSelect} selectedId={selectedConflict?.id ?? null} />
          <MapController selectedConflict={selectedConflict} />
        </MapContainer>
      )}

      {/* List view */}
      {showList && (
        <ConflictList
          conflicts={filteredConflicts}
          onSelect={handleSelect}
        />
      )}

      {/* Legend */}
      <div className="legend">
        <div className="legend-title">THREAT LEVEL</div>
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="legend-item">
            <span className="legend-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <span className="legend-label">{status.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* Conflict detail panel */}
      <AnimatePresence>
        {selectedConflict && (
          <ConflictPanel
            conflict={selectedConflict}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Bottom status bar */}
      <div className="bottom-bar">
        <div className="bottom-left">
          <span className="status-dot online" />
          SYSTEM ACTIVE
        </div>
        <div className="bottom-center">
          DATA COMPILED FROM OPEN SOURCES — FOR INFORMATIONAL PURPOSES ONLY
        </div>
        <div className="bottom-right">
          {new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC
        </div>
      </div>
    </motion.div>
  );
}
