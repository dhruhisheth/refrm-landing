import React from 'react'
import { motion } from 'framer-motion'

// SVG paths for fashion silhouettes
const shapes = [
  {
    // Flowing gown/dress
    viewBox: '0 0 80 100',
    path: 'M40,6 C34,6 27,13 23,27 L4,88 L76,88 L57,27 C53,13 46,6 40,6 Z M23,18 L18,6 L40,6 L62,6 L57,18',
    x: '4%', y: '12%', size: 140, rotate: -12, duration: 9, delay: 0, opacity: 0.055,
  },
  {
    // Structured handbag
    viewBox: '0 0 80 80',
    path: 'M16,28 L16,64 Q16,68 20,68 L60,68 Q64,68 64,64 L64,28 Q64,24 60,24 L20,24 Q16,24 16,28 Z M28,24 Q28,10 40,10 Q52,10 52,24',
    x: '72%', y: '8%', size: 100, rotate: 14, duration: 7.5, delay: 1.2, opacity: 0.07,
  },
  {
    // Long belted coat
    viewBox: '0 0 70 110',
    path: 'M20,4 L34,4 L36,20 L38,4 L50,4 L50,106 L42,106 L42,58 L28,58 L28,106 L20,106 Z M34,4 L30,14 L36,20 L42,14 L38,4 M18,50 L52,50',
    x: '86%', y: '30%', size: 120, rotate: 8, duration: 11, delay: 0.5, opacity: 0.05,
  },
  {
    // Stiletto heel
    viewBox: '0 0 90 60',
    path: 'M6,50 Q30,40 58,44 L78,44 Q84,44 84,50 L84,56 L6,56 Z M58,44 L55,16 Q55,8 61,8 Q67,8 67,16 L67,44',
    x: '2%', y: '64%', size: 110, rotate: -8, duration: 8, delay: 2.0, opacity: 0.06,
  },
  {
    // Oversized blazer
    viewBox: '0 0 80 90',
    path: 'M12,0 L30,0 L32,18 L40,8 L48,18 L50,0 L68,0 L68,90 L50,90 L50,52 L30,52 L30,90 L12,90 Z M32,18 L40,28 L48,18',
    x: '55%', y: '72%', size: 105, rotate: 6, duration: 10, delay: 0.8, opacity: 0.045,
  },
  {
    // Minimalist tote bag
    viewBox: '0 0 70 75',
    path: 'M14,22 L14,65 Q14,70 19,70 L51,70 Q56,70 56,65 L56,22 Z M22,22 L22,14 Q22,6 35,6 Q48,6 48,14 L48,22',
    x: '40%', y: '5%', size: 85, rotate: -5, duration: 8.5, delay: 1.6, opacity: 0.05,
  },
  {
    // Flowing scarf
    viewBox: '0 0 120 30',
    path: 'M4,15 Q24,4 44,15 Q64,26 84,15 Q104,4 116,15 Q104,26 84,25 Q64,14 44,25 Q24,36 4,25 Z',
    x: '18%', y: '82%', size: 160, rotate: -3, duration: 12, delay: 0.3, opacity: 0.055,
  },
  {
    // Knee-high boot
    viewBox: '0 0 50 100',
    path: 'M15,0 L35,0 L35,68 Q42,70 44,78 L44,90 Q44,96 38,96 L12,96 Q6,96 6,90 L6,78 Q8,70 15,68 Z M35,0 L15,0',
    x: '62%', y: '16%', size: 90, rotate: 18, duration: 9.5, delay: 2.5, opacity: 0.04,
  },
  {
    // Wide-leg trouser silhouette
    viewBox: '0 0 80 100',
    path: 'M28,0 L52,0 L52,10 L70,100 L50,100 L40,55 L30,100 L10,100 L28,10 Z',
    x: '78%', y: '60%', size: 95, rotate: -10, duration: 13, delay: 1.0, opacity: 0.042,
  },
  {
    // Small clutch bag
    viewBox: '0 0 65 40',
    path: 'M8,8 L57,8 Q62,8 62,13 L62,32 Q62,37 57,37 L8,37 Q3,37 3,32 L3,13 Q3,8 8,8 Z M20,8 L20,4 Q20,1 32,1 Q44,1 44,4 L44,8',
    x: '24%', y: '48%', size: 88, rotate: 22, duration: 7, delay: 3.0, opacity: 0.06,
  },
]

export default function GoldenBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            rotate: s.rotate,
          }}
          animate={{
            y: [0, -22, 8, -14, 0],
            rotate: [s.rotate, s.rotate + 4, s.rotate - 2, s.rotate + 1, s.rotate],
            opacity: [s.opacity * 0.7, s.opacity, s.opacity * 0.8, s.opacity, s.opacity * 0.7],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.3, 0.6, 0.8, 1],
          }}
        >
          <svg
            viewBox={s.viewBox}
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`gold-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a843" stopOpacity="1" />
                <stop offset="50%" stopColor="#f0cc6a" stopOpacity="1" />
                <stop offset="100%" stopColor="#b8882e" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              d={s.path}
              stroke={`url(#gold-${i})`}
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              opacity={s.opacity}
            />
            {/* Very faint fill for depth */}
            <path
              d={s.path}
              fill={`url(#gold-${i})`}
              fillOpacity={s.opacity * 0.25}
              strokeWidth="0"
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating gold dust particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `${8 + (i * 5.3) % 86}%`,
            top: `${10 + (i * 7.1) % 78}%`,
            width: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
            height: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#d4a843' : '#f0cc6a',
          }}
          animate={{
            y: [0, -40, -80, -120],
            x: [0, (i % 2 === 0 ? 8 : -8), (i % 2 === 0 ? -4 : 4), 0],
            opacity: [0, 0.35, 0.2, 0],
            scale: [0.5, 1, 0.8, 0],
          }}
          transition={{
            duration: 5 + (i % 4),
            delay: (i * 0.6) % 5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Subtle gold horizontal shimmer lines */}
      {[20, 45, 70].map((top, i) => (
        <motion.div
          key={`shimmer-${i}`}
          style={{
            position: 'absolute',
            top: `${top}%`,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.06) 30%, rgba(240,204,106,0.10) 50%, rgba(212,168,67,0.06) 70%, transparent 100%)',
          }}
          animate={{ opacity: [0, 1, 0], scaleX: [0.6, 1, 0.6] }}
          transition={{ duration: 6 + i * 2, delay: i * 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
