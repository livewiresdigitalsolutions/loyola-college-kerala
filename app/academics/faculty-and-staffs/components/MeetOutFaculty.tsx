"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Filter, Mail, Phone } from "lucide-react";

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string | null;
  specialization: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  department: string | null;
  category: string | null;
  sort_order: number;
}

const ITEMS_PER_PAGE = 12;

export default function MeetOutFaculty() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("/api/academics/faculty");
        if (res.ok) setFaculty(await res.json());
      } catch (err) {
        console.error("Error fetching faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  // Get unique departments and categories
  const departments = [
    "All",
    ...Array.from(new Set(faculty.map((f) => f.department).filter(Boolean))),
  ] as string[];
  const categories = [
    "All",
    ...Array.from(new Set(faculty.map((f) => f.category).filter(Boolean))),
  ] as string[];

  // Filter faculty
  const filtered = faculty.filter((f) => {
    const matchesSearch =
      search === "" ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.designation.toLowerCase().includes(search.toLowerCase()) ||
      (f.specialization &&
        f.specialization.toLowerCase().includes(search.toLowerCase()));
    const matchesDept =
      selectedDepartment === "All" || f.department === selectedDepartment;
    const matchesCat =
      selectedCategory === "All" || f.category === selectedCategory;
    return matchesSearch && matchesDept && matchesCat;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedFaculty = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDepartment, selectedCategory]);

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
            Meet Our Faculty
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our distinguished team of educators and researchers driving academic excellence
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search faculty by name, designation, or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Department filter */}
          {departments.length > 2 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-9 pr-8 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none bg-white cursor-pointer min-w-[180px]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing {paginatedFaculty.length} of {filtered.length} faculty member
          {filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Faculty grid */}
        {paginatedFaculty.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedFaculty.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  <Image
                    src={member.image || "/assets/defaultprofile.png"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-1">
                    {member.designation}
                  </p>
                  {member.qualification && (
                    <p className="text-gray-500 text-xs mb-2">
                      {member.qualification}
                    </p>
                  )}
                  {member.specialization && (
                    <p className="text-gray-500 text-xs italic mb-3">
                      {member.specialization}
                    </p>
                  )}
                  {member.department && (
                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mb-3">
                      {member.department}
                    </span>
                  )}

                  {/* Contact */}
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No faculty members found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
