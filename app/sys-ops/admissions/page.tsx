// app/sys-ops/admissions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAcademicYearConfig } from "@/app/lib/academicYearConfig";
import { YearPicker } from "@/app/sys-ops/components/YearPicker";
import StatusBadge from "../components/StatusBadge";

interface Admission {
  id: number;
  user_email: string;
  full_name: string;
  mobile: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  form_status: string;
  payment_status: string;
  updated_at: string;
  created_at: string;
  exam_center_location: string;
  exam_center_name: string;
}

interface Program {
  id: number;
  discipline: string;
}

interface Degree {
  id: number;
  degree_name: string;
  program_level_id: number;
}

interface Course {
  id: number;
  course_name: string;
  degree_id: number;
}

interface ExamCenter {
  id: number;
  centre_name: string;
  location: string;
}

const generateApplicationId = (
  programLevelId: number,
  degreeId: number,
  courseId: number,
  dbId: number
): string => {
  const paddedId = String(dbId).padStart(3, "0");
  const paddedCourseId = String(courseId).padStart(2, "0");
  return `LC${programLevelId}${degreeId}${paddedCourseId}2026${paddedId}`;
};

export default function Admissions() {
  const router = useRouter();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const [perPage, setPerPage] = useState(20);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [filteredDegrees, setFilteredDegrees] = useState<Degree[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Get the current academic year from config
  const academicYearConfig = getAcademicYearConfig();
  const defaultYear = academicYearConfig.start.toString();

  useEffect(() => {
    fetchAdmissions();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    programFilter,
    degreeFilter,
    courseFilter,
    yearFilter,
    perPage,
  ]);

  useEffect(() => {
    fetchPrograms();
    fetchAllDegrees();
    fetchAllCourses();
    fetchExamCenters();
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (programFilter !== "all") {
      const filtered = degrees.filter(
        (d) => d.program_level_id === parseInt(programFilter)
      );
      setFilteredDegrees(filtered);
      setDegreeFilter("all");
      setCourseFilter("all");
    } else {
      setFilteredDegrees(degrees);
    }
  }, [programFilter, degrees]);

  useEffect(() => {
    if (degreeFilter !== "all") {
      const filtered = courses.filter(
        (c) => c.degree_id === parseInt(degreeFilter)
      );
      setFilteredCourses(filtered);
      setCourseFilter("all");
    } else if (programFilter !== "all") {
      const degreeIds = filteredDegrees.map((d) => d.id);
      const filtered = courses.filter((c) => degreeIds.includes(c.degree_id));
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [degreeFilter, programFilter, courses, filteredDegrees]);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch("/api/sys-ops/available-years");
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
        // Set initial year to academicYearConfig.start
        setYearFilter(defaultYear);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchAllDegrees = async () => {
    try {
      const response = await fetch("/api/degrees");
      const data = await response.json();
      setDegrees(data);
      setFilteredDegrees(data);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchExamCenters = async () => {
    try {
      const response = await fetch("/api/exam-centers");
      const data = await response.json();
      setExamCenters(data);
    } catch (error) {
      console.error("Error fetching exam centers:", error);
    }
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        search: searchTerm,
        status: statusFilter,
        program: programFilter,
        degree: degreeFilter,
        course: courseFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/admissions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAdmissions(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalRecords(data.total || 0);
      } else {
        toast.error("Failed to load admissions");
      }
    } catch (error) {
      toast.error("Error loading admissions");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (email: string) => {
    router.push(`/sys-ops/admissions/${encodeURIComponent(email)}`);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "10000",
        search: searchTerm,
        status: statusFilter,
        program: programFilter,
        degree: degreeFilter,
        course: courseFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/admissions?${params}`);
      if (response.ok) {
        const result = await response.json();

        const exportData = result.data.map((adm: Admission) => {
          const program = programs.find((p) => p.id === adm.program_level_id);
          const degree = degrees.find((d) => d.id === adm.degree_id);
          const course = courses.find((c) => c.id === adm.course_id);
          const examCenter = examCenters.find(
            (ec) => ec.id === adm.exam_center_id
          );

          return {
            "Application ID": generateApplicationId(
              adm.program_level_id,
              adm.degree_id,
              adm.course_id,
              adm.id
            ),
            Name: adm.full_name || "N/A",
            Email: adm.user_email,
            Mobile: adm.mobile || "N/A",
            Program: program?.discipline || "N/A",
            Degree: degree?.degree_name || "N/A",
            Course: course?.course_name || "N/A",
            Status:
              adm.payment_status === "completed"
                ? "Completed"
                : adm.form_status || "Draft",
            "Exam Center": examCenter
              ? `${examCenter.centre_name}${
                  examCenter.location ? ` - ${examCenter.location}` : ""
                }`
              : "Not Assigned",
          };
        });

        const csv = [
          Object.keys(exportData[0]).join(","),
          ...exportData.map((row: any) =>
            Object.values(row)
              .map((val) => `"${val}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `admissions-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        toast.success("Exported successfully");
      }
    } catch (error) {
      toast.error("Export failed");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setProgramFilter("all");
    setDegreeFilter("all");
    setCourseFilter("all");
    setYearFilter(defaultYear);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    programFilter !== "all" ||
    degreeFilter !== "all" ||
    courseFilter !== "all" ||
    yearFilter !== defaultYear;

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admissions</h1>
            <p className="text-gray-600 mt-1">
              Manage all admission applications
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  Filters:
                </span>
              </div>

              <YearPicker
                value={yearFilter}
                onChange={(year) => {
                  setYearFilter(year);
                  setCurrentPage(1);
                }}
                availableYears={availableYears}
                className="w-[160px]"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={programFilter}
                onChange={(e) => {
                  setProgramFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Programs</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.discipline}
                  </option>
                ))}
              </select>

              <select
                value={degreeFilter}
                onChange={(e) => {
                  setDegreeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={
                  programFilter === "all" && filteredDegrees.length === 0
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Degrees</option>
                {filteredDegrees.map((degree) => (
                  <option key={degree.id} value={degree.id}>
                    {degree.degree_name}
                  </option>
                ))}
              </select>

              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={
                  (programFilter === "all" && degreeFilter === "all") ||
                  filteredCourses.length === 0
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Courses</option>
                {filteredCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                    Search: {searchTerm}
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-blue-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {yearFilter !== defaultYear && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full">
                    Year: {yearFilter}
                    <button
                      onClick={() => {
                        setYearFilter(defaultYear);
                        setCurrentPage(1);
                      }}
                      className="hover:bg-indigo-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    Status: {statusFilter}
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-purple-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {programFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                    Program:{" "}
                    {programs.find((p) => p.id === parseInt(programFilter))
                      ?.discipline || programFilter}
                    <button
                      onClick={() => {
                        setProgramFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-green-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {degreeFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                    Degree:{" "}
                    {degrees.find((d) => d.id === parseInt(degreeFilter))
                      ?.degree_name || degreeFilter}
                    <button
                      onClick={() => {
                        setDegreeFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-yellow-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {courseFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 text-sm rounded-full">
                    Course:{" "}
                    {courses.find((c) => c.id === parseInt(courseFilter))
                      ?.course_name || courseFilter}
                    <button
                      onClick={() => {
                        setCourseFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-pink-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No applications found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Application ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Mobile
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Program
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Exam Center
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.map((admission) => {
                      const program = programs.find(
                        (p) => p.id === admission.program_level_id
                      );
                      return (
                        <tr
                          key={admission.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
                            {generateApplicationId(
                              admission.program_level_id,
                              admission.degree_id,
                              admission.course_id,
                              admission.id
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {admission.full_name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {admission.user_email}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {admission.mobile || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {program?.discipline || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              status={
                                admission.payment_status === "completed"
                                  ? "Completed"
                                  : admission.form_status || "Draft"
                              }
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {(() => {
                              const examCenter = examCenters.find(
                                (ec) => ec.id === admission.exam_center_id
                              );
                              return examCenter
                                ? `${examCenter.centre_name}${
                                    examCenter.location
                                      ? ` - ${examCenter.location}`
                                      : ""
                                  }`
                                : "Not Assigned";
                            })()}
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleView(admission.user_email)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {admissions.length} of {totalRecords} records (Page{" "}
                    {currentPage} of {totalPages})
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <Select
                      value={perPage.toString()}
                      onValueChange={(value) => {
                        setPerPage(parseInt(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px] h-9 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
