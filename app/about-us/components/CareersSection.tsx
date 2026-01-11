// components/CareersSection.tsx
const CareersSection = () => {
  const jobs = [
    {
      title: 'Adjunct Lecturer',
      type: 'ON-CALL',
      location: 'REMOTE',
      salary: '$120K/YR',
    },
    {
      title: 'Visiting Research Scholar',
      type: 'PER DAY (FREELANCE)',
      location: 'REMOTE',
      salary: '$115K/YR',
    },
    {
      title: 'Library Support Assistant',
      type: 'SHIFT-BASED',
      location: 'REMOTE',
      salary: '$100K/YR',
    },
    {
      title: 'Online Course Instructor',
      type: 'REMOTE',
      location: 'REMOTE',
      salary: '$125K/YR',
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <span className="text-primary font-bold uppercase tracking-widest text-xs mb-4 block">
            JOIN WITH US
          </span>
          <h2 className="text-4xl font-serif font-bold mb-6 text-slate-900">
            Looking for a place to grow and thrive?
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Join our prestigious faculty and contribute to shaping the future of
            social sciences. We offer a vibrant, research-intensive environment.
          </p>
          <button className="bg-primary text-white flex items-center gap-3 px-8 py-4 rounded-full font-bold hover:bg-black transition shadow-xl">
            <span>APPLY NOW</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="lg:col-span-7 space-y-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between items-center p-6 border rounded-xl hover:shadow-lg transition bg-white border-slate-200"
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  {job.type}
                </span>
                <h4 className="font-bold text-black">{job.title}</h4>
              </div>
              <div className="flex items-center gap-6 mt-4 sm:mt-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  {job.location}
                </span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] font-bold">
                  {job.salary}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersSection;
