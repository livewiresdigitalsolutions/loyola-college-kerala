import React from 'react'
import Image from 'next/image'

interface Leader {
  name: string
  role: string
  image: string
}

const ptaLeaders: Leader[] = [
  {
    name: 'Rev. Fr. Sunny Kunnappallil S.J',
    role: 'Patron',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Sabu P. Thomas S.J',
    role: 'President',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Mrs. Rejitha V R',
    role: 'Vice President',
    image: '/assets/IgAdministration/saji.png'
  }
]

export default function PtaLeadership() {
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
          {ptaLeaders.map((leader, index) => (
            <div key={index} className="text-left">
              {/* IMAGE */}
              <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
                <Image
                  src={leader.image}
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
