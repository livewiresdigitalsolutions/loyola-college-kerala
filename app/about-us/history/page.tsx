import React from 'react'
import HistoryHero from './components/historyHero'
import Timeline from './components/timeline'
import Vision from './components/vision'
import Stats from './components/stats'
import Cta from '@/app/Home/components/cta'

export default function page() {
  return (
    <div>
        <HistoryHero />
        <Vision />
        <Stats />
        <Timeline /> 
        <Cta />
    </div>
  )
}
