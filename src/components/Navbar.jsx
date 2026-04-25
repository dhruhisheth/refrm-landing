import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const menuLinks = [
  { label: 'Home',       id: '#hero-aria', stage: 'home' },
  { label: 'Meet Aria',  id: '#hero-aria', stage: 'meet' },
  { label: 'About Us',   id: '#about',     stage: 'about' },
  { label: 'Message Us', id: '#contact',   stage: 'contact' },
]

function RMark() {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <span
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '28px',
          fontWeight: 500,
          color: '#e8ddd0',
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        R
      </span>
      <span
        style={{
          position: 'absolute',
          bottom: '-3px',
          right: '-7px',
          fontSize: '8px',
          color: '#4D5C60',
          lineHeight: 1,
        }}
      >
        ✦
      </span>
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id, stage) => {
    const el = document.querySelector(id)
    if (!el) return

    if (id === '#hero-aria') {
      const rect = el.getBoundingClientRect()
      const totalScroll = Math.max(el.offsetHeight - window.innerHeight, 0)
      const progress = stage === 'meet' ? 0.55 : 0
      window.scrollTo({
        top: window.scrollY + rect.top + totalScroll * progress,
        behavior: 'smooth',
      })
      setMenuOpen(false)
      return
    }

    if (id === '#about') {
      const rect = el.getBoundingClientRect()
      const totalScroll = Math.max(el.offsetHeight - window.innerHeight, 0)
      window.scrollTo({
        top: window.scrollY + rect.top + totalScroll * 0.08,
        behavior: 'smooth',
      })
      setMenuOpen(false)
      return
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-2"
        style={{
          background: scrolled ? 'rgba(7,11,21,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.4s ease',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left: hamburger + R mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            aria-label="Menu"
          >
            <motion.span
              style={{ display: 'block', width: 22, height: 1, background: '#e8ddd0', transformOrigin: 'center' }}
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ display: 'block', width: 15, height: 1, background: '#e8ddd0' }}
              animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ display: 'block', width: 22, height: 1, background: '#e8ddd0', transformOrigin: 'center' }}
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>

          <button
            onClick={() => scrollTo('#hero-aria', 'home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}
          >
            <RMark />
          </button>
        </div>

        {/* Right: Try REFRM */}
        <div style={{ position: 'relative' }}>
          {/* Outer pulse ring */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '100px',
              border: '1.5px solid rgba(232,221,208,0.35)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Second slower ring */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -7,
              borderRadius: '100px',
              border: '1px solid rgba(212,168,67,0.2)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          <motion.button
            onClick={() => window.location.href = 'mailto:admin@refrm.in'}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: '#e8ddd0',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '100px',
              padding: '7px 22px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{
              background: '#f8f0e6',
              scale: 1.07,
              transition: { duration: 0.22 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Shimmer sweep */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0, bottom: 0,
                width: '40%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                borderRadius: '100px',
                pointerEvents: 'none',
              }}
              animate={{ left: ['-45%', '130%'] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
            />
            Connect with Us
            <motion.span
              style={{ fontSize: '14px', lineHeight: 1, display: 'inline-block' }}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            >
              →
            </motion.span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 35,
              background: 'rgba(8,8,8,0.97)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: isMobile ? '0 28px' : '0 80px',
            }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Decorative R watermark */}
            <div
              style={{
                position: 'absolute',
                right: '8%',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '28vw',
                fontWeight: 500,
                color: 'rgba(232,221,208,0.03)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              R
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {menuLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.id, link.stage)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                    fontWeight: 400,
                    color: '#e8ddd0',
                    cursor: 'pointer',
                    lineHeight: 1.15,
                    padding: '8px 0',
                    letterSpacing: '-0.01em',
                  }}
                  initial={{ opacity: 0, x: -48 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: 'easeOut' }}
                  whileHover={{ x: 20, color: '#E7F0CC', transition: { duration: 0.2 } }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              style={{
                position: 'absolute',
                bottom: '40px',
                left: isMobile ? '28px' : '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '13px', color: 'rgba(200,185,165,0.35)', letterSpacing: '0.05em' }}>
                Reform with AI
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(200,185,165,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                refrm.in
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
