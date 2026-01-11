// components/LegacySection.tsx
import Image from 'next/image';

const LegacySection = () => {
  return (
    <section className="bg-primary py-24 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block bg-white rounded-full inline-block px-4 py-1">
            Our Legacy
          </span>
          <h2 className="text-4xl  font-bold">
            Advance your career &amp; education
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-8 group">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-white transition">
                  Journey was started
                </h3>
                <p className="text-slate-300 text-sm">
                  Founded as a center for Social Work education, becoming the
                  first in the region.
                </p>
              </div>
              <div className="text-5xl font-extrabold text-white/20 group-hover:text-white transition">
                1950
              </div>
            </div>
            <hr className="border-white/10" />
            <div className="flex items-center gap-8 group">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-white transition">
                  Sociology Department
                </h3>
                <p className="text-slate-300 text-sm">
                  Expanding into Sociology and Human Resource Management for
                  holistic research.
                </p>
              </div>
              <div className="text-5xl font-extrabold text-white/20 group-hover:text-white transition ">
                1960
              </div>
            </div>
            <hr className="border-white/10" />
            <div className="flex items-center gap-8 group">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-white transition">
                  New 4-Year UG Programs
                </h3>
                <p className="text-slate-300 text-sm">
                  Launching Data Science, Fintech, and advanced Social Science
                  majors.
                </p>
              </div>
              <div className="text-5xl font-extrabold text-white/20 group-hover:text-white transition ">
                2024
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              alt="Graduation"
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800"
              width={800}
              height={600}
              className="rounded-xl shadow-2xl grayscale-[30%] hover:grayscale-0 transition duration-500"
            />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary animate-pulse">
              <span className="material-symbols-outlined text-4xl">star</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
