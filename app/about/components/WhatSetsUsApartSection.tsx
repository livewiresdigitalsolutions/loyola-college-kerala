const features = [
  {
    title: "Jesuit Tradition",
    description: "Rooted in 450+ years of educational excellence, our Jesuit heritage emphasizes holistic development, critical thinking, and service to humanity."
  },
  {
    title: "Social Sciences Focus",
    description: "Specialized programs in economics, psychology, sociology, and social work that address real-world challenges with academic rigor."
  },
  {
    title: "Research Excellence",
    description: "Cutting-edge research initiatives that contribute to social policy, community development, and sustainable solutions."
  },
  {
    title: "Community Engagement",
    description: "Strong partnerships with local communities, NGOs, and organizations that provide hands-on learning and social impact."
  }
];

export default function WhatSetsUsApartSection() {
  return (
    <section className="bg-[#f8f8f3] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
          <p className="text-gray-700 leading-relaxed">
            Our distinctive approach to education combines academic excellence with social 
            consciousness, preparing graduates who make a difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border-t-4 border-[var(--secondary)]">
              <h3 className="text-xl font-bold text-[var(--primary)] mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}