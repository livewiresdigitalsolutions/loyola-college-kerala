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
    let { name, value } = e.target
    
    if (name === 'firstName' || name === 'lastName') {
      // Allow letters (any language), spaces, commas and periods only
      value = value.replace(/[^a-zA-Z\u00C0-\u024F\s.,]/g, '')
    }

    if (name === 'phone') {
      // Allow only digits, cap at 10, auto-format as XXXXX XXXXX
      const digits = value.replace(/\D/g, '').slice(0, 10)
      value = digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits
    }

    setFormData({ ...formData, [name]: value })
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
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800 mb-2">Working Hours</h3>
                  {info?.officeHours?.weekdays && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-500 min-w-[90px]">Weekdays :</span>
                      <span className="text-gray-700">{info.officeHours.weekdays}</span>
                    </div>
                  )}
                  {info?.officeHours?.saturday && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-500 min-w-[90px]">Saturday :</span>
                      <span className="text-gray-700">{info.officeHours.saturday}</span>
                    </div>
                  )}
                  {info?.officeHours?.sunday && (
                    <div className="flex gap-2 text-sm">
                      <span className="text-gray-500 min-w-[90px]">Sunday :</span>
                      <span className="text-gray-700">{info.officeHours.sunday}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-[#1a5632] mb-6">Send us a Message</h2>
              
              {submitMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSubmitMessage(null)}>
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center" onClick={(e) => e.stopPropagation()}>
                    {submitMessage.type === 'success' ? (
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </div>
                    )}
                    <h3 className={`text-xl font-bold mb-2 ${submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {submitMessage.type === 'success' ? 'Message Sent!' : 'Something went wrong'}
                    </h3>
                    <p className="text-gray-600 mb-6">{submitMessage.text}</p>
                    <button
                      onClick={() => setSubmitMessage(null)}
                      className={`px-8 py-2.5 rounded-lg font-semibold text-white transition-colors ${submitMessage.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      OK
                    </button>
                  </div>
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
                      minLength={2}
                      maxLength={50}
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
                      minLength={1}
                      maxLength={50}
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
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                    title="Please enter a valid email address."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1a5632] focus-within:border-transparent transition bg-white">
                    <span className="px-3 py-3 text-gray-600 bg-gray-50 border-r border-gray-300 text-sm font-semibold select-none whitespace-nowrap">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="XXXXX XXXXX"
                      className="flex-1 px-4 py-3 outline-none bg-transparent tracking-wider"
                      maxLength={11}
                      minLength={11}
                      pattern="[0-9]{5} [0-9]{5}"
                      title="Enter a valid 10-digit number (format: XXXXX XXXXX)"
                      required
                    />
                  </div>
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
