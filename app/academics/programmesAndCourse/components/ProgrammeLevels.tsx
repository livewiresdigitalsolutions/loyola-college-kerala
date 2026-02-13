import React from 'react'
import { GraduationCap, BookOpen, FlaskConical } from 'lucide-react'

const programmeLevels = [
  {
    icon: GraduationCap,
    title: 'Undergraduate Programmes',
    subtitle: 'PG Programmes',
    description: 'Foundation programmes designed to provide comprehensive knowledge and skills in social sciences and allied fields.',
    bgColor: 'bg-[#1a5632]',
    programmes: [
      'B.A. Data Science',
      'B.Sc. Psychology',
      'Bachelor of Social Work (BSW)',
      'B.Com Finance and Taxation with CA and ACCA pathways',
      'B.Com Logistics & Supply Chain Management',
      'M.Com Fintech & AI',
    ],
  },
  {
    icon: BookOpen,
    title: 'Postgraduate Programmes',
    subtitle: 'PG Programmes',
    description: 'Advanced programmes offering specialization and in-depth study in various disciplines of social sciences.',
    bgColor: 'bg-[#2a6b45]',
    programmes: [
      'M.A. Sociology',
      'M.Sc. Counselling Psychology',
      'M.S.W Social Work',
      'M.S.W. Disaster Management',
      'M.A.H.R.M (Master of Arts in Human Resource Management)',
    ],
  },
  {
    icon: FlaskConical,
    title: 'Doctoral Programmes',
    subtitle: 'Ph.D. Research',
    description: 'Advanced research programmes for scholars pursuing original contributions to knowledge in social sciences.',
    bgColor: 'bg-[#3d7d5a]',
    programmes: [
      'Ph.D. in Sociology',
      'Ph.D. in Social Work',
      'Ph.D. in Management Studies',
    ],
  },
]

export default function ProgrammeLevels() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Decorative divider */}
        <div className="flex justify-start mb-8">
          <div className="w-24 h-[2px] bg-[#1a5632]"></div>
        </div>

        {/* SECTION HEADING */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Programme Levels
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Choose from our comprehensive range of programmes across undergraduate, postgraduate, and doctoral levels.
          </p>
        </div>

        {/* PROGRAMME CARDS */}
        <div className="space-y-8">
          {programmeLevels.map((level, index) => {
            const Icon = level.icon
            return (
              <div
                key={index}
                className={`${level.bgColor} rounded-2xl p-8 md:p-10 text-white`}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-2xl md:text-3xl font-bold mb-1">{level.title}</h3>
                <p className="text-white/70 text-sm mb-4">{level.subtitle}</p>

                {/* Description */}
                <p className="text-white/85 mb-6 max-w-3xl leading-relaxed">
                  {level.description}
                </p>

                {/* Programme List */}
                <ul className="space-y-2">
                  {level.programmes.map((programme, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 bg-[#F0B129] rounded-full flex-shrink-0"></span>
                      <span className="text-white/90">{programme}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
