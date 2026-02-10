import { motion } from 'framer-motion';
import { statusColors, statusLabels, regionColors, type Conflict } from '../data/conflicts';

interface ConflictListProps {
  conflicts: Conflict[];
  onSelect: (conflict: Conflict) => void;
}

export default function ConflictList({ conflicts, onSelect }: ConflictListProps) {
  return (
    <motion.div
      className="conflict-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="list-grid">
        {conflicts.map((conflict, index) => {
          const statusColor = statusColors[conflict.status];
          const regionColor = regionColors[conflict.region] || '#888';

          return (
            <motion.div
              key={conflict.id}
              className="list-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(conflict)}
              whileHover={{ scale: 1.02, borderColor: statusColor }}
            >
              <div className="card-header">
                <div className="card-badges">
                  <span className="card-status" style={{ color: statusColor }}>
                    <span className="badge-dot" style={{ background: statusColor }} />
                    {statusLabels[conflict.status]}
                  </span>
                  <span className="card-region" style={{ color: regionColor }}>
                    {conflict.region}
                  </span>
                </div>
                <h3 className="card-title">{conflict.name}</h3>
                <p className="card-type">{conflict.type}</p>
              </div>
              <div className="card-stats">
                <div className="card-stat">
                  <span className="card-stat-label">Casualties</span>
                  <span className="card-stat-value">{conflict.casualties}</span>
                </div>
                <div className="card-stat">
                  <span className="card-stat-label">Displaced</span>
                  <span className="card-stat-value">{conflict.displaced}</span>
                </div>
              </div>
              <div className="card-parties">
                {conflict.parties.slice(0, 3).map((p) => (
                  <span key={p} className="card-party">{p}</span>
                ))}
                {conflict.parties.length > 3 && (
                  <span className="card-party more">+{conflict.parties.length - 3}</span>
                )}
              </div>
              <div className="card-intensity">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`intensity-pip ${i < conflict.intensity ? 'filled' : ''}`}
                    style={i < conflict.intensity ? { background: statusColor } : {}}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
