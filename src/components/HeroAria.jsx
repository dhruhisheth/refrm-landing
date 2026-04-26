import React, { useState, useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionTemplate,
  AnimatePresence,
} from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

function playSoftClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(720, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.09)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.18)
    setTimeout(() => ctx.close(), 1000)
  } catch (e) {}
}

const suggestions = [
  'Find me a blazer for a gallery opening',
  'Something minimal, earthy tones, under ₹5000',
  'I want to dress like a Bombay architect',
  'Oversized fits with a clean edge',
  'Show me indie Indian labels',
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const LANG_CYCLE = [
  { text: 'Reform with AI.',          label: '',           },
  { text: 'AI से सुधार.',             label: 'Hindi'       },
  { text: 'AI உடன் சீர்திருத்தம்.',  label: 'Tamil'       },
  { text: 'AI తో సంస్కరణ.',          label: 'Telugu'      },
  { text: 'AI দিয়ে সংস্কার.',        label: 'Bengali'     },
  { text: 'AI सह सुधारणा.',           label: 'Marathi'     },
  { text: 'AI ਨਾਲ ਸੁਧਾਰ.',           label: 'Punjabi'     },
  { text: 'AI સાથે સુધારો.',          label: 'Gujarati'    },
  { text: 'AI ಜೊತೆ ಸುಧಾರಣೆ.',        label: 'Kannada'     },
  { text: 'AI കൂടെ പരിഷ്കരണം.',     label: 'Malayalam'   },
]

// ── Text scramble hook ──────────────────────────────────────────
function useScramble(target, active) {
  const [text, setText] = useState(target)
  useEffect(() => {
    setText(target)
    if (!active) return
    let iter = 0
    const t = setInterval(() => {
      setText(
        target.split('').map((c, i) => {
          if (c === ' ' || c === '.' || c === "'" || c === ',') return c
          if (i < Math.floor(iter / 2.5)) return c
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        }).join('')
      )
      iter++
      if (iter >= target.length * 3) { setText(target); clearInterval(t) }
    }, 35)
    return () => clearInterval(t)
  }, [active, target])
  return text
}

// ── Magnetic button ─────────────────────────────────────────────
function MagneticBtn({ children, style, onClick, whileHover, whileTap }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 18 })
  const sy = useSpring(y, { stiffness: 180, damping: 18 })
  return (
    <motion.button
      ref={ref}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - r.left - r.width / 2) * 0.28)
        y.set((e.clientY - r.top  - r.height / 2) * 0.28)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      style={{ x: sx, y: sy, ...style }}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {children}
    </motion.button>
  )
}

