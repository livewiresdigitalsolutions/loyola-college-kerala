import React from 'react'
import {
  BookOpen,
  FlaskConical,
  Users,
  Globe,
  Brain,
  Cpu,
} from 'lucide-react'

const objectives = [
  {
    icon: BookOpen,
    title: 'Engaged Learning',
    description:
      'Strengthening research as a process to promote engaged learning.',
  },
  {
    icon: FlaskConical,
    title: 'Research Methodology',
    description:
      'Enhancing the understanding of research methodology.',
  },
  {
    icon: Users,
    title: 'Interdisciplinary Perspectives',
    description:
      'Encouraging interdisciplinary perspectives among the students and the faculty.',
  },
  {
    icon: Globe,
    title: 'Social Relevance',
    description:
      'Using research as a platform to engage students on socially relevant topics.',
  },
  {
    icon: Brain,
    title: 'Critical Thinking',
    description:
      'Fostering critical thinking and dialogue among students.',
  },
  {
    icon: Cpu,
    title: 'Technological Tools',
    description:
      'Facilitating better use of technological tools for quality research.',
  },
]

export default function Objectives() {
  return (
    <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          {/* Accent line */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-[3px] bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Objectives
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            The Loyola Research Collective is built on six foundational objectives that guide our
            research culture.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj, index) => {
            const Icon = obj.icon
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl border border-gray-100 p-7 hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {obj.title}
                </h3>
                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {obj.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
