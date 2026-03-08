"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
}

const LG = "#13432C";

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("/api/students/loyola-ethnographic-theatre?type=gallery")
      .then(r => r.json())
      .then(d => { if (d.success) setImages(d.data || []); })
      .catch(() => { });
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="shadow-sm rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Gallery</h2>
          <ChevronUp
            className="w-5 h-5 transition-transform duration-300"
            style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </button>
        <hr className="border-gray-200" />

        {/* Gallery Grid */}
        {isOpen && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="aspect-4/3 rounded-lg overflow-hidden bg-gray-200"
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text}
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
