"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Leader {
  id: number
  name: string
  role: string
  image_url: string
  display_order: number
  is_active: boolean
}

// Fallback data in case API is not yet seeded
const fallbackLeaders: Leader[] = [
  { id: 0, name: 'Rev. Fr. Sunny Kunnappallil S.J', role: 'Patron', image_url: '/assets/IgAdministration/saji.png', display_order: 0, is_active: true },
  { id: 1, name: 'Dr. Sabu P. Thomas S.J', role: 'President', image_url: '/assets/IgAdministration/saji.png', display_order: 1, is_active: true },
  { id: 2, name: 'Mrs. Rejitha V R', role: 'Vice President', image_url: '/assets/IgAdministration/saji.png', display_order: 2, is_active: true },
]

export default function PtaLeadership() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaders()
  }, [])

  const fetchLeaders = async () => {
    try {
      const res = await fetch('/api/about/pta')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setLeaders(data.data)
      } else {
        setLeaders(fallbackLeaders)
      }
    } catch {
      setLeaders(fallbackLeaders)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-[#F6F6EE] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">PTA LEADERSHIP</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[3/4] bg-gray-300 mb-4 rounded" />
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#F6F6EE] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            PTA LEADERSHIP
          </h2>
        </div>

        {/* LEADERSHIP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leaders.map((leader, index) => (
            <div key={leader.id ?? index} className="text-left">
              {/* IMAGE */}
              <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
                <Image
                  src={leader.image_url}
                  alt={leader.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* DIVIDER LINE */}
              <div className="w-12 h-0.5 bg-primary mb-3"></div>

              {/* NAME */}
              <h3 className="text-base md:text-lg font-bold text-primary mb-1">
                {leader.name}
              </h3>

              {/* ROLE */}
              <p className="text-sm text-gray-600">
                {leader.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
