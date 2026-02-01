// components/FacultySection.tsx
import Image from 'next/image';
import Link from 'next/link';

const FacultySection = () => {
  const faculty = [
    {
      name: 'Dr. Abraham Varghese',
      role: 'Head, Dept. of Social Work',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
      name: 'Prof. Maya Pillai',
      role: 'Associate Professor, Sociology',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
      name: 'Dr. Shaji George',
      role: 'Assistant Professor, HRM',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Prof. Anita Mathew',
      role: 'Senior Lecturer, Data Science',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="px-4 py-1 bg-primary/5 text-primary rounded-full text-sm font-semibold mb-4 inline-block uppercase tracking-wider">
            Expertise
          </span>
          <h2 className="text-4xl font-serif font-bold text-slate-900">
            Meet our expert faculty
          </h2>
        </div>
        <Link
          href="#"
          className="group flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:bg-black transition"
        >
          <span>View All Faculty</span>
          <span className="material-symbols-outlined transition group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {faculty.map((member, index) => (
          <div key={index} className="group">
            <div className="overflow-hidden rounded-2xl mb-4 h-[350px]">
              <Image
                alt={member.name}
                src={member.image}
                width={400}
                height={350}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="font-bold text-xl text-black">{member.name}</h3>
            <p className="text-slate-500 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FacultySection;
