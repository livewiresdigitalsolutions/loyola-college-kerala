import React from 'react'
import Link from 'next/link'
import { Users, Award, ChevronRight } from 'lucide-react'

const mentoringItems = [
  {
    title: 'La Compass',
    date: '2021-07-23',
    href: '#',
  },
]

const awards = [
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23',
    href: '#',
  },
  {
    title: 'Dr. M.K. George Retirement Endowment Cash Award',
    date: '2021-07-23',
    href: '#',
  },
]

export default function MentoringAwards() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mentoring Card */}
          <div className="bg-[#f8f7f2] rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#1a5632]" strokeWidth={1.5} />
              <h2 className="text-xl font-bold text-[#1a5632]">Mentoring</h2>
            </div>

            <div className="flex-1 space-y-4">
              {mentoringItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Posted on: {item.date}
                  </p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-[#1a5632] text-sm font-medium mt-4 hover:underline"
                  >
                    Read full details
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/alumni/activities"
                className="inline-block bg-[#1a5632] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#154a2b] transition"
              >
                View All Mentoring
              </Link>
            </div>
          </div>

          {/* Awards & Scholarships Card */}
          <div className="bg-[#0d3d2b] rounded-2xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-white" strokeWidth={1.5} />
              <h2 className="text-xl font-bold text-white">
                Awards & Scholarships
              </h2>
            </div>

            <div className="flex-1 space-y-4">
              {awards.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-white/15 pb-4 last:border-b-0"
                >
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-white/50 text-sm mt-1">
                    Posted on: {item.date}
                  </p>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-white/80 text-sm font-medium mt-2 hover:text-white transition"
                  >
                    Read more
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/alumni/activities"
                className="inline-block border-2 border-white text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                View All Awards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
