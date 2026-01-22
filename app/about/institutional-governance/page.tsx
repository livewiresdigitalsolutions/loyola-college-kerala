import React from 'react'
import IgHero from './components/ig-hero'
import IgAdministration from './components/ig-administration'
import IgGoverningBody from './components/ig-governingbody'

export default function Page() {
  return (
    <div>
        <IgHero />
        <IgAdministration />
        <IgGoverningBody />
    </div>
  )
}
