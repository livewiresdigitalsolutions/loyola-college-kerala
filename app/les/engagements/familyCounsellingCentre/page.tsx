import React from 'react'
import Hero from '../../_components/Hero'
import News from '../../_components/News'
import RegistrationForm from '../../_components/RegistrationForm'
import FamilyCounsellingCentre from './_components/FamilyCounsellingCentre'
import ContactCounsellors from './_components/Contact'

export default function FamilyCounsellingCentrePage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero 
        title="Family Counselling Centre"
        subtitle="Supporting families through professional counselling services since 1986"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home' },
          { label: 'Engagements' },
          { label: 'Family Counselling Centre' }
        ]}
      />
      
      {/* Layout with sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT - 2/3 */}
          <main className="lg:col-span-2 order-1 space-y-8">
            <FamilyCounsellingCentre />
            <ContactCounsellors />
          </main>

          {/* RIGHT SIDEBAR - 1/3 */}
          <aside className="lg:col-span-1 order-2 space-y-6">
            <News />
            <RegistrationForm />
          </aside>
        </div>
      </div>
    </div>
  )
}
