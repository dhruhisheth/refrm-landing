import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring } from 'framer-motion'

const suggestions = [
  'Find me a blazer for a gallery opening',
  'Something minimal, earthy tones, under ₹5000',
  'I want to dress like a Bombay architect',
  'Oversized fits with a clean edge',
  'Show me indie Indian labels',
]

const ariaStates = [
  { img: 'aria_search', text: 'Searching the REFRM universe...' },
  { img: 'aria_think',  text: 'Hmm, let me think...' },
  { img: 'aria_found',  text: "Found something you'll love!" },
  { img: 'aria_excited',text: "You're going to love this!" },
]

export default function MeetAria() {
  const [input, setInput]           = useState('')
  const [ariaImg, setAriaImg]       = useState('aria_main')
  const [bubble, setBubble]         = useState('Hi! Ask me anything about fashion.')
  const [currentSug, setCurrentSug] = useState(0)
  const [typedText, setTypedText]   = useState(suggestions[0])
  const [showCursor, setShowCursor] = useState(true)

  const sectionRef = useRef(null)
  const ariaRef    = useRef(null)
  const textRef    = useRef(null)

  const ariaInView = useInView(ariaRef, { once: true, margin: '-60px' })
  const textInView = useInView(textRef, { once: true, margin: '-60px' })

  // Scroll-driven parallax for ARIA rise
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })
  const rawAriaY      = useTransform(scrollYProgress, [0, 1], [140, 0])
  const rawTextY      = useTransform(scrollYProgress, [0, 1], [80,  0])
  const rawOpacity    = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  const ariaY         = useSpring(rawAriaY,     { stiffness: 60, damping: 22 })
  const textY         = useSpring(rawTextY,     { stiffness: 70, damping: 24 })
  const scrollOpacity = useSpring(rawOpacity,   { stiffness: 80, damping: 20 })

  // Cycle suggestions every 3s
  useEffect(() => {
    const t = setInterval(() => setCurrentSug(i => (i + 1) % suggestions.length), 3000)
    return () => clearInterval(t)
  }, [])

  // Typewriter effect when suggestion changes
  useEffect(() => {
    const target = suggestions[currentSug]
    setTypedText('')
    setShowCursor(true)
    let i = 0
    const t = setInterval(() => {
      i++
      setTypedText(target.slice(0, i))
      if (i >= target.length) clearInterval(t)
    }, 38)
    return () => clearInterval(t)
  }, [currentSug])


  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  const runSearch = (q) => {
    if (!q.trim()) return
    setInput(q)
    let step = 0
    const next = () => {
      if (step >= ariaStates.length) return
      setAriaImg(ariaStates[step].img)
      setBubble(ariaStates[step].text)
      step++
      if (step < ariaStates.length) setTimeout(next, 900)
    }
    next()
  }

  return (
    <section
      id="meet-aria"
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* ── Same fixed background as hero — no duplicate, no seam ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: 'url(/images/refrm2_final.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }} />

      {/* Slightly deeper overlay for depth differentiation */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(4,5,14,0.78)', pointerEvents: 'none' }} />

      {/* Bottom edge fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', zIndex: 3,
        background: 'linear-gradient(to top, rgba(4,5,14,1), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Warm arch glow — same as hero for continuity */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 50% 60% at 50% 60%, rgba(180,135,60,0.06) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 'clamp(40px, 6vw, 100px)',
        alignItems: 'center',
        padding: 'clamp(100px, 12vh, 160px) clamp(40px, 8vw, 120px) clamp(80px, 10vh, 120px)',
      }}>

        {/* ── LEFT: Text + Search ── */}
        <motion.div ref={textRef} style={{ y: textY, opacity: scrollOpacity }}>

          {/* Headline */}
          <motion.h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
              fontWeight: 400, color: '#f2ebe0',
              lineHeight: 1.1, letterSpacing: '-0.02em',
              margin: '0 0 20px 0',
              textShadow: '0 2px 24px rgba(0,0,0,0.8)',
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Say hello<br />to ARIA.
          </motion.h2>

          {/* Description */}
          <motion.p
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.05vw, 15px)',
              fontWeight: 300, color: 'rgba(210,195,175,0.75)',
              lineHeight: 1.8, maxWidth: 380, margin: '0 0 40px 0',
              textShadow: '0 1px 10px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Your AI fashion companion.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={textInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,168,67,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              marginBottom: '12px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(212,168,67,0.6)" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runSearch(input)}
                  style={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: 'Inter, sans-serif', fontSize: '13px',
                    color: 'rgba(240,230,210,0.9)', caretColor: 'rgba(212,168,67,0.8)',
                  }}
                />
                {/* Typewriter placeholder shown when input is empty */}
                {!input && (
                  <span style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    fontFamily: 'Inter, sans-serif', fontSize: '13px',
                    color: 'rgba(200,185,165,0.45)', pointerEvents: 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                  }}>
                    {typedText}
                    <span style={{
                      display: 'inline-block', width: '1.5px', height: '13px',
                      background: 'rgba(212,168,67,0.7)',
                      marginLeft: '1px', verticalAlign: 'middle',
                      opacity: showCursor ? 1 : 0,
                      transition: 'opacity 0.1s',
                    }} />
                  </span>
                )}
              </div>
              <motion.button
                onClick={() => runSearch(input)}
                style={{
                  background: 'rgba(212,168,67,0.15)',
                  border: '1px solid rgba(212,168,67,0.3)',
                  color: 'rgba(212,168,67,0.9)',
                  padding: '8px 16px',
                  fontFamily: 'Inter, sans-serif', fontSize: '10px',
                  fontWeight: 600, letterSpacing: '0.14em',
                  textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0,
                }}
                whileHover={{ background: 'rgba(212,168,67,0.25)', color: '#f0dfa0' }}
                whileTap={{ scale: 0.97 }}
              >
                Ask ARIA
              </motion.button>
            </div>

            {/* Suggestion chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {suggestions.slice(0, 4).map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => runSearch(s)}
                  style={{
                    padding: '6px 14px',
                    fontFamily: 'Inter, sans-serif', fontSize: '11px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(212,168,67,0.15)',
                    color: 'rgba(200,185,165,0.65)',
                    cursor: 'pointer', letterSpacing: '0.02em',
                  }}
                  whileHover={{
                    background: 'rgba(212,168,67,0.1)',
                    borderColor: 'rgba(212,168,67,0.35)',
                    color: 'rgba(230,215,190,0.9)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={textInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>


      </div>
    </section>
  )
}
