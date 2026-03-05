"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  alt_text: string;
}

const fallback: GalleryImage[] = [
  { id: -1, image_url: "/assets/associations/litcof/gallery-1.jpg", alt_text: "LITCOF Gallery 1" },
  { id: -2, image_url: "/assets/associations/litcof/gallery-2.jpg", alt_text: "LITCOF Gallery 2" },
  { id: -3, image_url: "/assets/associations/litcof/gallery-3.jpg", alt_text: "LITCOF Gallery 3" },
];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(fallback);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch("/api/students/loyola-in-the-company-of-friends?type=gallery")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setGalleryImages(d.data); })
      .catch(() => {/* keep fallback */ });
  }, []);

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
            className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"
              }`}
          />
        </button>
        <hr className="border-gray-200" />
              <div className="mb-8"></div>
        {/* Gallery Grid */}
        {isOpen && (
          <div className="px-6 py-6">
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative rounded-lg overflow-hidden bg-gray-200"
                  style={{ aspectRatio: "4/3", width: "100%" }}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || "LITCOF Gallery"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
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
