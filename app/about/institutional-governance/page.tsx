import React from 'react'
import IgHero from './components/ig-hero'
import IgAdministration from './components/ig-administration'
import IgGoverningBody from './components/ig-governingbody'
import IgAcademicCouncil from './components/ig-academicCouncil'

export default function Page() {
  return (
    <div>
      <IgHero />
      <IgAdministration />
      <IgGoverningBody />
      <IgAcademicCouncil />
    </div>
  )
}
