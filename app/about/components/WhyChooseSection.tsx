// components/WhyChooseSection.tsx
import Image from 'next/image';

const WhyChooseSection = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Image
              alt="Campus Life"
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400"
              width={400}
              height={256}
              className="rounded-2xl h-64 w-full object-cover shadow-lg"
            />
            <div className="bg-primary p-8 rounded-2xl text-white">
              <p className="text-4xl  font-bold">92%</p>
              <p className="text-sm opacity-80">
                Students in professional jobs within 6 months
              </p>
            </div>
          </div>
          <div className="space-y-4 pt-12">
            <div className="bg-primary p-8 rounded-2xl text-white">
              <p className="text-4xl  font-bold">150+</p>
              <p className="text-sm opacity-80">
                Global Jesuit network of institutions
              </p>
            </div>
            <Image
              alt="Collaborative learning"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400"
              width={400}
              height={256}
              className="rounded-2xl h-64 w-full object-cover shadow-lg"
            />
          </div>
        </div>
        <div className="space-y-8">
          <span className="px-4 py-1 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest text-primary">
            CORE FEATURES
          </span>
          <h2 className="text-5xl  font-bold text-slate-900 leading-tight">
            Why choose Loyola?
          </h2>
          <p className="text-slate-600 text-lg">
            Guided by the Jesuit ideal of <b>&apos;Magis&apos;</b> (The More),
            we encourage students to excel beyond boundaries. Our commitment is
            to academic rigor blended with social justice.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">
                  diversity_3
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  Inclusive Environment
                </h4>
                <p className="text-slate-500 text-sm">
                  A diverse community welcoming students from all walks of life.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">
                  psychology
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Research Driven</h4>
                <p className="text-slate-500 text-sm">
                  State-of-the-art facilities for socio-cultural research and
                  data analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
