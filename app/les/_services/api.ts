// ============================================
// LES API SERVICE LAYER
// Connects to Next.js API routes (/api/les/*)
// which query MySQL or Supabase based on DB_TYPE
// ============================================

import {
    TeamMember,
    GalleryImage,
    NewsItem,
    ContactPerson,
    ContactInfo,
    Partner,
    AssistanceContact,
    Counselor,
    Program,
    AppointmentFormData,
    VolunteerFormData,
    ContactFormData
} from '../_data/types'

// Import fallback data for when API is unavailable
import { teamMembers as fallbackTeam } from '../_data/team'
import { galleryImages as fallbackGallery } from '../_data/gallery'
import { newsItems as fallbackNews } from '../_data/news'
import { coordinators as fallbackCoordinators, contactInfo as fallbackContactInfo } from '../_data/contacts'
import { partners as fallbackPartners } from '../_data/partners'
import { assistanceContacts as fallbackAssistance } from '../_data/assistance'
import { counselors as fallbackCounselors, counselingSlots as fallbackSlots } from '../_data/counselors'
import { programs as fallbackPrograms } from '../_data/programs'

// ============================================
// DATA FETCHING FUNCTIONS
// Each fetches from the API, falls back to static data on error
// ============================================

export async function getTeamMembers(): Promise<TeamMember[]> {
    try {
        const response = await fetch('/api/les/team')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackTeam
    }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const response = await fetch('/api/les/gallery')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackGallery
    }
}

export async function getNewsItems(): Promise<NewsItem[]> {
    try {
        const response = await fetch('/api/les/news')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackNews
    }
}

export async function getCoordinators(): Promise<ContactPerson[]> {
    try {
        const response = await fetch('/api/les/coordinators')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackCoordinators
    }
}

const emptyContactInfo: ContactInfo = {
    email: [],
    phone: [],
    address: '',
    officeHours: { weekdays: '', saturday: '', sunday: '' }
}

export async function getContactInfo(): Promise<ContactInfo> {
    try {
        const response = await fetch('/api/les/contact-info')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        return data || emptyContactInfo
    } catch (error) {
        return fallbackContactInfo || emptyContactInfo
    }
}

export async function getPartners(): Promise<Partner[]> {
    try {
        const response = await fetch('/api/les/partners')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackPartners
    }
}

export async function getAssistanceContacts(): Promise<AssistanceContact[]> {
    try {
        const response = await fetch('/api/les/assistance')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackAssistance
    }
}

export async function getCounselors(): Promise<{ counselors: Counselor[], slots: { id: string, label: string, value: string }[] }> {
    try {
        const response = await fetch('/api/les/counselors')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return { counselors: fallbackCounselors, slots: fallbackSlots }
    }
}

export async function getPrograms(): Promise<Program[]> {
    try {
        const response = await fetch('/api/les/programs')
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        return fallbackPrograms
    }
}

// ============================================
// FORM SUBMISSION HANDLERS
// POST data to API routes which insert into MySQL
// ============================================

export async function submitAppointment(data: AppointmentFormData): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch('/api/les/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (error) {
        return {
            success: false,
            message: 'Failed to book appointment. Please try again.'
        }
    }
}

export async function submitVolunteerRegistration(data: VolunteerFormData): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch('/api/les/volunteers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (error) {
        return {
            success: false,
            message: 'Failed to submit registration. Please try again.'
        }
    }
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch('/api/les/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (error) {
        return {
            success: false,
            message: 'Failed to send message. Please try again.'
        }
    }
}
