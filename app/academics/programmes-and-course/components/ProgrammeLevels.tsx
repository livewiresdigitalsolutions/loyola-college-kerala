import React from 'react'
import { GraduationCap, BookOpen, FlaskConical } from 'lucide-react'

const programmeLevels = [
  {
    icon: GraduationCap,
    title: 'Undergraduate Programmes',
    subtitle: 'FYUG Programmes',
    description: 'Foundation programmes designed to provide comprehensive knowledge and skills in social sciences and allied fields.',
    programmes: [
      'B.Sc. Data Science',
      'B.Sc. Psychology',
      'Bachelor of Social Work (BSW)',
      'B.Com Finance and Accounts with CA and ACCA pathways',
      'B.Com Logistics & Supply Chain Management',
      'B.Com Fintech & AI',
    ],
  },
  {
    icon: BookOpen,
    title: 'Postgraduate Programmes',
    subtitle: 'PG Programmes',
    description: 'Advanced programmes offering specialization and in-depth study in various disciplines of social sciences.',
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
    programmes: [
      'Ph.D. in Sociology',
      'Ph.D. in Social Work',
      'Ph.D. in Management Studies',
    ],
  },
]

export default function ProgrammeLevels() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Decorative divider */}
        <div className="flex justify-start mb-8">
          <div className="w-24 h-[3px] bg-primary"></div>
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
            const isSecond = index === 1
            return (
              <div
                key={index}
                className={`rounded-2xl p-8 md:p-10 ${isSecond ? 'border border-gray-200' : 'bg-primary text-white'}`}
                style={isSecond ? { backgroundColor: '#F6F6EE' } : undefined}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${isSecond ? 'bg-primary/10' : 'bg-white/20 backdrop-blur-sm'}`}>
                  <Icon className={`w-7 h-7 ${isSecond ? 'text-primary' : 'text-white'}`} />
                </div>

                {/* Title & Subtitle */}
                <h3 className={`text-2xl md:text-3xl font-bold mb-1 ${isSecond ? 'text-gray-900' : ''}`}>{level.title}</h3>
                <p className={`text-sm mb-4 ${isSecond ? 'text-gray-500' : 'text-white/70'}`}>{level.subtitle}</p>

                {/* Description */}
                <p className={`mb-6 max-w-3xl leading-relaxed ${isSecond ? 'text-gray-600' : 'text-white/85'}`}>
                  {level.description}
                </p>

                {/* Programme List */}
                <ul className="space-y-2">
                  {level.programmes.map((programme, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-3">
                      <span className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${isSecond ? 'bg-primary' : 'bg-white'}`}></span>
                      <span className={isSecond ? 'text-gray-700' : 'text-white/90'}>{programme}</span>
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
