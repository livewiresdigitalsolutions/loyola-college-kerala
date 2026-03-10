import React from 'react'
import HeroSection from '@/app/components/HeroSection'
import { Calendar } from 'lucide-react'

const awards = [
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
  {
    title: 'Alumni Association Golden Jubilee Award',
    date: '2021-07-23 16:05:08',
    description: 'Instituted by Alumni Association on its Golden Jubilee Year to be given to the First Rank holders in MA Sociology, MSW, MA HRM & MSc',
  },
]

export default function AwardsScholarships() {
  return (
    <>
      <HeroSection
        title="Awards & Scholarships"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Activities' },
          { label: 'Awards & Scholarships', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="divide-y divide-gray-100">
            {awards.map((award, index) => (
              <div key={index} className="py-6 first:pt-0">
                <h3 className="text-xl font-bold text-[#1a5632]">{award.title}</h3>
                <p className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5">
                  <Calendar size={12} />
                  POSTED ON: {award.date}
                </p>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {award.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
