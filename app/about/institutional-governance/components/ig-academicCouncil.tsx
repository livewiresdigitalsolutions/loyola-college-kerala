import React from 'react'
import Image from 'next/image'

interface AdminMember {
  name: string
  role: string
  image: string
}

const administrationMembers: AdminMember[] = [
  {
    name: 'Fr. Sunny Kunnappallil, SJ',
    role: 'Rector & Manager',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Sabu P. Thomas, SJ',
    role: 'Principal',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Prof. Saji P Jacob',
    role: 'Autonomy Director',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Prakash Pillai R',
    role: 'Controller of Examinations',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Ranjit I George, SJ',
    role: 'Asst Controller of Examinations, Director LES',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Simon Thattil',
    role: 'Academic Director',
    image: '/assets/IgAdministration/saji.png'
  },
  {
    name: 'Dr. Saji J, SJ',
    role: 'Vice Principal PG',
    image: '/assets/IgAdministration/saji.png'
  }
]

export default function IgAcademicCouncil() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            ACADEMIC COUNCIL
          </h2>
        </div>

        {/* ADMINISTRATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {administrationMembers.map((member, index) => (
            <div key={index} className="text-left">
              {/* IMAGE */}
              <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* DIVIDER LINE */}
              <div className="w-12 h-0.5 bg-primary mb-3"></div>

              {/* NAME */}
              <h3 className="text-base md:text-lg font-bold text-primary mb-1">
                {member.name}
              </h3>

              {/* ROLE */}
              <p className="text-sm text-gray-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
