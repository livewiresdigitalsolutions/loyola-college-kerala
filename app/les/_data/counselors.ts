// ============================================
// COUNSELORS DATA
// Backend devs: Replace this with MySQL API call
// ============================================

import { Counselor } from './types'

export const counselors: Counselor[] = [
    {
        id: 'mary-ann',
        name: 'Mary Ann',
        specialization: 'Family Counseling'
    },
    {
        id: 'pushpa-bhai',
        name: 'Pushpa Bhai',
        specialization: 'Child Counseling'
    }
]

// Time slots for counseling sessions
export const counselingSlots = [
    {
        id: 'morning',
        label: 'Morning (9:00 AM - 12:00 PM)',
        value: 'morning'
    },
    {
        id: 'afternoon',
        label: 'Afternoon (2:00 PM - 5:00 PM)',
        value: 'afternoon'
    }
]
