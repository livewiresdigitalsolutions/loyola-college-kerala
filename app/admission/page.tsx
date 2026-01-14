import React from 'react'
import AdmissionProcess from './components/AdmissionProcess'
import AdmissionsHero from './components/AdmissionsHero'
import StartApplication from './components/StartApplication'

export default function Admissions() {
  return (
    <div>
        <AdmissionsHero />
        <AdmissionProcess />
        <StartApplication />
    </div>
  )
}
