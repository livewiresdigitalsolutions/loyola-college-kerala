import React from 'react'
import Link from 'next/link'

export default function ResearchCTA() {
  return (
    <section className="py-24 bg-primary">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
          Join Our Research Community
        </h2>
        <p className="text-white/75 text-base md:text-lg leading-relaxed mb-10">
          Become part of a vibrant research community that values collaboration, innovation,
          and social impact.
        </p>
        <Link
          href="/academics/programmes-and-course"
          className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-md hover:bg-white/90 transition-colors text-sm"
        >
          Explore Ph.D. Programmes
        </Link>
      </div>
    </section>
  )
}
