// app/sys-ops/volunteers/page.tsx
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
import StatusBadge from "../../components/StatusBadge";
import { Users, Calendar, MapPin } from "lucide-react";

interface Volunteer {
  id: number;
  user_email: string;
  name: string;
  contact_number: string;
  educational_qualification: string;
  institute_name: string;
  program_preference: string;
  duration: string;
  gender: string;
  age: string;
  address: string;
  email: string;
  form_status: string;
  payment_status?: string;
  updated_at: string;
  created_at: string;
}

interface ProgramOption {
  id: number;
  name: string;
}

const generateVolunteerId = (dbId: number): string => {
  const paddedId = String(dbId).padStart(4, "0");
  return `VOLS${paddedId}`;
};

export default function Volunteers() {
  const router = useRouter();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const [perPage, setPerPage] = useState(20);

  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Get the current academic year from config
  const academicYearConfig = getAcademicYearConfig();
  const defaultYear = academicYearConfig.start.toString();

  useEffect(() => {
    fetchVolunteers();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    programFilter,
    qualificationFilter,
    yearFilter,
    perPage,
  ]);

  useEffect(() => {
    fetchProgramOptions();
    fetchAvailableYears();
  }, []);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch("/api/sys-ops/available-years");
      if (response.ok) {
        const years = await response.json();
        setAvailableYears(years);
        setYearFilter(defaultYear);
      }
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  const fetchProgramOptions = async () => {
    try {
      const response = await fetch("/api/volunteer-programs");
      const data = await response.json();
      setProgramOptions(data);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        search: searchTerm,
        status: statusFilter,
        program: programFilter,
        qualification: qualificationFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/volunteers?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalRecords(data.total || 0);
      } else {
        toast.error("Failed to load volunteers");
      }
    } catch (error) {
      toast.error("Error loading volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userEmail: string) => {
    router.push(`/sys-ops/volunteers/${encodeURIComponent(userEmail)}`);
  };

  const handleDelete = async (userEmail: string) => {
    if (!confirm("Are you sure you want to delete this volunteer application?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sys-ops/volunteers/${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Volunteer application deleted successfully");
        fetchVolunteers();
      } else {
        toast.error("Failed to delete volunteer application");
      }
    } catch (error) {
      toast.error("Error deleting volunteer application");
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "10000",
        search: searchTerm,
        status: statusFilter,
        program: programFilter,
        qualification: qualificationFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/volunteers?${params}`);
      if (response.ok) {
        const result = await response.json();

        const exportData = result.data.map((vol: Volunteer) => {
          const program = programOptions.find((p) => p.id === parseInt(vol.program_preference || "0"));
          return {
            "Volunteer ID": generateVolunteerId(vol.id),
            Name: vol.name || "N/A",
            Email: vol.user_email,
            "Contact Number": vol.contact_number || "N/A",
            "Educational Qualification": vol.educational_qualification || "N/A",
            "Institute Name": vol.institute_name || "N/A",
            "Program Preference": program?.name || vol.program_preference || "N/A",
            Duration: vol.duration || "N/A",
            Status: vol.payment_status === "completed" ? "Completed" : vol.form_status || "Draft",
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
        a.download = `volunteers-${new Date().toISOString().split("T")[0]}.csv`;
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
    setQualificationFilter("all");
    setYearFilter(defaultYear);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    programFilter !== "all" ||
    qualificationFilter !== "all" ||
    yearFilter !== defaultYear;

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Volunteers & Internships</h1>
            <p className="text-gray-600 mt-1">
              Manage all volunteer and internship registrations
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
                placeholder="Search by name, email, contact, or institute..."
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
                <span className="text-sm font-semibold text-gray-700">Filters:</span>
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
                {programOptions.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>

              <select
                value={qualificationFilter}
                onChange={(e) => {
                  setQualificationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Qualifications</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="UG">Undergraduate</option>
                <option value="PG">Postgraduate</option>
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
                    <button className="hover:bg-indigo-100 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                    Status: {statusFilter}
                    <button className="hover:bg-purple-100 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {programFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                    Program: {programOptions.find((p) => p.id === parseInt(programFilter))?.name || programFilter}
                    <button className="hover:bg-green-100 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {qualificationFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                    Qualification: {qualificationFilter}
                    <button className="hover:bg-yellow-100 rounded-full p-0.5">
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
          ) : volunteers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No volunteers found</p>
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
                        Volunteer ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Qualification
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Institute
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Program
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers.map((volunteer) => {
                      const program = programOptions.find(
                        (p) => p.id === parseInt(volunteer.program_preference || "0")
                      );
                      return (
                        <tr
                          key={volunteer.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
                            {generateVolunteerId(volunteer.id)}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {volunteer.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {volunteer.user_email}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {volunteer.contact_number || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {volunteer.educational_qualification || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-[150px]">
                            {volunteer.institute_name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {program?.name || volunteer.program_preference || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {volunteer.duration || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              status={
                                volunteer.payment_status === "completed"
                                  ? "Completed"
                                  : volunteer.form_status || "Draft"
                              }
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewDetails(volunteer.user_email)}
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
                    Showing {volunteers.length} of {totalRecords} records (Page{" "}
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



