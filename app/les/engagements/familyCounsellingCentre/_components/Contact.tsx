import React from 'react'

const counsellors = [
  { name: 'Mary Ann', phone: '9496817132', initial: 'M' },
  { name: 'Pushpa Bhai', phone: '9495124586', initial: 'P' },
]

export default function ContactCounsellors() {
  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        Contact Our Counsellors
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {counsellors.map((counsellor, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">{counsellor.initial}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{counsellor.name}</h4>
              <a 
                href={`tel:${counsellor.phone}`} 
                className="text-primary text-sm hover:underline"
              >
                {counsellor.phone}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
