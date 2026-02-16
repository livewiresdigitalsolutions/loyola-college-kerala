'use client'

import React, { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { assistanceContacts as fallbackAssistance } from '../../_data'
import { getAssistanceContacts } from '../../_services/api'
import { AssistanceContact } from '../../_data/types'

export default function AssistanceCard() {
  const [contacts, setContacts] = useState<AssistanceContact[]>(fallbackAssistance)

  useEffect(() => {
    getAssistanceContacts().then(setContacts)
  }, [])

  return (
    <section className="max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
        For Immediate Assistance
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div 
            key={contact.id} 
            className="bg-white rounded-lg p-6 shadow-sm text-center"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-1">{contact.name}</h4>
            <a 
              href={`tel:${contact.phone.replace(/\s/g, '')}`} 
              className="text-primary text-sm hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
