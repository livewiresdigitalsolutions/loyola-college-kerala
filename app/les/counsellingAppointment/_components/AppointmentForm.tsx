'use client'

import React, { useState, useEffect } from 'react'
import { counselors as fallbackCounselors, counselingSlots as fallbackSlots, genderOptions } from '../../_data'
import { submitAppointment, getCounselors } from '../../_services/api'
import { AppointmentFormData, Counselor } from '../../_data/types'

export default function AppointmentForm() {
  const [counselorsList, setCounselorsList] = useState<Counselor[]>(fallbackCounselors)
  const [slotsList, setSlotsList] = useState(fallbackSlots)

  useEffect(() => {
    getCounselors().then((data) => {
      setCounselorsList(data.counselors)
      setSlotsList(data.slots)
    })
  }, [])
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    gender: '',
    address: '',
    mobileNo: '',
    email: '',
    age: '',
    counselingDate: '',
    counselingStaff: '',
    counselingSlot: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    const result = await submitAppointment(formData)
    
    setSubmitMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    })
    
    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        gender: '',
        address: '',
        mobileNo: '',
        email: '',
        age: '',
        counselingDate: '',
        counselingStaff: '',
        counselingSlot: '',
        message: '',
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Appointment
        </h2>
        <p className="text-gray-600 text-sm">
          Please fill in the details below to book your counselling session
        </p>
      </div>

      {submitMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSubmitMessage(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center animate-in" onClick={(e) => e.stopPropagation()}>
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
              {submitMessage.type === 'success' ? 'Appointment Booked!' : 'Something went wrong'}
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
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Mobile No */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile No <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Counseling Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Counseling Date Selection
          </label>
          <input
            type="date"
            name="counselingDate"
            value={formData.counselingDate}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Counseling Staff */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Counseling Staff
          </label>
          <select
            name="counselingStaff"
            value={formData.counselingStaff}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select Staff</option>
            {counselorsList.map((counselor) => (
              <option key={counselor.id} value={counselor.id}>{counselor.name}</option>
            ))}
          </select>
        </div>

        {/* Counseling Slot */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Counseling Slot
          </label>
          <select
            name="counselingSlot"
            value={formData.counselingSlot}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Select Slot</option>
            {slotsList.map((slot) => (
              <option key={slot.id} value={slot.value}>{slot.label}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Brief description of your concern (optional)"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Appointment'}
        </button>
      </form>
    </section>
  )
}
