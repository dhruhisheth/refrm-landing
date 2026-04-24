import React, { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValue, useInView } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

function MobileCard({ card, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,252,245,0.07)',
        border: '1px solid rgba(232,218,196,0.13)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '35%', background: 'linear-gradient(220deg, rgba(232,218,196,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,218,196,0.78)' }}>{card.tag}</span>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '10px', color: 'rgba(232,218,196,0.26)' }}>{card.num}</span>
      </div>
      <div style={{ height: 1, background: 'linear-gradient(to right, rgba(232,218,196,0.13), transparent)', marginBottom: '14px' }} />
      <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 400, color: '#f0e8d8', lineHeight: 1.22, letterSpacing: '-0.015em', margin: '0 0 6px 0', whiteSpace: 'pre-line' }}>{card.headline}</h3>
      <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '11.5px', fontStyle: 'italic', color: 'rgba(232,218,196,0.78)', opacity: 0.88 }}>{card.sub}</span>
      <div style={{ height: 1, background: 'rgba(232,218,196,0.1)', margin: '12px 0' }} />
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 400, color: 'rgba(215,200,175,0.65)', lineHeight: 1.72, margin: 0 }}>{card.body}</p>
      <div style={{ marginTop: '12px', height: '1.5px', borderRadius: '2px', background: 'linear-gradient(90deg, rgba(232,218,196,0.26), transparent)' }} />
    </motion.div>
  )
}

function MobileAbout() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div id="about" style={{ position: 'relative', zIndex: 20, padding: '80px 24px' }}>
      <motion.div
        ref={ref}
        style={{ textAlign: 'center', marginBottom: '40px' }}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.28)' }} />
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(212,168,67,0.55)' }} />
          <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.28)' }} />
        </div>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: 400, color: '#f2ebe0', lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
          The Story of REFRM
        </h2>
      </motion.div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: 480, margin: '0 auto' }}>
        {CARDS.map((card, i) => <MobileCard key={i} card={card} index={i} />)}
      </div>
    </div>
  )
}

