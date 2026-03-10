"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface GalleryImage { id: number; image_url: string; alt_text: string; display_order: number; is_active: boolean; }

const LG = "#13432C";

const fallback: GalleryImage[] = [
  { id: -1, image_url: "/assets/associations/lila/gallery-1.jpg", alt_text: "LILA Gallery 1", display_order: 0, is_active: true },
  { id: -2, image_url: "/assets/associations/lila/gallery-2.jpg", alt_text: "LILA Gallery 2", display_order: 1, is_active: true },
  { id: -3, image_url: "/assets/associations/lila/gallery-3.jpg", alt_text: "LILA Gallery 3", display_order: 2, is_active: true },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-initiative-for-language-advancement?type=gallery")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setImages(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Gallery</h2>
          <ChevronUp className="w-5 h-5 transition-transform duration-300" style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative rounded-lg overflow-hidden bg-gray-200" style={{ aspectRatio: "4/3", width: "100%" }}>
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || "LILA Gallery"}
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
