import React from 'react'

const initiatives = [
  'Community Development',
  'Counseling Services',
  'Child Protection - Golden and Kanya Child Rights Observatory',
  'Research',
  'Documentation',
  'Publications',
]

const partnerships = {
  internationalAgencies: [
    'UNICEF India',
    'World Vision',
    'Global college, Sweden',
    'Cleveland State University',
    'Sophia University',
    'Kerala Jesuit Society',
  ],
  government: [
    'Ministry of Women & Child Development, GOK',
    'Department of Social Justice, GOK',
    'Department of Women & Child Development., GOK',
    'Central Social Welfare Board',
    'Kerala State Social Welfare Board',
    'CHILDLINE India Foundation',
    'Our Responsibility to children',
    'State child protection society',
    'KeSCPCR',
    'Kerala Police Academy',
    'SCERT',
    'SIEMAT',
    'IMO',
    'NHM',
    'Dept of Homeopathy',
    'Kerala Police',
  ],
  ngos: [
    'TSSS',
    'Don Bosco',
    'MSSS',
    'Adhwana',
    'Sakhi',
  ],
}

const maxRows = Math.max(
  partnerships.internationalAgencies.length,
  partnerships.government.length,
  partnerships.ngos.length
)

export default function Achievements() {
  return (
    <div className="space-y-8">
      {/* Achievements Section */}
      <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 uppercase tracking-wide">
          Achievements
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-6">
          In close to three decades, LES has earned to be a multi-dimensional Resource Centre and Social 
          Consultancy is engaged in various programmes and initiatives such as:
        </p>
        <ul className="space-y-3">
          {initiatives.map((item, index) => (
            <li key={index} className="flex items-start gap-3 text-gray-700 text-sm md:text-base">
              <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Partnerships Section */}
      <section className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 uppercase tracking-wide">
          Partnerships
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-[#F6F6EE] border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm md:text-base">
                  International Agencies
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-800 text-sm md:text-base">
                  Government
                </th>
                <th className="text-left py-3 px-4 font-semibold text-primary text-sm md:text-base">
                  NGOs
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }).map((_, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700 text-sm md:text-base align-top">
                    {partnerships.internationalAgencies[index] || ''}
                  </td>
                  <td className="py-3 px-4 text-gray-700 text-sm md:text-base align-top border-x border-gray-200">
                    {partnerships.government[index] || ''}
                  </td>
                  <td className="py-3 px-4 text-primary text-sm md:text-base align-top">
                    {partnerships.ngos[index] || ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
