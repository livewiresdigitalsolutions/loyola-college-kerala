import React from 'react'
import Image from 'next/image'
import { Mail, Phone } from 'lucide-react'
import { coordinators, contactInfo } from '../_data'

export default function Contact() {
  return (
    <section className="relative rounded-2xl overflow-hidden group bg-primary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/les/lesHero.png"
          alt="Contact Background"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Primary Color Overlay */}
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10 uppercase tracking-wide">
            Contact
          </h2>

          {/* Contact Persons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
            {coordinators.map((person) => (
              <div key={person.id}>
                <h3 className="text-white/80 text-sm mb-2">{person.title}</h3>
                <p className="text-white font-semibold text-lg mb-1">{person.name}</p>
                <p className="text-white/70 text-sm">{person.role}</p>
              </div>
            ))}
          </div>

          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            {/* Email */}
            <div className="text-center">
              <h3 className="text-white/80 text-sm mb-3">Email</h3>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${contactInfo.email[0]}`} className="hover:underline">
                  {contactInfo.email[0]}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="text-center">
              <h3 className="text-white/80 text-sm mb-3">Phone Number</h3>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-5 h-5" />
                <div className="flex flex-col">
                  {contactInfo.phone.map((phone, index) => (
                    <a key={index} href={`tel:${phone.replace(/\s/g, '')}`} className="hover:underline">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
