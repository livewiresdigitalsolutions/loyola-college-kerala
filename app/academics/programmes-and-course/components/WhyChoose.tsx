import React from 'react'

const features = [
  {
    title: 'Academic Excellence',
    description: 'Rigorous curriculum designed by experienced faculty with industry relevance.',
  },
  {
    title: 'Research Focus',
    description: 'Strong emphasis on research methodology and original scholarly work.',
  },
  {
    title: 'Practical Experience',
    description: 'Extensive field work, internships, and industry collaborations.',
  },
  {
    title: 'Career Support',
    description: 'Dedicated placement cell and career guidance services.',
  },
]

export default function WhyChoose() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Decorative divider */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-[2px] bg-primary"></div>
        </div>

        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Programmes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our programmes are designed to provide comprehensive education that prepares you for professional success and social impact.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-5">
              {/* Numbered circle */}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
