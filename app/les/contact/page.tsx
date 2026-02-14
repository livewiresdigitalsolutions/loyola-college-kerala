'use client'

import React, { useState, useEffect } from 'react'
import Hero from '../_components/Hero'
import { Mail, Phone, MapPin, Clock, Send, User } from 'lucide-react'
import { coordinators as fallbackCoordinators, contactInfo as fallbackContactInfo } from '../_data'
import { submitContactForm, getCoordinators, getContactInfo } from '../_services/api'
import { ContactFormData, ContactPerson, ContactInfo as ContactInfoType } from '../_data/types'

export default function ContactPage() {
  const [coordinatorsList, setCoordinatorsList] = useState<ContactPerson[]>(fallbackCoordinators)
  const [info, setInfo] = useState<ContactInfoType>(fallbackContactInfo)

  useEffect(() => {
    getCoordinators().then(setCoordinatorsList)
    getContactInfo().then(setInfo)
  }, [])
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    const result = await submitContactForm(formData)
    
    setSubmitMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    })
    
    if (result.success) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <>
      <Hero 
        title="Contact Us"
        subtitle="Get in touch with Loyola Extension Service"
        backgroundImage="/assets/les/lesHero.png"
        breadcrumbs={[
          { label: 'LES', href: '/les/home', highlight: true },
          { label: 'Contact' }
        ]}
      />
      
      <div className="bg-[#E8E5DE]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          
          {/* Coordinators Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#1a5632] text-center mb-8">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coordinatorsList.map((person) => (
                <div key={person.id} className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-[#1a5632]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-[#1a5632]" />
                  </div>
                  <p className="text-sm text-[#F0B129] font-medium mb-1">{person.title}</p>
                  <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
                  <p className="text-gray-500 text-sm">{person.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side - Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#1a5632] mb-8">Get In Touch</h2>
              
              {/* Phone Card */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1a5632] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                  {info?.phone?.map((phone, index) => (
                    <p key={index} className="text-gray-600">{phone}</p>
                  ))}
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1a5632] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                  {info?.email?.map((email, index) => (
                    <p key={index} className="text-gray-600">{email}</p>
                  ))}
                </div>
              </div>

              {/* Address Card */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1a5632] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600 whitespace-pre-line">{info.address}</p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1a5632] rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Office Hours</h3>
                  <p className="text-gray-600">{info?.officeHours?.weekdays}</p>
                  <p className="text-gray-600">{info?.officeHours?.saturday}</p>
                  <p className="text-gray-600">{info?.officeHours?.sunday}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-[#1a5632] mb-6">Send us a Message</h2>
              
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {submitMessage.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5632] focus:border-transparent outline-none transition resize-none"
                    placeholder="Write your message here..."
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1a5632] hover:bg-[#154428] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1a5632] mb-6">Find Us</h2>
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.0889693!2d76.9!3d8.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMDAuMCJOIDc2wrA1NCcwMC4wIkU!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Loyola College Location"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
