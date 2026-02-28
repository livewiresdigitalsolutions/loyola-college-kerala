// app/sys-ops/appointments/page.tsx
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

interface Appointment {
  id: number;
  user_email: string;
  name: string;
  mobile_number: string;
  counseling_date: string;
  counseling_staff: string;
  counseling_slot: string;
  form_status: string;
  payment_status?: string;
  updated_at: string;
  created_at: string;
}

interface StaffMember {
  id: number;
  name: string;
}

const generateAppointmentId = (dbId: number): string => {
  const paddedId = String(dbId).padStart(4, "0");
  return `APPT${paddedId}`;
};

export default function Appointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [slotFilter, setSlotFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [yearFilter, setYearFilter] = useState("");
  const [perPage, setPerPage] = useState(20);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Get the current academic year from config
  const academicYearConfig = getAcademicYearConfig();
  const defaultYear = academicYearConfig.start.toString();

  useEffect(() => {
    fetchAppointments();
  }, [
    currentPage,
    searchTerm,
    statusFilter,
    staffFilter,
    slotFilter,
    yearFilter,
    perPage,
  ]);

  useEffect(() => {
    fetchStaffMembers();
    fetchAvailableYears();
  }, []);

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
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const response = await fetch("/api/counseling-staff");
      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        search: searchTerm,
        status: statusFilter,
        staff: staffFilter,
        slot: slotFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/appointments?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
        setTotalPages(data.pages || 1);
        setTotalRecords(data.total || 0);
      } else {
        toast.error("Failed to load appointments");
      }
    } catch (error) {
      toast.error("Error loading appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userEmail: string) => {
    router.push(`/sys-ops/appointments/${encodeURIComponent(userEmail)}`);
  };

  const handleDelete = async (userEmail: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sys-ops/appointments/${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Appointment deleted successfully");
        fetchAppointments();
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      toast.error("Error deleting appointment");
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "10000",
        search: searchTerm,
        status: statusFilter,
        staff: staffFilter,
        slot: slotFilter,
        year: yearFilter,
      });

      const response = await fetch(`/api/sys-ops/appointments?${params}`);
      if (response.ok) {
        const result = await response.json();

        const exportData = result.data.map((appt: Appointment) => {
          const staff = staffMembers.find((s) => s.id === parseInt(appt.counseling_staff));
          return {
            "Appointment ID": generateAppointmentId(appt.id),
            Name: appt.name || "N/A",
            Email: appt.user_email,
            "Mobile Number": appt.mobile_number || "N/A",
            "Counseling Date": new Date(appt.counseling_date).toLocaleDateString(),
            "Counseling Staff": staff?.name || appt.counseling_staff || "N/A",
            "Counseling Slot": appt.counseling_slot || "N/A",
            Status: appt.payment_status === "completed" ? "Completed" : appt.form_status || "Draft",
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
        a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
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
    setStaffFilter("all");
    setSlotFilter("all");
    setYearFilter(defaultYear);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    staffFilter !== "all" ||
    slotFilter !== "all" ||
    yearFilter !== defaultYear;

  // Slot options for filter
  const slotOptions = ["Morning", "Afternoon", "Evening", "all"];

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Counseling Appointments</h1>
            <p className="text-gray-600 mt-1">
              Manage all counseling appointment bookings
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
                value={staffFilter}
                onChange={(e) => {
                  setStaffFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Staff</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>

              <select
                value={slotFilter}
                onChange={(e) => {
                  setSlotFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
              >
                <option value="all">All Slots</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
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
                {staffFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                    Staff: {staffMembers.find((s) => s.id === parseInt(staffFilter))?.name || staffFilter}
                    <button
                      onClick={() => {
                        setStaffFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-green-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {slotFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                    Slot: {slotFilter}
                    <button
                      onClick={() => {
                        setSlotFilter("all");
                        setCurrentPage(1);
                      }}
                      className="hover:bg-yellow-100 rounded-full p-0.5"
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
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No appointments found</p>
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
                        Appointment ID
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
                        Counseling Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Staff
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Slot
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
                    {appointments.map((appointment) => {
                      const staff = staffMembers.find(
                        (s) => s.id === parseInt(appointment.counseling_staff || "0")
                      );
                      return (
                        <tr
                          key={appointment.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
                            {generateAppointmentId(appointment.id)}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {appointment.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {appointment.user_email}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {appointment.mobile_number || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(appointment.counseling_date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {staff?.name || appointment.counseling_staff || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {appointment.counseling_slot || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge
                              status={
                                appointment.payment_status === "completed"
                                  ? "Completed"
                                  : appointment.form_status || "Draft"
                              }
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleViewDetails(appointment.user_email)}
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
                    Showing {appointments.length} of {totalRecords} records (Page{" "}
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
