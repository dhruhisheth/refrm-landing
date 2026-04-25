import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const TRACK_URL = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/14/d5/61/14d561f3-00fe-e57c-8b5a-f2098ddbcdbb/mzaf_10148699690287543805.plus.aac.p.m4a'
const TARGET_VOL = 0.55

export default function AmbientMusic() {
  const [playing, setPlaying] = useState(false)
  const [tooltip, setTooltip] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const isMobile = useIsMobile()
  const audioRef = useRef(null)
  const fadeRef  = useRef(null)

  // Small hint appears only if user is still on page after 60s without music
  useEffect(() => {
    const show = setTimeout(() => setShowHint(true), 60000)
    const hide = setTimeout(() => setShowHint(false), 75000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  useEffect(() => { if (playing) setShowHint(false) }, [playing])

  // Listen for play event dispatched by the MusicPrompt modal
  useEffect(() => {
    const handler = () => {
      const audio = audioRef.current
      if (!audio) return
      audio.play()
        .then(() => { fadeTo(TARGET_VOL); setPlaying(true); setShowHint(false) })
        .catch(() => {})
    }
    document.addEventListener('refrm:play-music', handler)
    return () => document.removeEventListener('refrm:play-music', handler)
  }, [])

  useEffect(() => {
    const audio = new Audio(TRACK_URL)
    audio.loop = true
    audio.volume = 0
    audio.preload = 'auto'
    audioRef.current = audio

    // Try real (unmuted) autoplay first — works in some browsers
    audio.volume = 0
    audio.play()
      .then(() => {
        setPlaying(true)
        let v = 0
        const id = setInterval(() => {
          v = Math.min(TARGET_VOL, v + 0.018)
          audio.volume = v
          if (v >= TARGET_VOL) clearInterval(id)
        }, 40)
      })
      .catch(() => {
        // Autoplay blocked — button pulses to invite the first click
        // Music will start on the user's first interaction with the button
      })

    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current)
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
      setPlaying(false)
      if (isMobile) {
        // iOS doesn't support setting audio.volume programmatically,
        // so the fade loop never finishes — pause directly instead
        if (fadeRef.current) clearInterval(fadeRef.current)
        audio.pause()
      } else {
        fadeTo(0, () => audio.pause())
      }
    } else {
      audio.play()
        .then(() => { fadeTo(TARGET_VOL); setPlaying(true) })
        .catch(e => console.warn('Audio blocked:', e))
    }
  }

  return (
    <div style={{ position: 'fixed', bottom: 28, ...(isMobile ? { left: 16 } : { right: 28 }), zIndex: 200 }}>

      {/* Music hint popup */}
      <AnimatePresence>
        {showHint && !playing && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => { toggle(); setShowHint(false) }}
            style={{
              position: 'absolute',
              bottom: 58,
              ...(isMobile ? { left: 0 } : { right: 0 }),
              background: 'linear-gradient(135deg, rgba(212,168,67,0.22), rgba(212,168,67,0.10))',
              border: '1px solid rgba(212,168,67,0.45)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderRadius: '14px',
              padding: '10px 16px 10px 12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '15px', lineHeight: 1 }}
              >♪</motion.span>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(212,168,67,0.95)', textTransform: 'uppercase' }}>
                  Play Music
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '8.5px', color: 'rgba(210,195,175,0.6)', letterSpacing: '0.06em', marginTop: '2px' }}>
                  Inspire · ASHUTOSH
                </div>
              </div>
            </div>
            {/* Arrow pointing down to button */}
            <div style={{
              position: 'absolute', bottom: -5,
              ...(isMobile ? { left: 16 } : { right: 16 }),
              width: 9, height: 9,
              background: 'rgba(212,168,67,0.18)',
              borderRight: '1px solid rgba(212,168,67,0.45)',
              borderBottom: '1px solid rgba(212,168,67,0.45)',
              transform: 'rotate(45deg)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

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
          : { boxShadow: ['0 0 0px rgba(200,185,165,0)', '0 0 12px rgba(200,185,165,0.22)', '0 0 0px rgba(200,185,165,0)'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 46, height: 46, borderRadius: '50%',
          background: playing ? 'rgba(212,168,67,0.14)' : 'rgba(10,10,18,0.86)',
          border: `1px solid ${playing ? 'rgba(212,168,67,0.5)' : 'rgba(200,185,165,0.28)'}`,
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
