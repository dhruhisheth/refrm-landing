import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const TRACK_URL = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/14/d5/61/14d561f3-00fe-e57c-8b5a-f2098ddbcdbb/mzaf_10148699690287543805.plus.aac.p.m4a'
const TARGET_VOL = 0.55

export default function AmbientMusic() {
  const [playing, setPlaying] = useState(false)
  const [tooltip, setTooltip] = useState(false)
  const isMobile = useIsMobile()
  const audioRef = useRef(null)
  const fadeRef  = useRef(null)

  useEffect(() => {
    const audio = new Audio(TRACK_URL)
    audio.loop = true
    audio.volume = 0
    audio.preload = 'auto'
    audioRef.current = audio

    const fadeIn = () => {
      let v = 0
      const id = setInterval(() => {
        v = Math.min(TARGET_VOL, v + 0.025)
        audio.volume = v
        if (v >= TARGET_VOL) clearInterval(id)
      }, 35)
    }

    const tryPlay = () => {
      if (!audio.paused) return
      audio.play()
        .then(() => { setPlaying(true); fadeIn() })
        .catch(() => {})
    }

    // Try autoplay immediately
    tryPlay()

    // Fallback: start on first user gesture if autoplay is blocked
    const onGesture = () => {
      tryPlay()
      document.removeEventListener('click', onGesture)
      document.removeEventListener('touchstart', onGesture)
    }
    document.addEventListener('click', onGesture)
    document.addEventListener('touchstart', onGesture)

    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current)
      document.removeEventListener('click', onGesture)
      document.removeEventListener('touchstart', onGesture)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const fadeTo = (target, onDone) => {
    if (fadeRef.current) clearInterval(fadeRef.current)
    const audio = audioRef.current
    const step = target > audio.volume ? 0.025 : -0.025
    fadeRef.current = setInterval(() => {
      const next = audio.volume + step
      if (step > 0 ? next >= target : next <= target) {
        audio.volume = Math.max(0, Math.min(1, target))
        clearInterval(fadeRef.current)
        if (onDone) onDone()
      } else {
        audio.volume = Math.max(0, Math.min(1, next))
      }
    }, 35)
  }

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      fadeTo(0, () => audio.pause())
      setPlaying(false)
    } else {
      audio.play()
        .then(() => { fadeTo(TARGET_VOL); setPlaying(true) })
        .catch(e => console.warn('Audio blocked:', e))
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 28, ...(isMobile ? { left: 16 } : { right: 28 }), zIndex: 200 }}>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute', bottom: 54,
              ...(isMobile ? { left: 0 } : { right: 0 }),
              background: 'rgba(6,6,12,0.95)',
              border: '1px solid rgba(212,168,67,0.22)',
              backdropFilter: 'blur(16px)',
              padding: '7px 14px', whiteSpace: 'nowrap', pointerEvents: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(210,195,175,0.72)',
            }}
          >
            {playing ? 'Mute' : 'Play — Inspire · ASHUTOSH'}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        whileHover={{ scale: 1.13 }}
        whileTap={{ scale: 0.9 }}
        animate={playing
          ? { boxShadow: ['0 0 0px rgba(212,168,67,0)', '0 0 24px rgba(212,168,67,0.48)', '0 0 0px rgba(212,168,67,0)'] }
          : { boxShadow: '0 2px 14px rgba(0,0,0,0.45)' }}
        transition={playing ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        style={{
          width: 46, height: 46, borderRadius: '50%',
          background: playing ? 'rgba(212,168,67,0.14)' : 'rgba(10,10,18,0.86)',
          border: `1px solid ${playing ? 'rgba(212,168,67,0.5)' : 'rgba(200,185,165,0.2)'}`,
          backdropFilter: 'blur(16px)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: playing ? 'rgba(212,168,67,0.95)' : 'rgba(200,185,165,0.42)',
        }}
        aria-label={playing ? 'Mute music' : 'Play Inspire by ASHUTOSH'}
      >
        {playing ? (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor">
            <rect x="0" y="4" width="3" height="6" rx="1.5" opacity="0.7">
              <animate attributeName="height" values="2;10;2" dur="0.82s" repeatCount="indefinite" begin="0s"/>
              <animate attributeName="y" values="6;2;6" dur="0.82s" repeatCount="indefinite" begin="0s"/>
            </rect>
            <rect x="5" y="2" width="3" height="10" rx="1.5">
              <animate attributeName="height" values="5;13;5" dur="0.82s" repeatCount="indefinite" begin="0.16s"/>
              <animate attributeName="y" values="4.5;0.5;4.5" dur="0.82s" repeatCount="indefinite" begin="0.16s"/>
            </rect>
            <rect x="10" y="0" width="3" height="14" rx="1.5" opacity="0.92">
              <animate attributeName="height" values="6;14;6" dur="0.82s" repeatCount="indefinite" begin="0.33s"/>
              <animate attributeName="y" values="4;0;4" dur="0.82s" repeatCount="indefinite" begin="0.33s"/>
            </rect>
            <rect x="15" y="2" width="3" height="10" rx="1.5" opacity="0.7">
              <animate attributeName="height" values="5;13;5" dur="0.82s" repeatCount="indefinite" begin="0.50s"/>
              <animate attributeName="y" values="4.5;0.5;4.5" dur="0.82s" repeatCount="indefinite" begin="0.50s"/>
            </rect>
          </svg>
        ) : (
          <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" opacity="0.42">
            <rect x="0" y="5" width="3" height="4" rx="1.5"/>
            <rect x="5" y="3" width="3" height="8" rx="1.5"/>
            <rect x="10" y="1" width="3" height="12" rx="1.5"/>
            <rect x="15" y="3" width="3" height="8" rx="1.5"/>
          </svg>
        )}
      </motion.button>
    </div>
  )
}
