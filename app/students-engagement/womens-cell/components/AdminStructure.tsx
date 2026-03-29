"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface AdminStructureItem { id: number; image_url: string; }

export default function AdminStructure() {
  const [isOpen, setIsOpen] = useState(true);
  const [item, setItem] = useState<AdminStructureItem | null>(null);

  useEffect(() => {
    fetch("/api/students/womens-cell?type=admin-structure")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length > 0) setItem(d.data[0]); })
      .catch(() => {});
  }, []);

  if (!item) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Administrative Structure</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-8 flex justify-center">
            <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-gray-200">
              <Image src={item.image_url} alt="Administrative Structure" width={800} height={600} className="object-contain w-full h-auto" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
