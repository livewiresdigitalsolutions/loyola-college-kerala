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
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="w-16 h-1 bg-[#264c3b] mb-6 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">What Sets Us Apart</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Our distinctive approach to education combines academic excellence with social 
            consciousness, preparing graduates who make a difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 md:p-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="w-10 h-[3px] bg-[#f2a900] mb-6 rounded-full"></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}