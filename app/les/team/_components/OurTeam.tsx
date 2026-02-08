import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { teamMembers } from '../../_data'

export default function OurTeam() {
  return (
    <section className="bg-transparent border border-gray-400 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10 uppercase tracking-wide">
        Our Team
      </h2>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="group">
            {/* Member Image */}
            <div className="mb-4 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                width={200}
                height={250}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-110"
                style={{ transform: 'scale(1.05)' }}
              />
            </div>

            {/* Green Line */}
            <div className="w-8 h-1 bg-primary mb-3"></div>

            {/* Member Info */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {member.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3">{member.role}</p>
            
            {/* View Profile Link */}
            <Link 
              href={member.profileUrl || `/les/team/${member.id}`}
              className="inline-flex items-center gap-1 text-[#F0B129] hover:text-[#d9a025] text-xs font-semibold uppercase tracking-wide transition-colors"
            >
              View Full Profile
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
