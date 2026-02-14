'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { teamMembers as fallbackTeam } from '../../_data'
import { getTeamMembers } from '../../_services/api'
import { TeamMember } from '../../_data/types'

export default function OurTeam() {
  const [members, setMembers] = useState<TeamMember[]>(fallbackTeam)

  useEffect(() => {
    getTeamMembers().then(setMembers)
  }, [])

  return (
    <section className="bg-transparent border border-gray-400 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-10 uppercase tracking-wide">
        Our Team
      </h2>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="group">
            {/* Member Image - Fixed height for uniform cards */}
            <div className="mb-4 overflow-hidden h-64 relative">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Green Line */}
            <div className="w-8 h-1 bg-primary mb-3"></div>

            {/* Member Info */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {member.name}
            </h3>
            <p className="text-gray-500 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
