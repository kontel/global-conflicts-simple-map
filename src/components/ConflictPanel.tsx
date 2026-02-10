import { motion } from 'framer-motion';
import { statusColors, statusLabels, regionColors, type Conflict } from '../data/conflicts';

interface ConflictPanelProps {
  conflict: Conflict;
  onClose: () => void;
}

export default function ConflictPanel({ conflict, onClose }: ConflictPanelProps) {
  const statusColor = statusColors[conflict.status];
  const regionColor = regionColors[conflict.region] || '#888';

  return (
    <motion.div
      className="conflict-panel"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Panel header */}
      <div className="panel-header">
        <button className="panel-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
        <div className="panel-badges">
          <span className="badge status-badge" style={{ borderColor: statusColor, color: statusColor }}>
            <span className="badge-dot" style={{ background: statusColor }} />
            {statusLabels[conflict.status]}
          </span>
          <span className="badge region-badge" style={{ borderColor: regionColor, color: regionColor }}>
            {conflict.region}
          </span>
        </div>
        <h2 className="panel-title">{conflict.name}</h2>
        <p className="panel-type">{conflict.type}</p>
      </div>

      {/* Key metrics */}
      <div className="panel-metrics">
        <div className="metric">
          <div className="metric-label">CASUALTIES</div>
          <div className="metric-value">{conflict.casualties}</div>
        </div>
        <div className="metric">
          <div className="metric-label">DISPLACED</div>
          <div className="metric-value">{conflict.displaced}</div>
        </div>
        <div className="metric">
          <div className="metric-label">INTENSITY</div>
          <div className="metric-value intensity-bar">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`intensity-block ${i < conflict.intensity ? 'filled' : ''}`}
                style={i < conflict.intensity ? { background: statusColor, boxShadow: `0 0 4px ${statusColor}` } : {}}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="panel-section">
        <h3 className="section-title">INVOLVED PARTIES</h3>
        <div className="parties-list">
          {conflict.parties.map((party) => (
            <span key={party} className="party-tag">{party}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="panel-section">
        <h3 className="section-title">SITUATION OVERVIEW</h3>
        <p className="section-text">{conflict.summary}</p>
      </div>

      {/* Timeline */}
      <div className="panel-section">
        <h3 className="section-title">TIMELINE</h3>
        <div className="timeline">
          {conflict.timeline.map((event, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="timeline-marker">
                <div className="timeline-line" />
                <div
                  className="timeline-dot"
                  style={{
                    background: index === conflict.timeline.length - 1 ? statusColor : '#334155',
                    boxShadow: index === conflict.timeline.length - 1 ? `0 0 8px ${statusColor}` : 'none',
                  }}
                />
              </div>
              <div className="timeline-content">
                <span className="timeline-date">{event.date}</span>
                <strong className="timeline-title">{event.title}</strong>
                <p className="timeline-desc">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coordinates */}
      <div className="panel-footer">
        <span className="coord-label">COORDINATES</span>
        <span className="coord-value">
          {conflict.lat.toFixed(4)}N, {conflict.lng.toFixed(4)}E
        </span>
      </div>
    </motion.div>
  );
}
