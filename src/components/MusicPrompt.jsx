import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MusicPrompt() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  const handlePlay = () => {
    document.dispatchEvent(new CustomEvent('refrm:play-music'))
    setVisible(false)
  }

  const handleSkip = () => setVisible(false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleSkip}
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(4,5,14,0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'linear-gradient(160deg, rgba(14,14,22,0.98), rgba(8,8,14,0.98))',
              border: '1px solid rgba(212,168,67,0.32)',
              borderRadius: '28px',
              padding: '44px 36px 36px',
              maxWidth: '320px',
              width: '88%',
              textAlign: 'center',
              boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle gold glow in corner */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: '60%', height: '40%',
              background: 'radial-gradient(ellipse at 80% 20%, rgba(212,168,67,0.10) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Animated note icon */}
            <motion.div
              animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontSize: '36px', marginBottom: '22px', lineHeight: 1,
                color: 'rgba(212,168,67,0.88)',
              }}
            >
              ♪
            </motion.div>

            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '26px', fontWeight: 400,
              color: '#f2ebe0', margin: '0 0 10px 0',
              letterSpacing: '-0.01em', lineHeight: 1.1,
            }}>
              Set the mood.
            </h3>

            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px', lineHeight: 1.75,
              color: 'rgba(210,195,175,0.55)',
              margin: '0 0 32px 0', letterSpacing: '0.02em',
            }}>
              <span style={{ color: 'rgba(210,195,175,0.85)', fontStyle: 'italic' }}>Inspire</span> by ASHUTOSH<br />
              plays softly in the background.
            </p>

            {/* Play button */}
            <motion.button
              onClick={handlePlay}
              whileHover={{ scale: 1.04, background: 'rgba(212,168,67,0.26)' }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ['0 0 0px rgba(212,168,67,0)', '0 0 20px rgba(212,168,67,0.3)', '0 0 0px rgba(212,168,67,0)'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '100%', padding: '15px',
                background: 'rgba(212,168,67,0.16)',
                border: '1px solid rgba(212,168,67,0.42)',
                borderRadius: '14px',
                color: 'rgba(212,168,67,0.95)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                cursor: 'pointer', marginBottom: '14px',
              }}
            >
              ♪ &nbsp; Play Music
            </motion.button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(200,185,165,0.28)',
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px', letterSpacing: '0.14em',
                textTransform: 'uppercase', cursor: 'pointer',
                padding: '6px 12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'rgba(200,185,165,0.55)'}
              onMouseLeave={e => e.target.style.color = 'rgba(200,185,165,0.28)'}
            >
              Skip for now
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
