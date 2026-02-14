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
        <div className={`mb-6 p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitMessage.text}
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