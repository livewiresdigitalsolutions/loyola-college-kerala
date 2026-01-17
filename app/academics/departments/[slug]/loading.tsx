import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="relative h-[400px] md:h-[500px] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-200"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="w-32 h-8 bg-gray-300 rounded-full mb-4"></div>
            <div className="w-3/4 h-16 bg-gray-300 rounded-lg mb-4"></div>
            <div className="w-1/2 h-6 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional skeleton sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mb-8 mx-auto animate-pulse"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
