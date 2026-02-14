'use client'

import React, { useState, useEffect } from 'react'
import { programs as fallbackPrograms, genderOptions } from '../_data'
import { submitVolunteerRegistration, getPrograms } from '../_services/api'
import { VolunteerFormData, Program } from '../_data/types'

export default function RegistrationForm() {
  const [programsList, setProgramsList] = useState<Program[]>(fallbackPrograms)

  useEffect(() => {
    getPrograms().then(setProgramsList)
  }, [])
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: '',
    gender: '',
    contactNumber: '',
    address: '',
    email: '',
    age: '',
    qualification: '',
    institutionName: '',
    institutionAddress: '',
    programme: '',
    duration: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    const result = await submitVolunteerRegistration(formData)
    
    setSubmitMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    })
    
    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        gender: '',
        contactNumber: '',
        address: '',
        email: '',
        age: '',
        qualification: '',
        institutionName: '',
        institutionAddress: '',
        programme: '',
        duration: ''
      })
    }
    
    setIsSubmitting(false)
  }

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
  const labelClass = "block text-primary font-medium mb-2"

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Volunteer/Internship<br />Registration
      </h2>

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
              {submitMessage.type === 'success' ? 'Registration Submitted!' : 'Something went wrong'}
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
          <label htmlFor="name" className={labelClass}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={inputClass}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className={labelClass}>Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNumber" className={labelClass}>Contact Number</label>
          <input
            type="tel"
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
            className={inputClass}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className={labelClass}>Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className={inputClass}
            rows={2}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClass}
            required
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className={labelClass}>Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            className={inputClass}
            required
          />
        </div>

        {/* Educational Qualification */}
        <div>
          <label htmlFor="qualification" className={labelClass}>Educational Qualification</label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            placeholder="Enter qualification"
            className={inputClass}
            required
          />
        </div>

        {/* Institution Name */}
        <div>
          <label htmlFor="institutionName" className={labelClass}>If Student, Name of the Institution</label>
          <input
            type="text"
            id="institutionName"
            name="institutionName"
            value={formData.institutionName}
            onChange={handleChange}
            placeholder="Institution Name"
            className={inputClass}
          />
        </div>

        {/* Institution Address */}
        <div>
          <label htmlFor="institutionAddress" className={labelClass}>Address of the institution</label>
          <input
            type="text"
            id="institutionAddress"
            name="institutionAddress"
            value={formData.institutionAddress}
            onChange={handleChange}
            placeholder="Institution Address"
            className={inputClass}
          />
        </div>

        {/* Programme */}
        <div>
          <label htmlFor="programme" className={labelClass}>
            In which programme do you like to volunteer or do your internship?
          </label>
          <select
            id="programme"
            name="programme"
            value={formData.programme}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Programme</option>
            {programsList.map((program) => (
              <option key={program.id} value={program.value}>{program.name}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className={labelClass}>Duration of Volunteership</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 1 month, 3 months"
            className={inputClass}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}