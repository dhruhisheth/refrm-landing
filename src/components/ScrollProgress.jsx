import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, zIndex: 9999, transformOrigin: '0%',
        background: 'linear-gradient(90deg, rgba(212,168,67,0.85) 0%, rgba(255,230,120,1) 50%, rgba(212,168,67,0.85) 100%)',
        scaleX,
      }}
    />
  )
}
