import React from 'react'
import VisionHero from './components/visionHero'
import VisionMission from './components/visionMission'
import Cta from '@/app/Home/components/cta'

export default function Page() {
  return (
    <>
      <VisionHero />
      <VisionMission />
      <Cta />
    </>
  )
}
