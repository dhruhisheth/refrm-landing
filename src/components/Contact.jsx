import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useIsMobile } from '../hooks/useIsMobile'

const PARTICLES = [
  { size: 5, left: '7%',  top: '16%', dur: 4.5, delay: 0.0 },
  { size: 3, left: '19%', top: '74%', dur: 5.2, delay: 0.6 },
  { size: 7, left: '76%', top: '22%', dur: 4.0, delay: 1.2 },
  { size: 4, left: '89%', top: '62%', dur: 5.8, delay: 0.3 },
  { size: 6, left: '44%', top: '84%', dur: 4.2, delay: 1.8 },
  { size: 3, left: '61%', top: '11%', dur: 5.5, delay: 0.9 },
  { size: 5, left: '32%', top: '52%', dur: 4.8, delay: 2.1 },
  { size: 4, left: '93%', top: '38%', dur: 5.0, delay: 0.4 },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const isMobile = useIsMobile()

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`REFRM message from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    )
    window.location.href = `mailto:admin@refrm.in?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  const baseInput = {
    background: 'rgba(255,255,255,0.65)',
    border: '1px solid rgba(56,56,56,0.12)',
    color: '#383838',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    padding: '13px 16px',
    backdropFilter: 'blur(8px)',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
  }

  const focusInput = (e) => {
    e.target.style.borderColor = '#4D5C60'
    e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.04), 0 0 0 3px rgba(77,92,96,0.1)'
  }
  const blurInput = (e) => {
    e.target.style.borderColor = 'rgba(56,56,56,0.12)'
    e.target.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.04)'
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        background: '#E7F0CC',
        padding: isMobile ? '80px 24px' : '112px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Large REFRM watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: '"Playfair Display", serif',
        fontSize: 'clamp(80px, 20vw, 260px)',
        fontWeight: 500, letterSpacing: '-0.04em',
        color: 'rgba(56,56,56,0.038)',
        userSelect: 'none', pointerEvents: 'none',
        whiteSpace: 'nowrap', zIndex: 0, lineHeight: 1,
      }}>
        REFRM
      </div>

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: p.size, height: p.size, borderRadius: '50%',
            background: 'rgba(77,92,96,0.22)',
            left: p.left, top: p.top,
            zIndex: 0, pointerEvents: 'none',
          }}
          animate={{ y: [0, -(16 + p.size * 2), 0], opacity: [0.18, 0.55, 0.18] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 1,
        background: 'linear-gradient(90deg, transparent, rgba(77,92,96,0.28), rgba(77,92,96,0.28), transparent)',
      }} />

      {/* Content — above decorative layer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>

          <motion.h2
            style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 400, color: '#383838', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '16px', textAlign: 'center' }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Let&#39;s talk.
          </motion.h2>

          <motion.p
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', lineHeight: 1.7, color: '#525266', marginBottom: '48px', textAlign: 'center' }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Partner with us, press inquiries, or just say hello — we love hearing from people who care about fashion.
          </motion.p>

          {submitted ? (
            <motion.div
              style={{ padding: '48px 0', textAlign: 'center' }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', color: '#383838', marginBottom: '10px' }}>Thank you.</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#525266' }}>ARIA will be in touch soon.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <input
                  type="text" placeholder="Your name" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={baseInput} onFocus={focusInput} onBlur={blurInput}
                />
                <input
                  type="email" placeholder="Your email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={baseInput} onFocus={focusInput} onBlur={blurInput}
                />
              </div>
              <textarea
                placeholder="What's on your mind?" required rows={5} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...baseInput, resize: 'none' }}
                onFocus={focusInput} onBlur={blurInput}
              />
              <motion.button
                type="submit"
                style={{
                  position: 'relative', overflow: 'hidden',
                  alignSelf: isMobile ? 'stretch' : 'flex-start',
                  padding: '14px 32px', textAlign: 'center',
                  background: '#383838', color: '#E7F0CC', border: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                }}
                whileHover={{ background: '#4D5C60', scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  style={{
                    position: 'absolute', top: 0, bottom: 0, width: '40%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)',
                    pointerEvents: 'none',
                  }}
                  animate={{ left: ['-45%', '130%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
                />
                Send Message
              </motion.button>
            </motion.form>
          )}
        </div>

        {/* Footer */}
        <motion.div
          style={{
            marginTop: '96px', paddingTop: '32px',
            borderTop: '1px solid rgba(56,56,56,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', fontWeight: 400, color: '#383838', letterSpacing: '0.02em' }}>REFRM</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#525266', letterSpacing: '0.12em' }}>Reform with AI</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(56,56,56,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            &copy; 2026 REFRM. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/refrm.in/?hl=en' },
              { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/admin-undefined-048061404/' },
              { label: 'Email',     href: 'mailto:admin@refrm.in' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(56,56,56,0.45)', cursor: 'pointer', textDecoration: 'none' }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
