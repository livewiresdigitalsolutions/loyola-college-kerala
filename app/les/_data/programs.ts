// ============================================
// VOLUNTEER PROGRAMS DATA
// Backend devs: Replace this with MySQL API call
// ============================================

import { Program } from './types'

export const programs: Program[] = [
    {
        id: '1',
        name: 'Childline',
        value: 'childline',
        description: 'Child protection and welfare services'
    },
    {
        id: '2',
        name: 'Family Counselling Centre',
        value: 'family-counselling',
        description: 'Family support and counseling services'
    },
    {
        id: '3',
        name: 'KECRO',
        value: 'kecro',
        description: 'Kerala Child Rights Observatory'
    },
    {
        id: '4',
        name: 'Community Development',
        value: 'community-development',
        description: 'Community outreach and development programs'
    }
]

// Gender options for forms
export const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
]
