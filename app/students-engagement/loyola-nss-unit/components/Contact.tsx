import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="shadow-sm rounded-lg overflow-hidden bg-[#F6F6EE] px-6 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C] mb-4">Contact</h2>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dr. Nisha Jolly Nelson</h3>
        <a
          href="mailto:nishanelson@loyolacollegekerala.edu.in"
          className="inline-flex items-center gap-2 text-[#13432C] hover:underline text-[15px]"
        >
          <Mail className="w-4 h-4" />
          nishanelson@loyolacollegekerala.edu.in
        </a>
      </div>
    </section>
  );
}