// ── Main component ──────────────────────────────────────────────
export default function HeroAria() {
  const containerRef = useRef(null)

  const [input, setInput]           = useState('')
  const [currentSug, setCurrentSug] = useState(0)
  const [typedText, setTypedText]   = useState(suggestions[0])
  const [showCursor, setShowCursor] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)
  const [cursorNearAria, setCursorNearAria] = useState(false)
  const [shootingStars, setShootingStars] = useState([])
  const [langNear, setLangNear] = useState(false)
  const [langIndex, setLangIndex] = useState(0)
  const titleRef = useRef(null)
  const isMobile = useIsMobile()

  // Cursor tracking
  const cursorX = useMotionValue(-400)
  const cursorY = useMotionValue(-400)
  const smCurX  = useSpring(cursorX, { stiffness: 90, damping: 18 })
  const smCurY  = useSpring(cursorY, { stiffness: 90, damping: 18 })

  // Parallax offset from cursor (subtle depth on decorative elements)
  const parX = useTransform(smCurX, [0, 1440], [12, -12])
  const parY = useTransform(smCurY, [0, 900],  [7,  -7])

  // Scroll
  const { scrollYProgress } = useScroll({ target: containerRef })
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 28, restDelta: 0.001 })

  // Container is 440vh → 340vh of actual scroll distance
  // Section 1 clears by 12% (48vh), Section 2 dwells 28%→82% = 216vh
  const heroOpacity = useTransform(sp, [0, 0.12], [1, 0])
  const heroY       = useTransform(sp, [0, 0.12], [0, -70])
  const heroScale   = useTransform(sp, [0, 0.12], [1, 0.93])
  const heroBlurPx  = useTransform(sp, [0, 0.10], [0, 12])
  const heroFilter  = useMotionTemplate`blur(${heroBlurPx}px)`

  const textOpacity = useTransform(sp, [0.14, 0.28, 0.82, 0.95], [0, 1, 1, 0])
  const textY       = useTransform(sp, [0.14, 0.28, 0.82, 0.95], [55, 0, 0, -50])
  const textScale   = useTransform(sp, [0.14, 0.28, 0.82, 0.95], [0.96, 1, 1, 0.94])

  const imgOpacity  = useTransform(sp, [0.18, 0.32, 0.82, 0.95], [0, 1, 1, 0])
  const imgY        = useTransform(sp, [0.18, 0.32, 0.82, 0.95], [120, 0, 0, -35])
  const imgScale    = useTransform(sp, [0.18, 0.32, 0.82, 0.95], [0.92, 1, 1, 0.95])

  const exitBlurPx  = useTransform(sp, [0.82, 0.95], [0, 14])
  const exitFilter  = useMotionTemplate`blur(${exitBlurPx}px)`

  // Suggestion cycle
  useEffect(() => {
    const t = setInterval(() => setCurrentSug(i => (i + 1) % suggestions.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Typewriter
  useEffect(() => {
    const target = suggestions[currentSug]
    setTypedText('')
    let i = 0
    const t = setInterval(() => {
      i++; setTypedText(target.slice(0, i))
      if (i >= target.length) clearInterval(t)
    }, 38)
    return () => clearInterval(t)
  }, [currentSug])

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  // Shooting stars
  useEffect(() => {
    const addStar = () => {
      const id = Date.now() + Math.random()
      const top  = `${6 + Math.random() * 38}%`
      const fromLeft = Math.random() > 0.5
      setShootingStars(s => [...s, { id, top, fromLeft }])
      setTimeout(() => setShootingStars(s => s.filter(x => x.id !== id)), 1600)
    }
    const t1 = setTimeout(addStar, 2800)
    const t2 = setInterval(() => addStar(), 5500)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [])

  // Language cycling — fires when cursor is near the title
  useEffect(() => {
    if (!langNear) { setLangIndex(0); return }
    const t = setInterval(() => setLangIndex(i => (i + 1) % LANG_CYCLE.length), 1600)
    return () => clearInterval(t)
  }, [langNear])

  const handleMouseMove = (e) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
    setCursorNearAria(e.clientX > window.innerWidth * 0.58)
  }

  const scrollToAriaStage = () => {
    const container = containerRef.current
    if (!container) return
    const sectionTop = container.getBoundingClientRect().top
    const totalScroll = Math.max(container.offsetHeight - window.innerHeight, 0)
    window.scrollTo({
      top: window.scrollY + sectionTop + totalScroll * 0.55,
      behavior: 'smooth',
    })
  }

  const scrollToStoryStage = () => {
    const section = document.querySelector('#about')
    if (!section) return
    const sectionTop = section.getBoundingClientRect().top
    const totalScroll = Math.max(section.offsetHeight - window.innerHeight, 0)
    window.scrollTo({
      top: window.scrollY + sectionTop + totalScroll * 0.08,
      behavior: 'smooth',
    })
  }

  return (
    <div ref={containerRef} id="hero-aria" style={{ height: '440vh' }}>
      <div
        onMouseMove={handleMouseMove}
        style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
      >

        {/* ── SHOOTING STARS ── */}
        <AnimatePresence>
          {shootingStars.map(star => (
            <motion.div key={star.id} style={{
              position: 'absolute', top: star.top, zIndex: 8,
              width: 180, height: 1.5, borderRadius: 2,
              background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.9), rgba(255,235,160,0.6), transparent)',
              pointerEvents: 'none',
              rotate: star.fromLeft ? -18 : 18,
            }}
              initial={{ left: star.fromLeft ? '-12%' : '112%', opacity: 0, scaleX: 0.3 }}
              animate={{ left: star.fromLeft ? '115%' : '-15%', opacity: [0, 1, 1, 0], scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ))}
        </AnimatePresence>

        {/* ── CURSOR SPOTLIGHT ── */}
        <motion.div style={{
          position: 'absolute', zIndex: 6, pointerEvents: 'none',
          width: 560, height: 560, borderRadius: '50%',
          x: smCurX, y: smCurY, translateX: '-50%', translateY: '-50%',
          background: 'radial-gradient(circle, rgba(200,160,80,0.13) 0%, rgba(200,160,80,0.05) 40%, transparent 68%)',
          filter: 'blur(3px)',
        }} />


        {/* ── BOKEH ORBS (parallax-shifted by cursor) ── */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none', x: parX, y: parY }}>
          {[
            { size: 180, left: '12%',  bottom: '8%',  dur: 22, delay: 0,   opacity: 0.07  },
            { size: 240, left: '68%',  bottom: '5%',  dur: 28, delay: 3,   opacity: 0.055 },
            { size: 140, left: '38%',  bottom: '12%', dur: 18, delay: 6,   opacity: 0.08  },
            { size: 200, left: '82%',  bottom: '20%', dur: 25, delay: 1.5, opacity: 0.05  },
            { size: 120, left: '5%',   bottom: '35%', dur: 20, delay: 8,   opacity: 0.06  },
          ].map((b, i) => (
            <motion.div key={i} style={{
              position: 'absolute', left: b.left, bottom: b.bottom,
              width: b.size, height: b.size, borderRadius: '50%',
              background: `radial-gradient(circle at 38% 32%, rgba(255,220,100,${b.opacity * 1.4}), rgba(212,168,67,${b.opacity}), transparent 70%)`,
              filter: `blur(${b.size * 0.22}px)`,
            }}
              animate={{ y: [0, -30, 10, -20, 0], opacity: [b.opacity * 0.6, b.opacity, b.opacity * 0.8, b.opacity * 1.1, b.opacity * 0.6], scale: [0.95, 1.05, 0.98, 1.02, 0.95] }}
              transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>

        {/* Rising bubbles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const size = 4 + (i * 4.7 + 5) % 22
          const left = `${4 + (i * 11.3) % 90}%`
          const isRing = i % 4 === 2
          return (
            <motion.div key={`b-${i}`} style={{
              position: 'absolute', left, bottom: `-${size + 10}px`,
              width: size, height: size, borderRadius: '50%', zIndex: 5, pointerEvents: 'none',
              background: isRing ? 'transparent' : `radial-gradient(circle at 32% 28%, rgba(255,235,130,0.9), rgba(212,168,67,0.5) 50%, transparent)`,
              border: isRing ? `1px solid rgba(240,204,106,${0.25 + (i % 3) * 0.1})` : 'none',
            }}
              animate={{ y: [0, -(900 + size * 3)], opacity: [0, 0.85, 0.65, 0.1, 0], scale: [0.3, 1, 0.95, 0.3] }}
              transition={{ duration: 10 + (i * 1.6) % 12, delay: (i * 0.7) % 9, repeat: Infinity, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          )
        })}

        {/* Arch glow */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 65% at 52% 55%, rgba(200,155,70,0.07) 0%, transparent 70%)',
        }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — Hero
        ══════════════════════════════════════════════════════ */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 25,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          opacity: heroOpacity, y: heroY, scale: heroScale, filter: heroFilter,
        }}>
          <div style={{
            position: 'absolute', width: '70vw', height: '75vh', borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 52%, rgba(2,3,8,0.55) 0%, rgba(2,3,8,0.32) 38%, rgba(2,3,8,0.10) 65%, transparent 100%)',
            filter: 'blur(8px)', pointerEvents: 'none',
          }} />

          <div style={{ pointerEvents: 'auto', textAlign: 'center', maxWidth: '600px', width: '90%', position: 'relative', zIndex: 1 }}>

            {/* ── Hero title with Indian language cycling on proximity ── */}
            <motion.div
              style={{ margin: '0 0 16px 0' }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setLangNear(true)}
                onMouseLeave={() => setLangNear(false)}
              >

                {/* ── Language text ── */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    {langIndex === 0 ? (
                      /* ── English (default) ── */
                      <motion.h1
                        key="en"
                        style={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: 'clamp(50px, 6.5vw, 92px)',
                          fontWeight: 400, color: '#f5efe4',
                          lineHeight: 1.06, letterSpacing: '-0.025em',
                          margin: 0,
                          textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 50px rgba(0,0,0,0.7)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -8, transition: { duration: 0.13 } }}
                        transition={{ duration: 0.16 }}
                      >
                        <span>Reform with </span>
                        <span style={{
                          color: '#f5efe4',
                          textShadow: '0 0 48px rgba(245,239,228,0.65), 0 0 20px rgba(245,239,228,0.3), 0 2px 20px rgba(0,0,0,0.95)',
                        }}>AI.</span>
                      </motion.h1>
                    ) : (
                      /* ── Indian language variant ── */
                      <motion.div
                        key={`lang-${langIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div style={{
                          fontFamily: '"Cormorant Garamond", Georgia, "Noto Serif", serif',
                          fontSize: 'clamp(50px, 6.5vw, 92px)',
                          fontWeight: 400, color: '#f5efe4',
                          lineHeight: 1.06,
                          textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 50px rgba(0,0,0,0.7)',
                          textAlign: 'center',
                        }}>
                          {LANG_CYCLE[langIndex].text}
                        </div>
                        <div style={{
                          fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          color: 'rgba(212,168,67,0.62)', marginTop: '18px',
                          textAlign: 'center',
                        }}>
                          {LANG_CYCLE[langIndex].label}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '20px 0 16px 0' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.72 }}>
              <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.3)' }} />
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(212,168,67,0.6)' }} />
              <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.3)' }} />
            </motion.div>

            <motion.p style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 15.5px)',
              fontWeight: 400, color: 'rgba(230,215,195,0.92)',
              letterSpacing: '0.02em', lineHeight: 1.75, margin: '0 0 36px 0',
              textShadow: '0 1px 12px rgba(0,0,0,0.9)',
            }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.78 }}>
              Describe it. Upload it. Ask ARIA.<br />She finds it across thousands of brands.
            </motion.p>

            <motion.div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.95 }}>

              <MagneticBtn
                onClick={() => { playSoftClick(); scrollToAriaStage(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'linear-gradient(135deg, #e8ddd0 0%, #f0e4d4 100%)',
                  color: '#0a0a0a', border: 'none', borderRadius: '100px', padding: '14px 30px',
                  fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
                whileHover={{ scale: 1.06, boxShadow: '0 6px 32px rgba(0,0,0,0.5)' }}
                whileTap={{ scale: 0.97 }}>
                Discover with ARIA <span style={{ fontSize: '16px', fontWeight: 300 }}>+</span>
              </MagneticBtn>

              <MagneticBtn
                onClick={scrollToStoryStage}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(10,8,6,0.35)', border: '1px solid rgba(200,185,165,0.28)',
                  color: 'rgba(210,195,175,0.8)', borderRadius: '100px', padding: '13px 26px',
                  fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 500,
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                }}
                whileHover={{ color: '#e8ddd0', borderColor: 'rgba(212,168,67,0.5)', scale: 1.04 }}
                whileTap={{ scale: 0.97 }}>
                Explore Now
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.7 }}>
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticBtn>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div style={{ position: 'absolute', bottom: '36px', display: 'flex', alignItems: 'center', gap: '10px' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
            <motion.div style={{
              width: 26, height: 26, borderRadius: '50%',
              border: '1px solid rgba(200,185,165,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v8M1.5 5.5l3.5 3.5 3.5-3.5" stroke="rgba(200,185,165,0.4)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </motion.div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,185,165,0.3)' }}>
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — Meet ARIA
        ══════════════════════════════════════════════════════ */}
        <motion.div id="meet-aria" style={{
          position: 'absolute', inset: 0, zIndex: 24,
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'center',
          paddingTop: isMobile ? '72px' : 'clamp(40px, 6vh, 80px)',
          pointerEvents: 'none',
          filter: exitFilter,
        }}>
          <motion.div style={{
            pointerEvents: 'auto',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: '100%', maxWidth: '1100px',
            padding: isMobile ? '0 20px' : '0 clamp(48px, 7vw, 120px)',
            opacity: textOpacity, y: textY, scale: textScale,
          }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '680px', margin: '0 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', inset: '-26px -40px',
                    background: 'radial-gradient(ellipse at 35% 45%, rgba(4,7,18,0.92) 0%, rgba(4,7,18,0.74) 48%, rgba(4,7,18,0.12) 80%, transparent 88%)',
                    filter: 'blur(16px)', pointerEvents: 'none', zIndex: 0,
                  }} />
                  <h2 style={{
                    position: 'relative', zIndex: 1,
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: isMobile ? 'clamp(22px, 5vw, 34px)' : 'clamp(28px, 3.2vw, 48px)',
                    fontWeight: 400, color: '#f5efe4',
                    lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0,
                    textShadow: '0 2px 18px rgba(0,0,0,1), 0 10px 50px rgba(0,0,0,0.95)',
                    textAlign: 'center', whiteSpace: isMobile ? 'normal' : 'nowrap',
                  }}>
                    Tell{' '}
                    <span style={{
                      color: '#f7efe2',
                      textShadow: '0 0 22px rgba(245,239,228,0.42), 0 0 42px rgba(212,168,67,0.22), 0 2px 18px rgba(0,0,0,0.92)',
                    }}>
                      ARIA
                    </span>
                    {' '}what you’re looking for.
                  </h2>
                </div>

                <motion.div
                  animate={{
                    borderColor: searchFocused ? 'rgba(212,168,67,0.6)' : 'rgba(212,168,67,0.2)',
                    boxShadow: searchFocused
                      ? '0 0 28px rgba(212,168,67,0.18), inset 0 0 16px rgba(212,168,67,0.06)'
                      : '0 0 0px rgba(212,168,67,0)',
                  }}
                  transition={{ duration: 0.35 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: isMobile ? '12px 14px' : '16px 20px',
                    background: 'linear-gradient(180deg, rgba(10,12,20,0.86), rgba(18,20,30,0.74))',
                    border: '1px solid rgba(212,168,67,0.26)',
                    borderRadius: '28px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.32)',
                    backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                  }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,67,0.55)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', minWidth: 0 }}>
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      style={{
                        width: '100%', background: 'transparent', border: 'none', outline: 'none',
                        fontFamily: 'Inter, sans-serif', fontSize: '14px',
                        color: 'rgba(248,241,230,0.96)', caretColor: 'rgba(212,168,67,0.92)',
                      }}
                    />
                    {!input && (
                      <span style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        fontFamily: 'Inter, sans-serif', fontSize: '14px',
                        color: 'rgba(220,206,188,0.62)', pointerEvents: 'none',
                        whiteSpace: 'nowrap', overflow: 'hidden',
                      }}>
                        {typedText}
                        <span style={{
                          display: 'inline-block', width: '1.5px', height: '14px',
                          background: 'rgba(212,168,67,0.65)',
                          marginLeft: '1px', verticalAlign: 'middle',
                          opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s',
                        }} />
                      </span>
                    )}
                  </div>
                  <motion.button
                    onClick={() => playSoftClick()}
                    animate={{ boxShadow: ['0 0 0px rgba(212,168,67,0)', '0 0 16px rgba(212,168,67,0.38)', '0 0 0px rgba(212,168,67,0)'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)',
                      color: 'rgba(212,168,67,0.9)', padding: isMobile ? '8px 12px' : '9px 18px',
                      fontFamily: 'Inter, sans-serif', fontSize: isMobile ? '11px' : '10px', fontWeight: 600,
                      letterSpacing: isMobile ? '0' : '0.14em', textTransform: 'uppercase',
                      cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                    whileHover={{ background: 'rgba(212,168,67,0.28)', color: '#f0dfa0', scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}>
                    {isMobile ? null : 'Ask ARIA'}
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ fontSize: '13px' }}>→</motion.span>
                  </motion.button>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                  {suggestions.slice(0, 4).map((s, i) => (
                    <motion.button key={i} onClick={() => setInput(s)}
                      style={{
                        padding: isMobile ? '10px 12px' : '12px 16px', fontFamily: 'Inter, sans-serif', fontSize: isMobile ? '11px' : '12px',
                        background: 'rgba(10,12,18,0.72)', border: '1px solid rgba(212,168,67,0.20)',
                        color: 'rgba(230,219,201,0.82)', cursor: 'pointer', letterSpacing: '0.01em',
                        borderRadius: '18px',
                        textAlign: 'left',
                      }}
                      whileHover={{ background: 'rgba(212,168,67,0.12)', borderColor: 'rgba(212,168,67,0.4)', color: 'rgba(230,215,190,0.95)', scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}>
                      {s}
                    </motion.button>
                  ))}
                </div>

              </div>

            </div>

            <div style={{ width: '100%', marginTop: isMobile ? '12px' : '18px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 'min(100%, 840px)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { value: '10+', label: 'discovery feeds' },
                  { value: '24/7', label: 'style companion' },
                  { value: '1:1', label: 'taste learning' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="stat-shimmer"
                    style={{
                      minHeight: isMobile ? '70px' : '98px',
                      padding: isMobile ? '10px 10px 8px' : '14px 14px 12px',
                      borderRadius: isMobile ? '14px' : '20px',
                      background: 'linear-gradient(180deg, rgba(8,10,16,0.84), rgba(20,18,22,0.70))',
                      border: '1px solid rgba(212,168,67,0.16)',
                      boxShadow: '0 16px 44px rgba(0,0,0,0.24)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: isMobile ? '18px' : '24px',
                      color: '#f2e6d4',
                      lineHeight: 1,
                      marginBottom: isMobile ? '4px' : '6px',
                    }}>
                      {item.value}
                    </div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: isMobile ? '7px' : '9px',
                      color: 'rgba(223,209,191,0.66)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  )
}
