import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'

const products = []


function Product({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{
      position: 'absolute', ...item.pos, zIndex: 20, width: item.width,
      mixBlendMode: 'screen',
    }}>
      <motion.div
        style={{ willChange: 'transform', cursor: 'pointer' }}
        initial={{ scale: 0.72, y: 45 }}
        animate={{ scale: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
        transition={{ duration: 1.1, delay: item.enter, ease: [0.16, 1, 0.3, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <motion.img
          src={item.src}
          alt={item.alt}
          style={{
            width: '100%', height: 'auto', objectFit: 'contain', display: 'block',
            filter: hovered
              ? 'drop-shadow(0 0 28px rgba(212,168,67,0.7)) drop-shadow(0 20px 40px rgba(0,0,0,0.6)) brightness(1.25)'
              : 'drop-shadow(0 18px 36px rgba(0,0,0,0.55)) brightness(1.1)',
            transition: 'filter 0.35s ease',
          }}
          animate={{ y: item.float.y, rotate: item.float.rotate }}
          transition={{ duration: item.float.duration, delay: item.float.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Golden ring on hover */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(212,168,67,0.6)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.05 : 0.9 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const cursorX = useMotionValue(-400)
  const cursorY = useMotionValue(-400)
  const smCurX  = useSpring(cursorX, { stiffness: 90, damping: 18 })
  const smCurY  = useSpring(cursorY, { stiffness: 90, damping: 18 })

  // Scroll-driven fade-out of hero content
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const contentY       = useTransform(scrollYProgress, [0, 0.55], [0, -60])

  const handleMouseMove = (e) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
    >
      {/* ── LAYER 1: Fixed background — stays static on scroll ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: 'url(/images/refrm2_final.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }} />

      {/* ── CURSOR SPOTLIGHT ── */}
      <motion.div
        style={{
          position: 'absolute',
          zIndex: 6,
          pointerEvents: 'none',
          width: 480,
          height: 480,
          borderRadius: '50%',
          x: smCurX,
          y: smCurY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(200,160,80,0.10) 0%, rgba(200,160,80,0.04) 40%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />

      {/* ── LAYER 2: Left-heavy dark gradient ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'rgba(5,7,18,0.52)',
      }} />

      {/* ── LAYER 2.5: Cinematic golden bokeh + bubbles ── */}

      {/* Large blurred bokeh orbs — deep background depth */}
      {[
        { size: 180, left: '12%',  bottom: '8%',  dur: 22, delay: 0,   opacity: 0.07 },
        { size: 240, left: '68%',  bottom: '5%',  dur: 28, delay: 3,   opacity: 0.055 },
        { size: 140, left: '38%',  bottom: '12%', dur: 18, delay: 6,   opacity: 0.08 },
        { size: 200, left: '82%',  bottom: '20%', dur: 25, delay: 1.5, opacity: 0.05 },
        { size: 120, left: '5%',   bottom: '35%', dur: 20, delay: 8,   opacity: 0.06 },
        { size: 160, left: '52%',  bottom: '55%', dur: 30, delay: 4,   opacity: 0.04 },
      ].map((b, i) => (
        <motion.div
          key={`bokeh-${i}`}
          style={{
            position: 'absolute',
            left: b.left,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            zIndex: 4,
            pointerEvents: 'none',
            background: `radial-gradient(circle at 38% 32%, rgba(255,220,100,${b.opacity * 1.4}), rgba(212,168,67,${b.opacity}), transparent 70%)`,
            filter: `blur(${b.size * 0.22}px)`,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            opacity: [b.opacity * 0.6, b.opacity, b.opacity * 0.8, b.opacity * 1.1, b.opacity * 0.6],
            scale: [0.95, 1.05, 0.98, 1.02, 0.95],
          }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Rising crisp bubbles — foreground */}
      {Array.from({ length: 28 }).map((_, i) => {
        const size   = 4 + (i * 4.7 + 5) % 22
        const left   = `${4 + (i * 11.3) % 90}%`
        const delay  = (i * 0.7) % 9
        const dur    = 10 + (i * 1.6) % 12
        const isRing = i % 4 === 2
        const blur   = i % 5 === 0 ? 1.5 : 0
        return (
          <motion.div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              left,
              bottom: `-${size + 10}px`,
              width: size,
              height: size,
              borderRadius: '50%',
              zIndex: 5,
              pointerEvents: 'none',
              filter: blur ? `blur(${blur}px)` : 'none',
              background: isRing
                ? 'transparent'
                : `radial-gradient(circle at 32% 28%, rgba(255,235,130,0.9), rgba(212,168,67,0.5) 50%, rgba(160,110,20,0.15) 80%, transparent)`,
              border: isRing
                ? `1px solid rgba(240,204,106,${0.25 + (i % 3) * 0.1})`
                : 'none',
              boxShadow: isRing
                ? `inset 0 0 ${size * 0.4}px rgba(240,204,106,0.1), 0 0 ${size * 0.8}px rgba(212,168,67,0.12)`
                : `0 0 ${size * 1.2}px rgba(212,168,67,0.3), 0 0 ${size * 0.4}px rgba(255,220,100,0.4)`,
            }}
            animate={{
              y: [0, -(900 + size * 3)],
              x: [0, (i % 2 === 0 ? 24 : -24), (i % 2 === 0 ? -14 : 14), (i % 2 === 0 ? 8 : -8), 0],
              opacity: [0, 0.85, 0.65, 0.4, 0.1, 0],
              scale: [0.3, 1, 1.05, 0.95, 0.7, 0.3],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.15, 0.4, 0.65, 0.85, 1],
            }}
          />
        )
      })}

      {/* Gold light streaks / lens flares */}
      {[
        { left: '22%', top: '60%', w: 1, h: 80,  rotate: -30, delay: 2,   dur: 5 },
        { left: '74%', top: '40%', w: 1, h: 60,  rotate: 20,  delay: 0,   dur: 4 },
        { left: '45%', top: '75%', w: 1, h: 100, rotate: -10, delay: 3.5, dur: 6 },
        { left: '88%', top: '55%', w: 1, h: 50,  rotate: 35,  delay: 1,   dur: 4.5 },
      ].map((s, i) => (
        <motion.div
          key={`streak-${i}`}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.w,
            height: s.h,
            rotate: s.rotate,
            zIndex: 4,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, transparent, rgba(240,204,106,0.35), transparent)',
            filter: 'blur(0.5px)',
          }}
          animate={{ opacity: [0, 0.6, 0], scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── LAYER 2.8: Warm arch glow vignette ── */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 65% at 52% 55%, rgba(200,155,70,0.07) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── LAYER 3: Top & bottom edge fades ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '18%', zIndex: 3,
        background: 'linear-gradient(to bottom, rgba(5,7,18,0.6), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', zIndex: 3,
        background: 'linear-gradient(to top, rgba(4,5,14,1) 0%, rgba(4,5,14,0.6) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── LAYER 5: Floating products ── */}
      {products.map(p => <Product key={p.id} item={p} />)}

      {/* ── LAYER 6: Text — centered overlay, fades out on scroll ── */}
      <motion.div style={{
        position: 'absolute', inset: 0,
        zIndex: 25,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
        opacity: contentOpacity,
        y: contentY,
      }}>
        {/* Soft dark radial haze behind text — no hard box, just a natural shadow */}
        <div style={{
          position: 'absolute',
          width: '70vw', height: '75vh',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 52%, rgba(2,3,8,0.72) 0%, rgba(2,3,8,0.48) 38%, rgba(2,3,8,0.18) 65%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(8px)',
        }} />

        <div style={{ pointerEvents: 'auto', textAlign: 'center', maxWidth: '580px', width: '90%', position: 'relative', zIndex: 1 }}>

          {/* Main headline */}
          <motion.h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(50px, 6.5vw, 92px)',
              fontWeight: 400,
              color: '#f5efe4',
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              margin: '0 0 16px 0',
              textShadow: '0 2px 20px rgba(0,0,0,0.95), 0 4px 50px rgba(0,0,0,0.7)',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Reform{' '}
            <span style={{
              background: 'linear-gradient(130deg, #d4c08a 0%, #a8905a 45%, #c8b07a 80%, #d4c08a 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 18px rgba(180,155,90,0.4))',
            }}>with AI.</span>
          </motion.h1>

          {/* Divider */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 16px 0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.72 }}
          >
            <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.3)' }} />
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(212,168,67,0.6)' }} />
            <div style={{ height: 1, width: 36, background: 'rgba(212,168,67,0.3)' }} />
          </motion.div>

          {/* Sub-tagline */}
          <motion.p
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.1vw, 15.5px)',
              fontWeight: 400, color: 'rgba(230,215,195,0.92)',
              letterSpacing: '0.02em', lineHeight: 1.75,
              margin: '0 0 36px 0',
              textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 2px 30px rgba(0,0,0,0.6)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.78 }}
          >
            Describe it. Upload it. Ask ARIA.<br />She finds it across thousands of brands.
          </motion.p>

          {/* CTAs */}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
          >
            <motion.button
              onClick={() => document.querySelector('#meet-aria')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, #e8ddd0 0%, #f0e4d4 100%)',
                color: '#0a0a0a', border: 'none',
                borderRadius: '100px', padding: '14px 30px',
                fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 600,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 2px 12px rgba(212,168,67,0.15)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 32px rgba(0,0,0,0.5), 0 4px 20px rgba(212,168,67,0.3)' }}
              whileTap={{ scale: 0.97 }}
            >
              Discover with ARIA
              <span style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1 }}>+</span>
            </motion.button>

            <motion.button
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(10, 8, 6, 0.35)',
                border: '1px solid rgba(200,185,165,0.28)',
                color: 'rgba(210,195,175,0.8)',
                borderRadius: '100px', padding: '13px 26px',
                fontFamily: 'Inter, sans-serif', fontSize: '10.5px', fontWeight: 500,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              whileHover={{
                color: '#e8ddd0',
                borderColor: 'rgba(212,168,67,0.4)',
                background: 'rgba(10,8,6,0.5)',
                scale: 1.03,
              }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Now
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.7 }}>
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute', bottom: '36px',
            display: 'flex', alignItems: 'center', gap: '10px',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.div
            style={{
              width: 26, height: 26, borderRadius: '50%',
              border: '1px solid rgba(200,185,165,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1.5 5.5l3.5 3.5 3.5-3.5" stroke="rgba(200,185,165,0.4)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </motion.div>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(200,185,165,0.3)',
          }}>Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
