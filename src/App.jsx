import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import HeroAria from './components/HeroAria'
import About from './components/About'
import Contact from './components/Contact'
import CursorSparkles from './components/CursorSparkles'
import AmbientMusic from './components/AmbientMusic'
import ScrollProgress from './components/ScrollProgress'
import MusicPrompt from './components/MusicPrompt'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <ScrollProgress />
      <CursorSparkles />
      <AmbientMusic hidden={loading} />
      <MusicPrompt />

      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              backgroundImage: 'url(/images/refrm2_final.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              background: 'rgba(5,7,18,0.62)',
              pointerEvents: 'none',
            }}
          />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 1 }}>
            <HeroAria />
            <About />
            <Contact />
          </main>
        </>
      )}
    </>
  )
}
