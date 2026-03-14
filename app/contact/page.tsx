import ContactHero from './components/hero'
import ContactCards from './components/contact-cards'
import ContactFormSection from './components/contact-form-section'
import ContactMap from './components/contact-map'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ContactHero />
      
      {/* Contact Info Cards */}
      <div className="bg-transparent relative z-20 pt-16">
        <ContactCards />
      </div>

      {/* Main Content Area (Form & Timings) */}
      <ContactFormSection />

      {/* Map Section */}
      <ContactMap />
    </div>
  )
}
