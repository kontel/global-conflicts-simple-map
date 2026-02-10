import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="splash-screen"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated grid background */}
        <div className="splash-grid" />

        {/* Scanning line */}
        <motion.div
          className="scan-line"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Rotating ring */}
        <motion.div
          className="splash-ring"
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: phase >= 1 ? 1 : 0,
            opacity: phase >= 1 ? 1 : 0,
            rotate: 360,
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* Hex pattern */}
        <motion.div
          className="hex-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
          transition={{ duration: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="hex-dot"
              style={{
                left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 6)}%`,
                top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 6)}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.div
          className="splash-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: phase >= 1 ? 1 : 0,
            y: phase >= 1 ? 0 : 20,
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="splash-label">GLOBAL CONFLICT</div>
          <div className="splash-name">MONITOR</div>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="splash-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          REAL-TIME GEOPOLITICAL INTELLIGENCE
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="splash-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
        >
          <motion.div
            className="splash-loading-bar"
            initial={{ width: '0%' }}
            animate={{ width: phase >= 2 ? '100%' : '0%' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          <motion.span
            className="splash-loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
          >
            SYSTEMS ONLINE
          </motion.span>
        </motion.div>

        {/* Corner decorations */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
          <motion.div
            key={pos}
            className={`splash-corner ${pos}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
