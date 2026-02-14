'use client'

import React from 'react'
import Image from 'next/image'

// ─── TYPE DEFINITIONS ────────────────────────────────────────
interface CommitteeMember {
  name: string
  role: string
  designation?: string
  image: string
  isChairperson?: boolean
}

interface Committee {
  name: string
  members: CommitteeMember[]
}

// ─── COMMITTEE DATA ──────────────────────────────────────────
const statutoryCommittees: Committee[] = [
  {
    name: 'Grievance Redressal Cell',
    members: [
      { name: 'Fr. Burns Kuruvapelli, SJ', role: 'Director & Manager', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Sabuji Thomas, SJ', role: 'Principal', image: '/assets/defaultprofile.png' },
      { name: 'Prof. Sajil Jacob', role: 'Controller of Exams', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Prasad Pillai R', role: 'Controller of Administration', image: '/assets/defaultprofile.png', isChairperson: true },
      { name: 'Dr. Renjit George, SJ', role: 'Dean of Arts & Science Faculty', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Simson Payyili', role: 'Asst Professor & HoD', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Saju L SJ', role: 'Faculty Member', image: '/assets/defaultprofile.png' },
    ],
  },
  {
    name: 'Anti-Ragging Committee',
    members: [
      { name: 'Fr. Burns Kuruvapelli, SJ', role: 'Director & Manager', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Sabuji Thomas, SJ', role: 'Principal', image: '/assets/defaultprofile.png' },
      { name: 'Prof. Sajil Jacob', role: 'Controller of Exams', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Prasad Pillai R', role: 'Controller of Administration', image: '/assets/defaultprofile.png', isChairperson: true },
      { name: 'Dr. Renjit George, SJ', role: 'Dean of Arts & Science Faculty', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Simson Payyili', role: 'Asst Professor & HoD', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Saju L SJ', role: 'Faculty Member', image: '/assets/defaultprofile.png' },
    ],
  },
  {
    name: 'Internal Complaints Committee',
    members: [
      { name: 'Fr. Burns Kuruvapelli, SJ', role: 'Director & Manager', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Sabuji Thomas, SJ', role: 'Principal', image: '/assets/defaultprofile.png' },
      { name: 'Prof. Sajil Jacob', role: 'Controller of Exams', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Prasad Pillai R', role: 'Controller of Administration', image: '/assets/defaultprofile.png', isChairperson: true },
      { name: 'Dr. Renjit George, SJ', role: 'Dean of Arts & Science Faculty', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Simson Payyili', role: 'Asst Professor & HoD', image: '/assets/defaultprofile.png' },
    ],
  },
  {
    name: 'SC/ST Committee',
    members: [
      { name: 'Fr. Burns Kuruvapelli, SJ', role: 'Director & Manager', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Sabuji Thomas, SJ', role: 'Principal', image: '/assets/defaultprofile.png' },
      { name: 'Prof. Sajil Jacob', role: 'Controller of Exams', image: '/assets/defaultprofile.png' },
      { name: 'Dr. Prasad Pillai R', role: 'Controller of Administration', image: '/assets/defaultprofile.png', isChairperson: true },
    ],
  },
]

// ─── MEMBER CARD COMPONENT ───────────────────────────────────
function MemberCard({ member }: { member: CommitteeMember }) {
  return (
    <div className="flex flex-col group cursor-pointer">
      {/* Photo with hover overlay */}
      <div className="relative w-full aspect-3/4 overflow-hidden mb-4">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Green hover overlay */}
        <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
          {member.isChairperson && (
            <>
              <p className="text-lg font-bold">Chairperson</p>
              <p className="text-sm text-white/80 mt-1">+91 9876543210</p>
            </>
          )}
          {!member.isChairperson && (
            <p className="text-sm text-white/90 text-center">{member.role}</p>
          )}
        </div>
      </div>

      {/* Green decorative line */}
      <div className="w-10 h-[3px] bg-primary mb-3"></div>

      {/* Name & Role */}
      <h4 className="font-bold text-gray-900 text-sm md:text-base">{member.name}</h4>
      <p className="text-xs md:text-sm text-gray-500 mt-0.5">{member.role}</p>
    </div>
  )
}

// ─── COMMITTEE SECTION COMPONENT ────────────────────────────
function CommitteeSection({ committee }: { committee: Committee }) {
  return (
    <div className="py-12">
      {/* Decorative divider */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-[3px] bg-primary"></div>
      </div>

      {/* Committee name */}
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
        {committee.name}
      </h3>

      {/* Members grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
        {committee.members.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function Committees() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Statutory Committees
          </h2>
          <p className="text-sm text-[#F0B129] font-medium mt-2 tracking-wide uppercase">
            Members 2024–25
          </p>
        </div>

        {/* Committee Sections */}
        {statutoryCommittees.map((committee, index) => (
          <CommitteeSection key={index} committee={committee} />
        ))}
      </div>
    </section>
  )
}
