import React from 'react'
import HeroSection from '@/app/components/HeroSection'
import { Target, Eye } from 'lucide-react'

const executiveMembers = [
  { title: 'Rev. Fr. M. D. Varkey S.J.', role: '(Principal of the College) as the President' },
  { title: 'Rev. Fr. Jose Murickan', role: 'as the Director' },
  { title: 'Mr. John Morris M. A.', role: '(1965 batch) as Vice-president' },
  { title: 'Mr. M. P. Viswam, M. S.W', role: '(1949 batch) as the Secretary' },
  { title: 'Mr. Gopalakrishnan Nair', role: '(M.COM lecturer) as the Treasurer' },
]

export default function AlumniLegacy() {
  return (
    <>
      <HeroSection
        title="The Legacy"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'About us' },
          { label: 'The Legacy', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <p className="text-gray-700 leading-relaxed mb-6">
            Looking at the legacy of the 54 year old alumni association one should always sincerely
            thank <strong>Dr. Fr. Jose Murickan, S. J.</strong> who conceived the idea of forming a former students&apos;
            association of the college.
          </p>

          <p className="text-gray-600 text-sm leading-relaxed mb-10">
            Prof. R. Gopalakrishnan Nair and Prof. Mariamma Joseph prepared the draft constitution for the association. The
            Alumni Association of Loyola came into being on <strong>13th April 1967</strong>.
          </p>

          {/* The First Executive Committee Card */}
          <div className="bg-[#f8f7f2] rounded-xl p-8 mb-10 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              The First Executive Committee
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              The first Executive Committee was formed with:
            </p>
            <ul className="space-y-2.5">
              {executiveMembers.map((member, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <strong className="text-gray-900">{member.title}</strong>{' '}
                  <span className="text-gray-500">{member.role}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm mt-5">
              Along with that five executive committee members were also elected.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            The Loyolite is the news letter published by the alumni association every year. The tenure of the Executive committee
            is two years. Even though the Association started its activities in April 1967, the official inauguration was carried out
            on <strong>27th March 1968</strong> by Rev. Fr. Aikara S.J., Principal, St. Xavier&apos;s College Trivandrum.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-[#f5f3ee]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a5632] rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-5">
                <Target className="w-6 h-6 text-[#F0B129]" strokeWidth={1.5} />
                <h3 className="text-xl font-bold">Mission</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Engaged knowledge building for grooming positive, innovative, and value-oriented
                thought leaders capable of offering sustainable, social transformation.
              </p>
            </div>

            <div className="bg-[#0d3d2b] rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-5">
                <Eye className="w-6 h-6 text-[#F0B129]" strokeWidth={1.5} />
                <h3 className="text-xl font-bold">Vision</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Fostering excellence in thinking, commitment and engagement for holistic
                transformation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
