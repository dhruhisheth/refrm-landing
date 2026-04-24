import { useEffect, useRef, useCallback } from 'react'

const COLORS = ['#D1E0DE', '#E7F0CC', '#4D5C60', 'rgba(255,255,255,0.8)', '#525266']

export default function CursorSparkles() {
  const containerRef = useRef(null)

  const spawn = useCallback((x, y) => {
    if (!containerRef.current) return
    const count = Math.floor(Math.random() * 2) + 1
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      const size = Math.random() * 7 + 3
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 36 + 12
      const dx = Math.cos(angle) * dist
      const dy = Math.sin(angle) * dist
      const rot = Math.random() * 180

      el.style.cssText = `
        position:fixed;
        left:${x}px;
        top:${y}px;
        width:${size}px;
        height:${size}px;
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
      `
      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 0 L5.6 4.4 L10 5 L5.6 5.6 L5 10 L4.4 5.6 L0 5 L4.4 4.4 Z" fill="${color}"/>
      </svg>`

      containerRef.current.appendChild(el)

      el.animate(
        [
          { transform: `translate(-50%,-50%) scale(0) rotate(0deg)`, opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rot}deg)`, opacity: 0 },
        ],
        { duration: 550 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' }
      ).onfinish = () => el.remove()
    }
  }, [])

  useEffect(() => {
    let last = 0
    const onMove = (e) => {
      const now = Date.now()
      if (now - last < 45) return
      last = now
      if (Math.random() < 0.5) spawn(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [spawn])

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}
