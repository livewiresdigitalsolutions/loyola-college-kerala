import { BookOpen, Users, GraduationCap, Globe } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "60+", label: "Years of Excellence" },
  { icon: Users, value: "3,000+", label: "Students Enrolled" },
  { icon: GraduationCap, value: "15+", label: "Academic Programs" },
  { icon: Globe, value: "100+", label: "Expert Faculty" },
];

export default function StatsSection() {
  return (
    <section className="bg-[var(--primary)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-10 h-10 text-[var(--secondary)] mx-auto mb-4" />
              <p className="text-4xl font-bold text-[var(--primary-foreground)] mb-1">{stat.value}</p>
              <p className="text-[var(--primary-foreground)]/80 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}