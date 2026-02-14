// ============================================
// CONTACT PERSONS & INFO DATA
// Backend devs: Replace this with MySQL API call
// ============================================

import { ContactPerson, ContactInfo } from './types'

// Coordinators displayed on contact page
export const coordinators: ContactPerson[] = []

// Contact info for the organization
export const contactInfo: ContactInfo = {
    email: [],
    phone: [],
    address: '',
    officeHours: {
        weekdays: '',
        saturday: '',
        sunday: ''
    }
}
