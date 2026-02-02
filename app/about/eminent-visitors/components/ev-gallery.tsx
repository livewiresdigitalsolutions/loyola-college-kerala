import React from 'react'
import Image from 'next/image'

const visitors = [
  {
    name: 'Fr. Sunny Kunnappallil, SJ',
    title: 'Rector & Manager',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Dr. Sabu P. Thomas, SJ',
    title: 'Principal',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Prof. Saji P Jacob',
    title: 'Autonomy Director',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Dr. Prakash Pillai R',
    title: 'Controller of Examinations',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Dr. Ranjit I George, SJ',
    title: 'Asst Controller of Examinations, Director, ILES',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Dr. Simon Thattil',
    title: 'Academic Director',
    image: '/assets/IgAdministration/saji.png',
  },
  {
    name: 'Dr. Saji J, SJ',
    title: 'Vice Principal PG',
    image: '/assets/IgAdministration/saji.png',
  },
]

export default function EvGallery() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          EMINENT VISITORS
        </h2>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visitors.map((visitor, index) => (
            <div
              key={index}
              className="group"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <Image
                  src={visitor.image}
                  alt={visitor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* ACCENT LINE */}
              <div className="w-12 h-1 bg-primary mb-3"></div>

              {/* NAME */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {visitor.name}
              </h3>

              {/* TITLE */}
              <p className="text-sm text-gray-600">
                {visitor.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
