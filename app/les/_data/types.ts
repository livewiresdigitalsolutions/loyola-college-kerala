// ============================================
// LES DATA TYPES
// All TypeScript interfaces for the LES section
// Backend devs: These types define the data structure
// ============================================

// Team Member
export interface TeamMember {
    id: string
    name: string
    role: string
    image: string
    profileUrl?: string
}

// Gallery Image
export interface GalleryImage {
    id: string
    src: string
    alt: string
    category?: string
}

// News Item
export interface NewsItem {
    id: string
    title: string
    timeAgo: string
    content?: string
    link?: string
}

// Contact Person (Coordinators, Staff)
export interface ContactPerson {
    id: string
    title: string
    name: string
    role: string
    email?: string
    phone?: string
}

// Contact Info (Office details)
export interface ContactInfo {
    email: string[]
    phone: string[]
    address: string
    officeHours: {
        weekdays: string
        saturday: string
        sunday: string
    }
}

// Partner Organization
export interface Partner {
    id: string
    name: string
    location: string
    logo?: string
}

// Immediate Assistance Contact
export interface AssistanceContact {
    id: string
    name: string
    phone: string
}

// Counselor
export interface Counselor {
    id: string
    name: string
    specialization?: string
}

// Volunteer Program
export interface Program {
    id: string
    name: string
    value: string
    description?: string
}

// Form Data Types
export interface AppointmentFormData {
    name: string
    gender: string
    address: string
    mobileNo: string
    email: string
    age: string
    counselingDate: string
    counselingStaff: string
    counselingSlot: string
    message: string
}

export interface VolunteerFormData {
    name: string
    gender: string
    contactNumber: string
    address: string
    email: string
    age: string
    qualification: string
    institutionName: string
    institutionAddress: string
    programme: string
    duration: string
}

export interface ContactFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    subject: string
    message: string
}
