import React, { Suspense } from 'react'
import Hero from '../_components/Hero'
import DonateForm from './_components/DonateForm'
import Contact from '../_components/Contact'
import { Loader2 } from 'lucide-react'

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
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#0d4a33] animate-spin" />
        </div>
      }>
        <DonateForm />
      </Suspense>

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16">
        <Contact />
      </div>
    </div>
  )
}
