// ============================================
// LES API SERVICE LAYER
// Backend devs: Replace these functions with actual MySQL/API calls
// ============================================

import {
    AppointmentFormData,
    VolunteerFormData,
    ContactFormData
} from '../_data/types'

// ============================================
// DATA FETCHING FUNCTIONS
// These currently return static data
// Replace with actual API calls when connecting to MySQL
// ============================================

// Example of how to convert to API call:
// export async function getTeamMembers() {
//   const response = await fetch('/api/les/team')
//   return response.json()
// }

// ============================================
// FORM SUBMISSION HANDLERS
// Backend devs: Replace console.log with actual POST requests
// ============================================

/**
 * Submit counseling appointment form
 * @param data - Appointment form data
 * @returns Promise with success/error response
 */
export async function submitAppointment(data: AppointmentFormData): Promise<{ success: boolean; message: string }> {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/les/appointments', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // })
        // return response.json()

        console.log('Appointment form submitted:', data)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            success: true,
            message: 'Appointment booked successfully! We will contact you soon.'
        }
    } catch (error) {
        console.error('Error submitting appointment:', error)
        return {
            success: false,
            message: 'Failed to book appointment. Please try again.'
        }
    }
}

/**
 * Submit volunteer/internship registration form
 * @param data - Volunteer registration form data
 * @returns Promise with success/error response
 */
export async function submitVolunteerRegistration(data: VolunteerFormData): Promise<{ success: boolean; message: string }> {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/les/volunteers', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // })
        // return response.json()

        console.log('Volunteer registration submitted:', data)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            success: true,
            message: 'Registration submitted successfully! We will review your application.'
        }
    } catch (error) {
        console.error('Error submitting registration:', error)
        return {
            success: false,
            message: 'Failed to submit registration. Please try again.'
        }
    }
}

/**
 * Submit contact form
 * @param data - Contact form data
 * @returns Promise with success/error response
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/les/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // })
        // return response.json()

        console.log('Contact form submitted:', data)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return {
            success: true,
            message: 'Message sent successfully! We will get back to you soon.'
        }
    } catch (error) {
        console.error('Error submitting contact form:', error)
        return {
            success: false,
            message: 'Failed to send message. Please try again.'
        }
    }
}
