import Image from "next/image";

export default function LifeAtLoyolaSection() {
  return (
    <section className="bg-[var(--primary)] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="w-20 h-1 bg-[var(--secondary)] mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-foreground)] mb-6">
            Life at Loyola
          </h2>
          
          <p className="text-[var(--primary-foreground)]/90 leading-relaxed mb-4">
            Beyond academics, our vibrant campus culture fosters personal growth, leadership 
            development, and lifelong friendships. Students engage in diverse extracurricular 
            activities, cultural events, sports, and community service initiatives.
          </p>
          
          <p className="text-[var(--primary-foreground)]/90 leading-relaxed mb-8">
            Our modern facilities include well-equipped libraries, computer labs, research centers, 
            and recreational spaces designed to support holistic student development.
          </p>
          
          <button className="inline-flex items-center px-6 py-3 bg-white text-[var(--primary)] font-semibold rounded hover:bg-gray-100 transition-colors">
            Explore Campus Life
          </button>
        </div>
        
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/images/library-interior.jpg"
            alt="Library interior"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}