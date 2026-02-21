"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Visitor {
  id: number;
  name: string;
  title: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

export default function EvGallery() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch("/api/about");
        const data = await response.json();
        if (data.success) {
          setVisitors(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching eminent visitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">
            Eminent Visitors
          </h2>
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded mb-4"></div>
                <div className="w-12 h-1 bg-gray-200 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (visitors.length === 0) {
    return (
      <section className="w-full bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Eminent Visitors
          </h2>
          <p className="text-gray-500 text-lg">No visitors to display yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADING */}
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">
          Eminent Visitors
        </h2>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="group">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <Image
                  src={visitor.image_url}
                  alt={visitor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* ACCENT LINE */}
              <div className="w-12 h-1 bg-primary mb-3"></div>

              {/* NAME */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {visitor.name}
              </h3>

              {/* TITLE */}
              {visitor.title && (
                <p className="text-sm text-gray-600">{visitor.title}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
