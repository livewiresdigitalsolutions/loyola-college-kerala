'use client'

import React, { useState } from 'react'
import HeroSection from '@/app/components/HeroSection'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function AlumniContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <HeroSection
        title="Contact Us"
        smallTitle="LOYOLA COLLEGE ALUMNI ASSOCIATION"
        backgroundImage="/assets/alumni/herobg.jpg"
        breadcrumbs={[
          { label: 'Contact Us', highlight: true },
        ]}
        height="h-[400px] md:h-[450px] lg:h-[500px]"
      />

      {/* Contact Section: Info + Form on left, Map on right */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Contact Info + Form */}
            <div>
              {/* Contact Info */}
              <h2 className="text-2xl font-bold text-gray-900 italic mb-4">Contact Information</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Whether you have a question about upcoming events, want to contribute to
                the giving back campaign, or simply want to say hello, our team is ready to
                answer all your questions.
              </p>

              <div className="space-y-5 mb-12">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Email Address</h3>
                    <p className="text-sm text-gray-600">alumniassociation@loyalacollegekerala.edu.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Phone Number</h3>
                    <p className="text-sm text-gray-600">+91 6238800948</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#1a5632] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Office Location</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Loyola College of Social Sciences<br />
                      Sreekariyam P.O.,<br />
                      Thiruvananthapuram – 695 017<br />
                      Kerala, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[#f6f6ee] rounded-xl p-8 mt-10 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Your Name (required)
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Your Email (required)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows={5}
                      className="w-full px-4 py-2.5 rounded border border-gray-300 focus:border-[#1a5632] focus:ring-2 focus:ring-[#1a5632]/20 outline-none transition text-sm bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#1a5632] text-white px-5 py-2.5 rounded text-sm font-semibold hover:bg-[#154a2b] transition-all"
                  >
                    <Send size={14} />
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Map (full height) */}
            <div className="w-full min-h-[500px] lg:min-h-0 bg-gray-100 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.3!2d76.9!3d8.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05beca2d4b2cc1%3A0x38e47bfa7e5b4e7!2sLoyola%20College%20of%20Social%20Sciences!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Loyola College Location"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
