import React from 'react'
import Hero from '../_components/Hero'
import DonateForm from './_components/DonateForm'
import Contact from '../_components/Contact'

export default function DonatePage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero
        title="Support Our Cause"
        subtitle="Your contribution helps us empower marginalized communities through education, counselling, and social support."
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'Home', href: '/les/home' },
          { label: 'Donate' }
        ]}
      />
      <DonateForm />

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <Contact />
      </div>
    </div>
  )
}
