import React from 'react'
import Image from 'next/image'

export default function FamilyCounsellingCentre() {
  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        Loyola Family Counselling Centre
      </h2>
      
      {/* Image */}
      <div className="mb-6">
        <Image
          src="/assets/les/leshero.png"
          alt="Loyola Family Counselling Centre"
          width={700}
          height={300}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
      
      {/* Description */}
      <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
        <p>
          LFCC was established in 1986 and has completed thirty one years of service. It offers counselling 
          services to all crises situations. The priority is on women and children who are the victims of 
          atrocities, in dysfunctional families and from low Socio-economic strata.
        </p>
        <p>
          This scheme is formulated to strengthen the social fabric by preventing the families from breaking 
          down and to promote harmony in the family with the support of Kerala Social welfare Board.
        </p>
      </div>
    </section>
  )
}