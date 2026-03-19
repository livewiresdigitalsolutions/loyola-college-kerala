import Image from "next/image";

const outcomes = [
  "PO 1: Global Competence",
  "PO 2: Responsible Citizenship Behaviour", 
  "PO 3: Sustainability Consciousness",
  "PO 4: Lifelong Learning",
  "PO 5: Ethical Orientation"
];

export default function ProgrammeOutcomesSection() {
  return (
    <section className="bg-[#f8f8f3] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] w-full max-w-[380px] mx-auto rounded-sm overflow-hidden shadow-xl lg:mr-auto">
          <Image
            src="/assets/about/po.png"
            alt="Programme Outcomes"
            fill
            className="object-cover"
          />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-8 uppercase tracking-wide">
            Programme Outcomes (PO)
          </h2>
          
          <div className="space-y-0">
            {outcomes.map((outcome, index) => (
              <div 
                key={index} 
                className="border-b border-gray-300 py-4 last:border-b-0"
              >
                <p className="text-gray-800 font-medium">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}