import React from 'react'
import Image from 'next/image'

export default function Kecro() {
  return (
    <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
        Kerala Child Rights Observatory (KeCRO)
      </h2>
      
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/assets/les/kecro.png"
          alt="KeCRO - Kerala Child Rights Observatory"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
      
      {/* Description */}
      <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
        <p>
          Kerala Child Rights Observatory (KeCRO) is a consortium of Civil Society Organizations working 
          together for promotion and protection of child rights in the State of Kerala. It will actively involve 
          itself in evidence based research and case based fact-finding missions and advocate with the duty 
          bearers.
        </p>
        <p>
          The KeCRO will work closely with the Kerala State Commission for Protection of Child Rights 
          (KeSCPCR) and take inputs from National Commission for Protection of Child Rights.
        </p>
        <p>
          Loyola Extension Services, Loyola College of Social Sciences, Trivandrum and Rajagiri Outreach, 
          Rajagiri College of Social Sciences, Ernakulam jointly coordinates the activities of Kerala Child 
          Rights Observatory with the support of UNICEF.
        </p>
      </div>
    </section>
  )
}
