"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronUp } from "lucide-react";

interface GalleryImage { id: number; image_url: string; alt_text: string; }

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("/api/students/womens-cell?type=gallery")
      .then(r => r.json())
      .then(d => { if (d.success) setImages(d.data || []); })
      .catch(() => {});
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Gallery</h2>
          <ChevronUp className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map(image => (
                <div key={image.id} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                  <Image src={image.image_url} alt={image.alt_text || "Women Cell Gallery"} width={400} height={300} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
