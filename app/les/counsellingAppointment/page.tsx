import React from 'react'
import Hero from '../_components/Hero'
import AppointmentForm from './_components/AppointmentForm'
import AssistanceCard from './_components/AssistanceCard'

export default function CounsellingAppointmentPage() {
  return (
    <div className="bg-[#F6F6EE]">
      <Hero 
        title="Counselling Appointment"
        subtitle="Book your counselling session with our professional counsellors"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home' },
          { label: 'Counselling Appointment' }
        ]}
      />
      
      {/* Full width content - no sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 space-y-12">
        <AppointmentForm />
        <AssistanceCard />
      </div>
    </div>
  )
}
