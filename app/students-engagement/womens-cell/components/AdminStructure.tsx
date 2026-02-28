"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

export default function AdminStructure() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Administrative Structure</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-8 flex justify-center">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden bg-gray-200">
            <Image
              src="/assets/associations/womens-cell/admin-structure.jpg"
              alt="Administrative Structure"
              width={800}
              height={600}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
