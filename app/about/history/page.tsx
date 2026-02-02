import React from 'react'
import Timeline from './components/timeline'
import Vision from './components/vision'
import Stats from './components/stats'
import HistoryHero from './components/historyHero'
import Cta from '@/app/Home/components/cta'

export default function Page() {
  return (
    <div>
        <HistoryHero />
        <Vision />
        <Stats />      
        <Timeline />
        {/* <Cta /> */}
    </div>
  )
}
