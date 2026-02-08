import React from 'react'
import Hero from '../_components/Hero'
import PageLayout from '../_components/PageLayout'
import Intro from './_components/Intro'
import Teams from './_components/Teams'
import Involvements from './_components/Involvements'
import Contact from '../_components/Contact'

export default function Home() {
  return (
    <>
      <Hero 
        title="Loyola Extension Service"
        subtitle="Serving the community with dedication and compassion"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES' }
        ]}
      />
      
      <PageLayout>
        {/* Left side content */}
        <div className="space-y-8">
          <Intro />
          <Teams />
        </div>
      </PageLayout>

      {/* Full width section below the layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <Involvements />
      </div>

      {/* Contact Section */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        <Contact />
      </div>
    </>
  )
}
