const accreditations = [
  { title: "UGC Recognized", subtitle: "University Grants Commission" },
  { title: "NAAC 'A' Grade", subtitle: "National Assessment and Accreditation Council" },
  { title: "Autonomous Status", subtitle: "University of Kerala" },
  { title: "ISO 9001:2015", subtitle: "Quality Management System" },
  { title: "Affiliated to University of Kerala", subtitle: "State University" },
  { title: "NIRF Ranked", subtitle: "National Institutional Ranking Framework" },
];

export default function AccreditationSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-1 bg-[var(--secondary)] mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] tracking-wider uppercase">
            Accreditation & Recognition
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accreditations.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow bg-[#fafafa]"
            >
              <h3 className="font-bold text-[var(--primary)] text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}