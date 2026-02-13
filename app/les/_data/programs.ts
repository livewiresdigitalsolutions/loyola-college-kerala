// ============================================
// VOLUNTEER PROGRAMS DATA
// Backend devs: Replace this with MySQL API call
// ============================================

import { Program } from './types'

export const programs: Program[] = []

// Gender options for forms
export const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
]
