import React from 'react'
import Hero from '../../_components/Hero'
import News from '../../_components/News'
import RegistrationForm from '../../_components/RegistrationForm'
import WhatIsChildline from './_components/WhatIsChildline'
import CallCard from './_components/CallCard'

export default function ChildlinePage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero 
        title="CHILDLINE"
        subtitle="24-hour emergency helpline for children in distress"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home' },
          { label: 'Engagements' },
          { label: 'CHILDLINE' }
        ]}
      />
      
      {/* Custom layout for Childline with CallCard above News */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT - 2/3 */}
          <main className="lg:col-span-2 order-1">
            <WhatIsChildline />
          </main>

          {/* RIGHT SIDEBAR - 1/3 */}
          <aside className="lg:col-span-1 order-2 space-y-6">
            <CallCard />
            <News />
            <RegistrationForm />
          </aside>
        </div>
      </div>
    </div>
  )
}
