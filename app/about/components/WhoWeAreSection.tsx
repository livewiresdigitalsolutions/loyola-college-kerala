import Image from "next/image";

export default function WhoWeAreSection() {
  return (
    <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">Who We Are</h2>
          <div className="w-20 h-1 bg-[var(--secondary)] mb-6"></div>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Loyola College of Social Sciences stands as a beacon of academic excellence in Kerala, 
            dedicated to nurturing socially conscious leaders who drive meaningful change in society. 
            Established in 1963, we have consistently championed a holistic approach to education 
            that balances intellectual rigor with ethical development.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            As a Jesuit institution, we are rooted in the tradition of Magis—the pursuit of 
            excellence in all endeavors. Our commitment extends beyond classroom instruction to 
            cultivate critical thinking, social awareness, and spiritual depth in every student 
            who walks through our doors.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            From our sprawling campus in Sreekariyam, Thiruvananthapuram, we serve as a hub for 
            innovative research, community engagement, and transformative learning experiences 
            that prepare students to navigate an increasingly complex global landscape.
          </p>
        </div>
        
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/images/students-walking.jpg"
            alt="Students walking on campus"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}