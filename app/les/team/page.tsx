import React from 'react'
import Hero from '../_components/Hero'
import OurTeam from './_components/OurTeam'
import Contact from '../_components/Contact'

export default function TeamPage() {
  return (
    <>
      <Hero 
        title="Our Team"
        subtitle="Meet the dedicated team behind Loyola Extension Service"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home', highlight: true },
          { label: 'Team' }
        ]}
      />
      
      {/* Full width layout without sidebar */}
      <div className="bg-[#E8E5DE]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
          <OurTeam />
          <Contact />
        </div>
      </div>
    </>
  )
}
