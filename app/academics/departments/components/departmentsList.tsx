"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

interface Department {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  image: string | null;
  sort_order: number;
}

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/academics/departments");
        if (res.ok) setDepartments(await res.json());
      } catch (err) {
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(departments.map((d) => d.category).filter(Boolean))),
  ] as string[];

  // Filter
  const filtered = departments.filter((d) => {
    const matchesCategory =
      selectedCategory === "All" || d.category === selectedCategory;
    const matchesSearch =
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.short_description &&
        d.short_description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Departments
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of academic departments offering world-class education
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departments grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dept) => (
              <Link
                key={dept.id}
                href={`/academics/departments/${dept.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={dept.image || "/departmentsCoverImage/default.png"}
                      alt={dept.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {dept.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {dept.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    {dept.short_description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {dept.short_description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      Explore Department
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No departments found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
