import React from 'react'
import Image from 'next/image'
import { Users, TrendingUp, Building2, FileText, Lightbulb } from 'lucide-react'

const initiatives = [
  { icon: Users, label: 'Community Development' },
  { icon: TrendingUp, label: 'Economics Research' },
  { icon: Building2, label: 'Employment' },
  { icon: FileText, label: 'Research' },
  { icon: Lightbulb, label: 'Creativity' },
]

export default function Intro() {
  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm border border-gray-200">
      {/* Header with Text and Image */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Text Content */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 uppercase tracking-wide">
              Loyola Extension Services
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              Loyola Extension Services (LES) is the Resource cum Outreach Centre of Loyola College of Social 
              Sciences, Trivandrum. It was established in 1986 and registered under the Charitable Societies 
              Registration Act in the same year. LES was started in alignment with the UGC guidelines that envisaged 
              teaching, research and extension as the triple functions of the University system. The aims and 
              objectives of LES are to integrate outreach and academics and avoid the pitfalls of academic 
              isolation and detachment of the conventional university system.
            </p>
          </div>

          {/* Image - Small thumbnail on right */}
          <div className="shrink-0 self-start">
            <Image
              src="/assets/les/lesintro.png"
              alt="LES Team"
              width={200}
              height={200}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Second Paragraph */}
      <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-8">
        In its 35 years of existence, LES has evolved into a multi-dimensional Resource Centre 
        and Social Consultancy engaged in various programmes and initiatives such as;
      </p>

      {/* Initiative List */}
      <div className="space-y-3">
        {initiatives.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-4 bg-[#F6F6EE] rounded-lg border border-gray-200"
          >
            <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-gray-800 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
