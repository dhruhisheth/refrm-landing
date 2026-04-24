import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const duration = 2800
    const frame = () => {
      const elapsed = Date.now() - start
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#080608' }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
    >
      {/* Brand wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '13px',
          letterSpacing: '0.42em',
          fontWeight: 400,
          color: '#e8e0d4',
          marginBottom: '48px',
          textTransform: 'uppercase',
        }}
      >
        REFRM
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ width: 120, height: 1, background: 'rgba(255,255,255,0.08)', position: 'relative' }}
      >
        <div
          style={{
            position: 'absolute', inset: '0 auto 0 0',
            background: 'linear-gradient(90deg, rgba(212,168,67,0.6), rgba(212,168,67,0.9))',
            width: `${progress}%`,
            transition: 'width 0.05s linear',
          }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        style={{
          marginTop: '24px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Reform with AI
      </motion.p>
    </motion.div>
  )
}
