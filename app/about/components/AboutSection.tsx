// components/AboutSection.tsx
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-xl transition-all group-hover:bg-primary/10"></div>
          <Image
            alt="Students studying.jpg"
            src="/assets/loyolabanner.jpg"
            width={800}
            height={500}
            className="relative rounded-xl shadow-2xl z-10 w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur p-6 rounded-lg shadow-xl border border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">TRUSTED BY</p>
                <p className="font-bold text-black">5000+ Alumni</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-primary font-semibold tracking-widest text-sm border-b-2 border-primary/20 pb-1 mb-6 inline-block">
            SINCE 1963
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-slate-900">
            Where compassion meets academic excellence.
          </h2>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            Loyola College, Trivandrum is a premier institute for Social
            Sciences in South India. Run by the Society of Jesus, we focus on
            intellectual growth and social commitment, preparing professionals
            for a just world.
          </p>
          <div className="bg-slate-50 p-8 rounded-xl border-l-4 border-primary italic text-slate-700">
            <p className="mb-4">
              "Our goal is not just to create graduates, but to form men and
              women for others, equipped with critical thinking and a heart for
              service."
            </p>
            <div className="flex items-center gap-4 not-italic">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
              </div>
              <div>
                <p className="font-bold text-slate-900">Dr. Thomas P.J.</p>
                <p className="text-xs text-slate-500">
                  Principal, Loyola College
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
