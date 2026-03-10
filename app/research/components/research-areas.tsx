import React from 'react'

const researchAreas = [
  {
    title: 'Sociology',
    topics: [
      'Urban Studies',
      'Gender & Development',
      'Social Movements',
      'Irrigation Studies',
      'Environmental Sociology',
      'Political Sociology',
    ],
  },
  {
    title: 'Social Work',
    topics: [
      'Community Development',
      'Medical Social Work',
      'Disaster Management',
      'Child Welfare',
      'Women Empowerment',
      'Gerontology',
    ],
  },
  {
    title: 'Management Studies',
    topics: [
      'Human Resource Management',
      'Organisational Behaviour',
      'Strategic Management',
      'Leadership Studies',
      'Corporate Social Responsibility',
    ],
  },
]

export default function ResearchAreas() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-[3px] bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Research Areas
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Our doctoral programmes span diverse research areas in social sciences.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-8 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                {area.title}
              </h3>
              <ul className="space-y-2">
                {area.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
