"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, suffix: string = "+") {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(countRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return { count, countRef }
}

export default function Stats() {
  const stat1 = useCountUp(60, 2000, "+")
  const stat2 = useCountUp(15000, 2500, "+")
  const stat3 = useCountUp(15, 2000, "+")
  const stat4 = useCountUp(200, 2000, "+")

  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* STAT 1 - Years of Excellence */}
          <div className="text-center" ref={stat1.countRef}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              {stat1.count}+
            </div>
            <div className="text-white/80 text-sm md:text-base font-light">
              Years of Excellence
            </div>
          </div>

          {/* STAT 2 - Alumni Worldwide */}
          <div className="text-center" ref={stat2.countRef}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              {stat2.count.toLocaleString()}+
            </div>
            <div className="text-white/80 text-sm md:text-base font-light">
              Alumni Worldwide
            </div>
          </div>

          {/* STAT 3 - Academic Programmes */}
          <div className="text-center" ref={stat3.countRef}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              {stat3.count}+
            </div>
            <div className="text-white/80 text-sm md:text-base font-light">
              Academic Programmes
            </div>
          </div>

          {/* STAT 4 - Research Publications Annually */}
          <div className="text-center" ref={stat4.countRef}>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              {stat4.count}+
            </div>
            <div className="text-white/80 text-sm md:text-base font-light">
              Research Publications Annually
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
