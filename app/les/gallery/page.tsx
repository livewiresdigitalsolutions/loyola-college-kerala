import React from 'react'
import Hero from '../_components/Hero'
import LesGallery from './_components/LesGallery'
import Contact from '../_components/Contact'

export default function GalleryPage() {
  return (
    <>
      <Hero 
        title="Our Gallery"
        subtitle="Capturing moments of service and community engagement"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home', highlight: true },
          { label: 'Gallery' }
        ]}
      />
      
      {/* Full width layout without sidebar */}
      <div className="bg-[#E8E5DE]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
          <LesGallery />
          <Contact />
        </div>
      </div>
    </>
  )
}
