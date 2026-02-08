import React from 'react'
import Hero from '../../_components/Hero'
import News from '../../_components/News'
import RegistrationForm from '../../_components/RegistrationForm'
import Kecro from './_components/Kecro'
import PartnerOrganizations from './_components/PatnerOrganizations'

export default function KecroPage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero 
        title="KeCRO"
        subtitle="Kerala Child Rights Observatory - Protecting children's rights across Kerala"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home' },
          { label: 'Engagements' },
          { label: 'KeCRO' }
        ]}
      />
      
      {/* Layout with sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT - 2/3 */}
          <main className="lg:col-span-2 order-1 space-y-8">
            <Kecro />
            <PartnerOrganizations />
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
