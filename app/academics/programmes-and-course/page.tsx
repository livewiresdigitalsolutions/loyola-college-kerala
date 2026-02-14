import React from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import ProgrammeLevels from './components/ProgrammeLevels'
import WhyChoose from './components/WhyChoose'
import CTASection from './components/CTASection'

export default function ProgrammesAndCoursePage() {
  return (
    <main>
      <Hero />
      <Intro />
      <ProgrammeLevels />
      <WhyChoose />
      <CTASection />
    </main>
  )
}
