"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

const galleryImages = [
  { src: "/assets/associations/lila/gallery-1.jpg", alt: "LILA Gallery 1" },
  { src: "/assets/associations/lila/gallery-2.jpg", alt: "LILA Gallery 2" },
  { src: "/assets/associations/lila/gallery-3.jpg", alt: "LILA Gallery 3" },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Gallery</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Gallery Grid */}
      {isOpen && (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, i) => (
              <div
                key={i}
                className="aspect-4/3 rounded-lg overflow-hidden bg-gray-200"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
