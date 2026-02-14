'use client'

import React, { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { partners as fallbackPartners } from '../../../_data'
import { getPartners } from '../../../_services/api'
import { Partner } from '../../../_data/types'

export default function PartnerOrganizations() {
  const [partnersList, setPartnersList] = useState<Partner[]>(fallbackPartners)

  useEffect(() => {
    getPartners().then(setPartnersList)
  }, [])

  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        Partner Organizations
      </h2>
      
      <div className="space-y-4">
        {partnersList.map((partner) => (
          <div 
            key={partner.id} 
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{partner.name}</h4>
              <p className="text-gray-500 text-sm">{partner.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
