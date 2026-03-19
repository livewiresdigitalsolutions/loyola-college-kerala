'use client'

import React, { useEffect, useState, useRef } from 'react'

type Stat = {
  id: number
  region: string
  count: number
  sort_order: number
}

function AnimatedCounter({ target, isVisible }: { target: number; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    let start = 0
    const duration = 2000
    const increment = target / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [target, isVisible])

  return <span>{count.toLocaleString()}</span>
}

export default function AlumniStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/alumni/world-stats')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(data)
        }
      })
      .catch(err => console.error('Failed to load world stats', err))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-[#0d3d2b] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.25em] uppercase text-white/70 font-medium">
            Our Alumni Around the World
          </h2>
          <div className="w-16 h-0.5 bg-white/30 mx-auto mt-4" />
        </div>

        {/* Stats */}
        <div className="flex justify-center items-end gap-16 md:gap-24 lg:gap-32 flex-wrap">
          {stats.map((stat, index) => (
            <div key={stat.id || index} className="text-center">
              <div className="w-3 h-3 bg-white/80 rounded-full mx-auto mb-4" />
              <p className="text-white/60 text-sm mb-2">{stat.region}</p>
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                <AnimatedCounter target={stat.count} isVisible={isVisible} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
