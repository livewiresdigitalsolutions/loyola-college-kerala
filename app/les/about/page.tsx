import React from 'react'
import Hero from '../_components/Hero'
import PageLayout from '../_components/PageLayout'
import AboutContent from './_components/AboutContent'
import Achievements from './_components/Achievements'
import Contact from '../_components/Contact'

export default function AboutPage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero 
        title="About Us"
        subtitle="Learn about our mission, vision, and journey"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home' },
          { label: 'About' }
        ]}
      />
      
      <PageLayout bgColor="bg-[#F6F6EE]">
        {/* Left side content - About information */}
        <div className="space-y-8">
          <AboutContent />
          <Achievements />
        </div>
      </PageLayout>

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        <Contact />
      </div>
    </div>
  )
}
