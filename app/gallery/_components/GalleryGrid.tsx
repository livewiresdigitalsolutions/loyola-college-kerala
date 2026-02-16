"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search } from "lucide-react";

// Mock Data
const galleryItems = [
  {
    id: 1,
    src: "/assets/loyola-building.png",
    category: "Campus",
    title: "Main Administrative Building",
    date: "Established 1963",
    size: "large", // for masonry if needed
  },
  {
    id: 2,
    src: "/assets/CampusActivities.png",
    category: "Events",
    title: "International Seminar on Social Work",
    date: "Jan 15, 2026",
    size: "small",
  },
  {
    id: 3,
    src: "/assets/graduation-ceremony.png",
    category: "Academic",
    title: "Student Group Discussion",
    date: "Daily Activity",
    size: "small",
  },
  {
    id: 4,
    src: "/assets/news.jpg",
    category: "Student Life",
    title: "Annual Cultural Fest 'Dhwani'",
    date: "Dec 20, 2025",
    size: "medium", // portrait
  },
  {
    id: 5,
    src: "/assets/academics/loyolaModelOfOutcomeAssessment.png",
    category: "Campus",
    title: "Library Reading Hall",
    date: "Open 8AM - 8PM",
    size: "large",
  },
  {
    id: 6,
    src: "/assets/CampusActivities.png",
    category: "Student Life",
    title: "Annual Sports Day",
    date: "Feb 10, 2026",
    size: "small",
  },
  {
    id: 7,
    src: "/assets/loyola.png",
    category: "Research",
    title: "Research Laboratory",
    date: "New Facility",
    size: "medium",
  },
  {
    id: 8,
    src: "/assets/graduation-ceremony.png",
    category: "Events",
    title: "Convocation Ceremony",
    date: "Nov 15, 2025",
    size: "small",
  },
  {
    id: 9,
    src: "/assets/loyola-building.png",
    category: "Campus",
    title: "Computer Centre",
    date: "Updated 2025",
    size: "small",
  },
];

const categories = [
  "All",
  "Campus",
  "Events",
  "Academic",
  "Student Life",
  "Research",
];

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryItems)[0] | null
  >(null);

  const filteredItems =
    filter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="w-full">
      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              filter === category
                ? "bg-primary text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid with CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-xl overflow-hidden cursor-pointer break-inside-avoid mb-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setSelectedImage(item)}
          >
            {/* Image Container */}
            <div
              className={`relative w-full ${
                item.size === "large"
                  ? "h-[400px]"
                  : item.size === "medium"
                    ? "h-[500px]"
                    : "h-[300px]"
              }`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

              {/* Category Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#0d4a33] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-sm tracking-widest">
                  {item.category}
                </span>
              </div>

              {/* Hover Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="bg-white/90 p-3 rounded-full text-primary transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                  <Search size={24} />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white text-xl font-bold mb-1 leading-tight drop-shadow-md">
                  {item.title}
                </h3>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  {item.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <div
            className="relative w-full max-w-6xl h-[80vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h2>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <span className="uppercase tracking-widest">
                  {selectedImage.category}
                </span>
                <span>•</span>
                <span>{selectedImage.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