function TiltCard({ children, style }) {
  const ref = useRef(null)
  const glowRef = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sprx = useSpring(rx, { stiffness: 200, damping: 24 })
  const spry = useSpring(ry, { stiffness: 200, damping: 24 })

  const onMove = (e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    ry.set((x - 0.5) * 18)
    rx.set((0.5 - y) * 18)
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(212,168,67,0.2) 0%, transparent 62%)`
    }
  }

  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    if (glowRef.current) glowRef.current.style.background = 'none'
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX: sprx, rotateY: spry, transformPerspective: 900 }}
      whileHover={{ scale: 1.04, boxShadow: '0 32px 80px rgba(0,0,0,0.62), 0 4px 24px rgba(212,168,67,0.2)', transition: { duration: 0.28 } }}
    >
      <div ref={glowRef} style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }} />
      {children}
    </motion.div>
  )
}

const CARD_W = 285
const CARD_H = 395
const CARD_TOP = 150

const ACCENT = {
  tag:    'rgba(232,218,196,0.78)',
  border: 'rgba(232,218,196,0.13)',
  num:    'rgba(232,218,196,0.26)',
  bar:    'rgba(232,218,196,0.26)',
  corner: 'rgba(232,218,196,0.05)',
}

const CARDS = [
  {
    tag: 'Our Story', num: '01',
    headline: 'Three fashion lovers.\nOne stubborn idea.',
    sub: 'Still building.',
    body: 'We spent years searching for a tool that understood personal style, not just trends. REFRM is that tool. Built for India — powered by AI that actually listens.',
  },
  {
    tag: 'The Problem', num: '02',
    headline: 'Great products.\nWrong platform.\nWrong algorithm.',
    sub: 'On both sides.',
    body: 'Consumers see the same 30 brands on repeat while indie labels reach nobody. Keyword search can\'t understand taste. Commission models punish small brands.',
  },
  {
    tag: 'ARIA — AI by REFRM', num: '03',
    headline: 'Not a search bar.\nA companion who\nknows your style.',
    sub: 'Deeply.',
    body: 'Text it, photograph it, speak it — ARIA finds it. She learns your color season, saved history, and occasions. She gets sharper with every single interaction.',
  },
  {
    tag: 'The Experience', num: '04',
    headline: 'Personalized\nfeeds. Filtered\nfor your taste.',
    sub: 'Always evolving.',
    body: "Trend Drops. Hidden Gems. Occasion Edit. Rising Brands. Each tab is shaped by your behavior — so your REFRM looks nothing like anyone else's.",
  },
  {
    tag: 'For Brands', num: '05',
    headline: 'Your customers.\nYour story.',
    sub: 'No exceptions. No hidden cuts.',
    body: 'List free. Pay only when ARIA sends a shopper your way. A Jaipur handloom brand gets the same stage as a global label.',
  },
  {
    tag: 'Our Mission', num: '06',
    headline: 'Establishing Fashion\nAI in India.',
    sub: "That's the reform.",
    body: 'India has centuries of world class craft and a generation of consumers who want to find it. REFRM is the discovery layer that connects both sides.',
  },
]

export default function About() {
  const isMobile = useIsMobile()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const sp = useSpring(scrollYProgress, { stiffness: 70, damping: 28, restDelta: 0.001 })
  // Clamp all card animations to first 65% of scroll — leaves 35% (~150vh) where all 6 cards stay visible
  const animSp = useTransform(animSp, [0, 0.65], [0, 1])

  const titleOpacity = useTransform(animSp, [0.0, 0.06, 0.18, 0.24], [0, 1, 1, 0])
  const titleY = useTransform(animSp, [0.0, 0.06, 0.24], [28, 0, -26])
  const titleScale = useTransform(animSp, [0.0, 0.06, 0.24], [0.97, 1, 0.98])

  const sceneOpacity = useTransform(animSp, [0.20, 0.30], [0, 1])
  const sceneY = useTransform(animSp, [0.20, 0.30], [55, 0])
  const sceneScale = useTransform(animSp, [0.20, 0.30], [0.96, 1])

  // Deck placeholder
  const deckOpacity = useTransform(animSp, [0.24, 0.32, 0.42], [0, 0.45, 0])
  const deckY = useTransform(animSp, [0.24, 0.42], [120, 0])
  const deckScale = useTransform(animSp, [0.24, 0.42], [0.92, 1])

  // 6 cards — 2 rows × 3 columns
  const c0Op  = useTransform(animSp, [0.26, 0.34], [0, 1])
  const c0X   = useTransform(animSp, [0.26, 0.43], [0, -368])
  const c0Y   = useTransform(animSp, [0.26, 0.43], [60, -82])
  const c0R   = useTransform(animSp, [0.26, 0.43], [0, -10])
  const c0Sc  = useTransform(animSp, [0.26, 0.43], [0.82, 1])

  const c1Op  = useTransform(animSp, [0.35, 0.43], [0, 1])
  const c1X   = useTransform(animSp, [0.35, 0.52], [0, 0])
  const c1Y   = useTransform(animSp, [0.35, 0.52], [60, -86])
  const c1R   = useTransform(animSp, [0.35, 0.52], [0, 2])
  const c1Sc  = useTransform(animSp, [0.35, 0.52], [0.82, 1])

  const c2Op  = useTransform(animSp, [0.44, 0.52], [0, 1])
  const c2X   = useTransform(animSp, [0.44, 0.61], [0, 368])
  const c2Y   = useTransform(animSp, [0.44, 0.61], [60, -80])
  const c2R   = useTransform(animSp, [0.44, 0.61], [0, 9])
  const c2Sc  = useTransform(animSp, [0.44, 0.61], [0.82, 1])

  const c3Op  = useTransform(animSp, [0.58, 0.66], [0, 1])
  const c3X   = useTransform(animSp, [0.58, 0.75], [0, -368])
  const c3Y   = useTransform(animSp, [0.58, 0.75], [60, 318])
  const c3R   = useTransform(animSp, [0.58, 0.75], [0, 8])
  const c3Sc  = useTransform(animSp, [0.58, 0.75], [0.82, 1])

  const c4Op  = useTransform(animSp, [0.67, 0.75], [0, 1])
  const c4X   = useTransform(animSp, [0.67, 0.84], [0, 0])
  const c4Y   = useTransform(animSp, [0.67, 0.84], [60, 322])
  const c4R   = useTransform(animSp, [0.67, 0.84], [0, -4])
  const c4Sc  = useTransform(animSp, [0.67, 0.84], [0.82, 1])

  const c5Op  = useTransform(animSp, [0.76, 0.84], [0, 1])
  const c5X   = useTransform(animSp, [0.76, 0.93], [0, 368])
  const c5Y   = useTransform(animSp, [0.76, 0.93], [60, 320])
  const c5R   = useTransform(animSp, [0.76, 0.93], [0, -11])
  const c5Sc  = useTransform(animSp, [0.76, 0.93], [0.82, 1])

  const cardMotion = [
    { x: c0X, y: c0Y, rotate: c0R, opacity: c0Op, scale: c0Sc },
    { x: c1X, y: c1Y, rotate: c1R, opacity: c1Op, scale: c1Sc },
    { x: c2X, y: c2Y, rotate: c2R, opacity: c2Op, scale: c2Sc },
    { x: c3X, y: c3Y, rotate: c3R, opacity: c3Op, scale: c3Sc },
    { x: c4X, y: c4Y, rotate: c4R, opacity: c4Op, scale: c4Sc },
    { x: c5X, y: c5Y, rotate: c5R, opacity: c5Op, scale: c5Sc },
  ]

  if (isMobile) return <MobileAbout />

  return (
    <div ref={containerRef} id="about" style={{ height: '530vh', position: 'relative', zIndex: 20 }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 20 }}>

        {/* Arch glow */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 60% at 50% 55%, rgba(180,135,60,0.06) 0%, transparent 70%)',
        }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          opacity: titleOpacity, y: titleY, scale: titleScale,
          pointerEvents: 'none',
        }}>
          <div style={{ width: '100%', maxWidth: '860px', padding: '0 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.28)' }} />
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(212,168,67,0.55)' }} />
              <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.28)' }} />
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(38px, 5vw, 74px)',
              fontWeight: 400,
              color: '#f2ebe0',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              margin: 0,
              textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 4px 48px rgba(0,0,0,0.7)',
            }}>
              The Story of REFRM
            </h2>
          </div>
        </motion.div>

        {/* ── Card stage — centered in viewport ── */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: sceneOpacity, y: sceneY, scale: sceneScale,
        }}>
          <div style={{ position: 'relative', width: '100%', height: `${CARD_H * 2 + 80}px`, overflow: 'visible' }}>

            {/* Deck placeholder */}
            <motion.div style={{
              position: 'absolute',
              left: `calc(50% - ${CARD_W / 2}px)`,
              top: `${CARD_TOP}px`,
              width: CARD_W, height: CARD_H,
              opacity: deckOpacity, y: deckY, scale: deckScale, zIndex: 0,
              pointerEvents: 'none',
            }}>
              {[3, 2, 1].map(j => (
                <div key={j} style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,252,245,0.06)',
                  border: '1px solid rgba(232,218,196,0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  transform: `translate(${(j - 2) * 5}px, ${-(j - 1) * 5}px) rotate(${(j - 2) * 2.2}deg)`,
                }} />
              ))}
              <div style={{
                position: 'absolute', bottom: 18, left: 0, right: 0,
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif', fontSize: '8px', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(232,218,196,0.35)',
              }}>Scroll to reveal</div>
            </motion.div>

            {/* Dealt cards */}
            {CARDS.map((card, i) => (
              <motion.div key={i} style={{
                position: 'absolute',
                left: `calc(50% - ${CARD_W / 2}px)`,
                top: `${CARD_TOP}px`,
                width: CARD_W, height: CARD_H,
                x: cardMotion[i].x,
                y: cardMotion[i].y,
                rotate: cardMotion[i].rotate,
                opacity: cardMotion[i].opacity,
                scale: cardMotion[i].scale,
                zIndex: i + 1,
              }}>
                <TiltCard style={{
                  width: '100%', height: '100%',
                  background: 'rgba(255,252,245,0.07)',
                  border: `1px solid ${ACCENT.border}`,
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  padding: '24px 22px',
                  display: 'flex', flexDirection: 'column',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  position: 'relative',
                }}>

                  {/* Corner accent */}
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '55%', height: '38%',
                    background: `linear-gradient(220deg, ${ACCENT.corner} 0%, transparent 65%)`,
                    pointerEvents: 'none',
                  }} />

                  {/* Tag row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '7.5px', fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: ACCENT.tag,
                    }}>{card.tag}</span>
                    <span style={{
                      fontFamily: '"Playfair Display", serif', fontSize: '10px',
                      color: ACCENT.num, letterSpacing: '0.04em',
                    }}>{card.num}</span>
                  </div>

                  {/* Accent line */}
                  <div style={{
                    height: '1px', margin: '12px 0',
                    background: `linear-gradient(to right, ${ACCENT.border}, transparent)`,
                    position: 'relative', zIndex: 1,
                  }} />

                  {/* Headline */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '20px', fontWeight: 400, color: '#f0e8d8',
                      lineHeight: 1.22, letterSpacing: '-0.015em',
                      margin: '0 0 8px 0', whiteSpace: 'pre-line',
                      textShadow: '0 1px 8px rgba(0,0,0,0.6)',
                    }}>{card.headline}</h3>
                    <span style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '11.5px', fontStyle: 'italic',
                      color: ACCENT.tag, opacity: 0.88,
                    }}>{card.sub}</span>
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: '1px', background: 'rgba(232,218,196,0.1)',
                    margin: '12px 0', position: 'relative', zIndex: 1,
                  }} />

                  {/* Body */}
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 400,
                    color: 'rgba(215,200,175,0.60)', lineHeight: 1.72,
                    margin: 0, letterSpacing: '0.01em', position: 'relative', zIndex: 1,
                  }}>{card.body}</p>

                  {/* Bottom bar */}
                  <div style={{
                    marginTop: '12px', height: '1.5px', borderRadius: '2px',
                    background: `linear-gradient(90deg, ${ACCENT.bar}, transparent)`,
                    position: 'relative', zIndex: 1,
                  }} />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </div>
  )
}
