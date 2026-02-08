// ============================================
// CONTACT PERSONS & INFO DATA
// Backend devs: Replace this with MySQL API call
// ============================================

import { ContactPerson, ContactInfo } from './types'

// Coordinators displayed on contact page
export const coordinators: ContactPerson[] = [
    {
        id: '1',
        title: "Coordinator",
        name: "Dr. Assistant Director",
        role: "Extension Services"
    },
    {
        id: '2',
        title: "Assistant Coordinator",
        name: "Mr. Scott Bernard",
        role: "Extension Services"
    },
    {
        id: '3',
        title: "Support Staff",
        name: "Mr. Arun Gopinath",
        role: "Program Officer"
    }
]

// Contact info for the organization
export const contactInfo: ContactInfo = {
    email: ['les@loyolacollege.edu', 'info@loyolales.org'],
    phone: ['+91 9847624147', '+91 471 2590200'],
    address: `Loyola Extension Service
Loyola College of Social Sciences
Sreekariyam, Thiruvananthapuram
Kerala - 695017`,
    officeHours: {
        weekdays: 'Mon - Fri: 9:00 AM - 5:00 PM',
        saturday: 'Saturday: 9:00 AM - 1:00 PM',
        sunday: 'Sunday: Closed'
    }
}
