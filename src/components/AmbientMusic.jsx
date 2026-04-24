import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

// Am7 chord (A C E G) across octaves — sophisticated, warm, luxurious
const LAYERS = [
  { freq: 55,    gain: 0.15, type: 'sine',     detune: 0,  fLfo: 0.03, gLfo: 0.06 },
  { freq: 110,   gain: 0.10, type: 'sine',     detune: 3,  fLfo: 0.04, gLfo: 0.07 },
  { freq: 130.8, gain: 0.06, type: 'sine',     detune: -2, fLfo: 0.05, gLfo: 0.05 },
  { freq: 164.8, gain: 0.07, type: 'sine',     detune: 4,  fLfo: 0.06, gLfo: 0.08 },
  { freq: 196,   gain: 0.05, type: 'sine',     detune: -3, fLfo: 0.04, gLfo: 0.06 },
  { freq: 220,   gain: 0.06, type: 'sine',     detune: 5,  fLfo: 0.07, gLfo: 0.09 },
  { freq: 261.6, gain: 0.04, type: 'sine',     detune: -4, fLfo: 0.05, gLfo: 0.07 },
  { freq: 329.6, gain: 0.03, type: 'triangle', detune: 2,  fLfo: 0.06, gLfo: 0.10 },
  { freq: 392,   gain: 0.02, type: 'sine',     detune: -5, fLfo: 0.07, gLfo: 0.08 },
  { freq: 440,   gain: 0.016,type: 'sine',     detune: 6,  fLfo: 0.08, gLfo: 0.12 },
  { freq: 523.3, gain: 0.009,type: 'sine',     detune: -6, fLfo: 0.09, gLfo: 0.11 },
  { freq: 659.3, gain: 0.005,type: 'sine',     detune: 8,  fLfo: 0.10, gLfo: 0.13 },
]

function buildGraph(ctx) {
  // Master — the only node touched during play/mute
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Convolver reverb
  const irLen = ctx.sampleRate * 3.0
  const ir = ctx.createBuffer(2, irLen, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c)
    for (let i = 0; i < irLen; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.1) * (i < 400 ? i / 400 : 1)
  }
  const conv = ctx.createConvolver()
  conv.buffer = ir

  const wet = ctx.createGain(); wet.gain.value = 0.30; conv.connect(wet); wet.connect(master)
  const dry = ctx.createGain(); dry.gain.value = 0.70; dry.connect(master)

  const all = []

  LAYERS.forEach(({ freq, gain: gVal, type, detune, fLfo, gLfo }) => {
    const osc  = ctx.createOscillator()
    const filt = ctx.createBiquadFilter()
    const gNode = ctx.createGain()

    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    filt.type = 'lowpass'
    filt.frequency.value = Math.min(freq * 5, 4000)
    gNode.gain.value = gVal

    // Frequency LFO — organic pitch drift (safe: never touches master)
    const fLFO = ctx.createOscillator()
    const fLFOg = ctx.createGain()
    fLFO.frequency.value = fLfo
    fLFOg.gain.value = freq * 0.004
    fLFO.connect(fLFOg); fLFOg.connect(osc.frequency)
    fLFO.start()

    // Gain LFO — individual breathing (safe: touches only this osc's gain)
    const gLFO = ctx.createOscillator()
    const gLFOg = ctx.createGain()
    gLFO.frequency.value = gLfo
    gLFOg.gain.value = gVal * 0.25
    gLFO.connect(gLFOg); gLFOg.connect(gNode.gain)
    gLFO.start()

    osc.connect(filt); filt.connect(gNode)
    gNode.connect(dry); gNode.connect(conv)
    osc.start()
    all.push(osc, fLFO, gLFO)
  })

  return { master, all }
}

export default function AmbientMusic() {
  const [playing, setPlaying]   = useState(false)
  const [tooltip, setTooltip]   = useState(false)
  const isMobile = useIsMobile()
  const ctxRef    = useRef(null)
  const masterRef = useRef(null)
  const nodesRef  = useRef([])
  const timerRef  = useRef(null)

  const toggle = () => {
    if (playing) {
      // Mute
      if (!masterRef.current || !ctxRef.current) { setPlaying(false); return }
      const ctx = ctxRef.current
      const m   = masterRef.current
      m.gain.cancelScheduledValues(ctx.currentTime)
      m.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        if (ctx.state === 'running') ctx.suspend()
      }, 2200)
      setPlaying(false)
      return
    }

    // Play — everything synchronous so iOS Safari honours the gesture
    try {
      if (!ctxRef.current) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const { master, all } = buildGraph(ctx)
        ctxRef.current = ctx
        masterRef.current = master
        nodesRef.current = all
      }

      const ctx = ctxRef.current
      const m   = masterRef.current

      // resume() called synchronously within the gesture (required by iOS Safari)
      ctx.resume()

      if (timerRef.current) clearTimeout(timerRef.current)
      m.gain.cancelScheduledValues(ctx.currentTime)
      m.gain.setTargetAtTime(0.22, ctx.currentTime, 1.5)
      setPlaying(true)
    } catch (e) {
      console.warn('Web Audio error:', e)
    }
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (ctxRef.current) try { ctxRef.current.close() } catch (e) {}
  }, [])

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
              position: 'absolute', bottom: 54, ...(isMobile ? { left: 0 } : { right: 0 }),
              background: 'rgba(6,6,12,0.95)',
              border: '1px solid rgba(212,168,67,0.22)',
              backdropFilter: 'blur(16px)',
              padding: '7px 14px', whiteSpace: 'nowrap', pointerEvents: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(210,195,175,0.72)',
            }}
          >
            {playing ? 'Mute' : 'Play Ambience'}
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
        aria-label={playing ? 'Mute ambient music' : 'Play ambient music'}
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
