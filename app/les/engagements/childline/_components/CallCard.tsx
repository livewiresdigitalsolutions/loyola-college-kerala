import React from 'react'
import { Phone } from 'lucide-react'

export default function CallCard() {
  return (
    <div className="bg-[#F0B129] rounded-lg p-6 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
        <Phone className="w-6 h-6 md:w-8 md:h-8" />
        CALL 1098
      </h3>
      <p className="text-white font-medium text-sm">
        24/7 Emergency Helpline
      </p>
      <p className="text-white text-xs mt-1">
        for children in distress
      </p>
    </div>
  )
}
