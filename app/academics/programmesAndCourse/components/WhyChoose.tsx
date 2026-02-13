import React from 'react'
import { Award, FlaskConical, Briefcase, BookOpen } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Academic Excellence',
    description: 'Programmes curated by experienced faculty with industry-relevant curriculum.',
  },
  {
    icon: FlaskConical,
    title: 'Research Focus',
    description: 'Strong emphasis on research methodology and original contributions to knowledge.',
  },
  {
    icon: Briefcase,
    title: 'Practical Experience',
    description: 'Field work, internships, and industry connections for real-world learning.',
  },
  {
    icon: BookOpen,
    title: 'Career Support',
    description: 'Comprehensive placement cell and career guidance on every step of the way.',
  },
]

export default function WhyChoose() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADING */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Programmes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our programmes are designed to provide a holistic education that prepares you for professional success and social impact.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="relative p-8 rounded-xl border border-gray-100 hover:border-[#1a5632]/20 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Number indicator */}
                <div className="absolute top-8 right-8 text-5xl font-bold text-gray-100 group-hover:text-[#1a5632]/10 transition-colors">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-[#1a5632]/10 rounded-lg flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#1a5632]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
