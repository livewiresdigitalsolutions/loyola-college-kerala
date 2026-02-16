import React from 'react'
import Image from 'next/image'
import {
  Globe,
  Users,
  BookOpen,
  Leaf,
  ShieldCheck,
} from 'lucide-react'

// ─── PROGRAMME OUTCOMES DATA ─────────────────────────────────
const programmeOutcomes = [
  {
    icon: Globe,
    title: 'Global Competence',
    description:
      'Developing skills and knowledge to succeed in a globalised world with cross-cultural understanding.',
  },
  {
    icon: Users,
    title: 'Responsible Citizenship Behaviour',
    description:
      'Fostering civic responsibility, social awareness, and active participation in community development.',
  },
  {
    icon: BookOpen,
    title: 'Lifelong Learning',
    description:
      'Cultivating a commitment to continuous learning and professional development throughout life.',
  },
  {
    icon: Leaf,
    title: 'Sustainability Consciousness',
    description:
      'Building awareness and commitment to environmental sustainability and responsible resource management.',
  },
  {
    icon: ShieldCheck,
    title: 'Ethical Orientation',
    description:
      'Instilling strong ethical values, moral reasoning, and integrity in professional and personal conduct.',
  },
]

// ─── MAIN COMPONENT ─────────────────────────────────────────
export default function OBEContent() {
  return (
    <>
      {/* ── INTRO SECTION ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Decorative divider */}
          <div className="flex justify-start mb-12">
            <div className="w-24 h-[3px] bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — Heading */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Transforming<br />Education<br />Through Outcomes
              </h2>
            </div>

            {/* Right — Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Loyola follows the Outcome Based Education Framework (OBE) for
                effective curriculum delivery and enhancement. OBE at Loyola is a fully
                customised framework evolved internally, integrating Programme
                Outcomes (POs), Programme Specific Outcomes (PSOs) and Course
                Outcomes (COs), in congruence with the institution&apos;s vision and legacy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                The uniqueness of OBE in Loyola is that it maps the co-curricular and
                extracurricular engagements and the resulting changes in their
                competence level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMME OUTCOMES SECTION ────────────────────── */}
      <section className="py-20" style={{ backgroundColor: '#F6F6EE' }}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Decorative line */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-[3px] bg-primary"></div>
          </div>

          {/* Section heading — centered */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Programme Outcomes
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our five core Programme Outcomes (POs) guide the educational experience at
              Loyola.
            </p>
          </div>

          {/* Outcome cards — stacked */}
          <div className="space-y-5">
            {programmeOutcomes.map((outcome, index) => {
              const Icon = outcome.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {outcome.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {outcome.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── LOYOLA MODEL SECTION ──────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section heading — centered */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Loyola Model of Outcome Assessment
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our comprehensive framework integrates academic and co-curricular engagements
              to achieve programme outcomes.
            </p>
          </div>

          {/* Assessment model image */}
          <div className="relative w-full aspect-16/10 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="/assets/academics/loyolaModelOfOutcomeAssessment.png"
              alt="Loyola Model of Outcome Assessment"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES OBE UNIQUE ─────────────────────────── */}
      <section className="py-20 bg-primary">
        <div className="max-w-5xl mx-auto px-6">
          {/* Decorative line */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-[3px] bg-white/40"></div>
          </div>

          {/* Section heading — centered */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What Makes Our OBE Unique
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Loyola&apos;s OBE framework goes beyond traditional academic assessment.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Holistic Mapping */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-5">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Holistic Mapping</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We uniquely map co-curricular and extracurricular
                engagements alongside academic performance, providing a
                comprehensive view of student development and
                competence growth.
              </p>
            </div>

            {/* Customized Framework */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Customized Framework</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Our OBE framework is fully customised and internally evolved,
                ensuring perfect alignment with Loyola&apos;s institutional vision,
                mission, and 60+ year legacy of excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
