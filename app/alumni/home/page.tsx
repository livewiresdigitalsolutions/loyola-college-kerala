import React from 'react'
import HeroSection from '@/app/components/HeroSection'
import Messages from './_components/Messages'
import AuthSection from './_components/AuthSection'
import Guruvandhanam from './_components/Guruvandhanam'
import MentoringAwards from './_components/MentoringAwards'
import AlumniStats from './_components/AlumniStats'

export default function AlumniHome() {
  return (
    <>
      <HeroSection
        title="Loyola Alumni Association"
        smallTitle="CONNECTING GENERATIONS"
        subtitle="Stay connected, give back to the community, and be a part of our ever-growing global network of excellence."
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Alumni', highlight: true }
        ]}
        ctaButtons={[
          { label: 'Join the Network', href: '/alumni/contact', variant: 'primary' },
          { label: 'Giving Back Campaign', href: '/alumni/activities', variant: 'outline' },
        ]}
        newsTicker={{
          text: 'News letter Loyolite 2025-26 PDF',
          href: '#',
        }}
      />

      <Messages />
      <AuthSection />
      <Guruvandhanam />
      <MentoringAwards />
      <AlumniStats />
    </>
  )
}
