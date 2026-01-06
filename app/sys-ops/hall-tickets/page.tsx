// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast, Toaster } from "react-hot-toast";
// import {
//   Search,
//   Filter,
//   Download,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Calendar,
//   Clock,
//   CheckSquare,
//   Square,
// } from "lucide-react";
// import StatusBadge from "../components/StatusBadge";

// interface Admission {
//   id: number;
//   user_email: string;
//   full_name: string;
//   father_name: string;
//   mobile: string;
//   email: string;
//   program_level_id: number;
//   degree_id: number;
//   course_id: number;
//   exam_center_id: number;
//   payment_status: string;
//   form_status: string;
//   created_at: string;
//   updated_at: string;
// }

// interface HallTicket {
//   id: number;
//   admission_id: number;
//   application_id: string;
//   full_name: string;
//   father_name: string;
//   mobile: string;
//   email: string;
//   program_level_id: number;
//   degree_id: number;
//   course_id: number;
//   exam_center_id: number;
//   exam_date: string;
//   exam_time: string;
//   status: string;
//   created_at: string;
// }

// interface Program {
//   id: number;
//   discipline: string;
// }

// interface Degree {
//   id: number;
//   degree_name: string;
//   program_level_id: number;
// }

// interface Course {
//   id: number;
//   course_name: string;
//   degree_id: number;
// }

// interface ExamCenter {
//   id: number;
//   centre_name: string;
//   location: string;
// }

// const generateApplicationId = (
//   programLevelId: number,
//   degreeId: number,
//   courseId: number,
//   dbId: number
// ): string => {
//   const paddedId = String(dbId).padStart(2, "0");
//   const paddedCourseId = String(courseId).padStart(2, "0");
//   return `LC${programLevelId}${degreeId}${paddedCourseId}20265${paddedId}`;
// };

// export default function HallTicketsPage() {
//   const router = useRouter();

//   // Academic Year
//   const [academicYear, setAcademicYear] = useState("2026");

//   // Available admissions (not yet allocated)
//   const [admissions, setAdmissions] = useState<Admission[]>([]);
//   const [selectedAdmissions, setSelectedAdmissions] = useState<number[]>([]);
//   const [loadingAdmissions, setLoadingAdmissions] = useState(true);

//   // Filters
//   const [searchTerm, setSearchTerm] = useState("");
//   const [programFilter, setProgramFilter] = useState("all");
//   const [degreeFilter, setDegreeFilter] = useState("all");
//   const [courseFilter, setCourseFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const perPage = 10;

//   // Master data
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [degrees, setDegrees] = useState<Degree[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
//   const [filteredDegrees, setFilteredDegrees] = useState<Degree[]>([]);
//   const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

//   // Allocation state
//   const [examDate, setExamDate] = useState("");
//   const [examTime, setExamTime] = useState("");
//   const [isAllocating, setIsAllocating] = useState(false);

//   // Already allocated hall tickets
//   const [allocatedTickets, setAllocatedTickets] = useState<HallTicket[]>([]);
//   const [showAllocated, setShowAllocated] = useState(false);

//   useEffect(() => {
//     fetchAvailableAdmissions();
//   }, [currentPage, searchTerm, programFilter, degreeFilter, courseFilter, academicYear]);

//   useEffect(() => {
//     fetchPrograms();
//     fetchAllDegrees();
//     fetchAllCourses();
//     fetchExamCenters();
//     fetchAllocatedTickets();
//   }, [academicYear]);

//   useEffect(() => {
//     if (programFilter !== "all") {
//       const filtered = degrees.filter(
//         (d) => d.program_level_id === parseInt(programFilter)
//       );
//       setFilteredDegrees(filtered);
//       setDegreeFilter("all");
//       setCourseFilter("all");
//     } else {
//       setFilteredDegrees(degrees);
//     }
//   }, [programFilter, degrees]);

//   useEffect(() => {
//     if (degreeFilter !== "all") {
//       const filtered = courses.filter(
//         (c) => c.degree_id === parseInt(degreeFilter)
//       );
//       setFilteredCourses(filtered);
//       setCourseFilter("all");
//     } else if (programFilter !== "all") {
//       const degreeIds = filteredDegrees.map((d) => d.id);
//       const filtered = courses.filter((c) => degreeIds.includes(c.degree_id));
//       setFilteredCourses(filtered);
//     } else {
//       setFilteredCourses(courses);
//     }
//   }, [degreeFilter, programFilter, courses, filteredDegrees]);

//   const fetchPrograms = async () => {
//     try {
//       const response = await fetch("/api/programs");
//       const data = await response.json();
//       setPrograms(data);
//     } catch (error) {
//       console.error("Error fetching programs:", error);
//     }
//   };

//   const fetchAllDegrees = async () => {
//     try {
//       const response = await fetch("/api/degrees");
//       const data = await response.json();
//       setDegrees(data);
//       setFilteredDegrees(data);
//     } catch (error) {
//       console.error("Error fetching degrees:", error);
//     }
//   };

//   const fetchAllCourses = async () => {
//     try {
//       const response = await fetch("/api/courses");
//       const data = await response.json();
//       setCourses(data);
//       setFilteredCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const fetchExamCenters = async () => {
//     try {
//       const response = await fetch("/api/exam-centers");
//       const data = await response.json();
//       setExamCenters(data);
//     } catch (error) {
//       console.error("Error fetching exam centers:", error);
//     }
//   };

//   const fetchAvailableAdmissions = async () => {
//     setLoadingAdmissions(true);
//     try {
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         perPage: perPage.toString(),
//         search: searchTerm,
//         status: "completed",
//         program: programFilter,
//         degree: degreeFilter,
//         course: courseFilter,
//         year: academicYear,
//       });

//       const response = await fetch(`/api/sys-ops/admissions/available?${params}`);
//       if (response.ok) {
//         const data = await response.json();
//         setAdmissions(data.data || []);
//         setTotalPages(data.pages || 1);
//         setTotalRecords(data.total || 0);
//       } else {
//         toast.error("Failed to load admissions");
//       }
//     } catch (error) {
//       toast.error("Error loading admissions");
//     } finally {
//       setLoadingAdmissions(false);
//     }
//   };

//   const fetchAllocatedTickets = async () => {
//     try {
//       const response = await fetch(`/api/sys-ops/hall-tickets?year=${academicYear}&page=1&perPage=1000`);
//       if (response.ok) {
//         const data = await response.json();
//         setAllocatedTickets(data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching allocated tickets:", error);
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectedAdmissions.length === admissions.length) {
//       setSelectedAdmissions([]);
//     } else {
//       setSelectedAdmissions(admissions.map((a) => a.id));
//     }
//   };

//   const handleSelectAdmission = (id: number) => {
//     setSelectedAdmissions((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const handleAllocate = async () => {
//     if (selectedAdmissions.length === 0) {
//       toast.error("Please select at least one admission");
//       return;
//     }

//     if (!examDate || !examTime) {
//       toast.error("Please select exam date and time");
//       return;
//     }

//     setIsAllocating(true);
//     try {
//       const tickets = selectedAdmissions.map((admissionId) => {
//         const admission = admissions.find((a) => a.id === admissionId)!;
//         return {
//           admission_id: admission.id,
//           application_id: generateApplicationId(
//             admission.program_level_id,
//             admission.degree_id,
//             admission.course_id,
//             admission.id
//           ),
//           full_name: admission.full_name,
//           father_name: admission.father_name,
//           mobile: admission.mobile,
//           email: admission.email,
//           program_level_id: admission.program_level_id,
//           degree_id: admission.degree_id,
//           course_id: admission.course_id,
//           exam_center_id: admission.exam_center_id,
//           exam_date: examDate,
//           exam_time: examTime,
//         };
//       });

//       const response = await fetch("/api/sys-ops/hall-tickets", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ tickets }),
//       });

//       if (response.ok) {
//         toast.success(`${tickets.length} hall ticket(s) allocated successfully`);
//         setSelectedAdmissions([]);
//         setExamDate("");
//         setExamTime("");
//         fetchAvailableAdmissions();
//         fetchAllocatedTickets();
//       } else {
//         const error = await response.json();
//         toast.error(error.error || "Failed to allocate hall tickets");
//       }
//     } catch (error) {
//       toast.error("Error allocating hall tickets");
//     } finally {
//       setIsAllocating(false);
//     }
//   };

//   const handleExport = async () => {
//     try {
//       const params = new URLSearchParams({
//         page: "1",
//         perPage: "100000",
//         search: searchTerm,
//         program: programFilter,
//         degree: degreeFilter,
//         course: courseFilter,
//         year: academicYear,
//       });

//       const response = await fetch(`/api/sys-ops/admissions/available?${params}`);
//       if (response.ok) {
//         const result = await response.json();

//         if (!result.data || result.data.length === 0) {
//           toast("No data to export for the selected year and filters.", {
//             style: {
//               background: "#3b82f6",
//               color: "#fff",
//             },
//           });
//           return;
//         }

//         const exportData = result.data.map((adm: Admission) => {
//           const program = programs.find((p) => p.id === adm.program_level_id);
//           const degree = degrees.find((d) => d.id === adm.degree_id);
//           const course = courses.find((c) => c.id === adm.course_id);
//           const examCenter = examCenters.find((ec) => ec.id === adm.exam_center_id);

//           return {
//             "Application ID": generateApplicationId(
//               adm.program_level_id,
//               adm.degree_id,
//               adm.course_id,
//               adm.id
//             ),
//             "Name": adm.full_name || "N/A",
//             "Email": adm.email,
//             "Mobile": adm.mobile || "N/A",
//             "Program": program?.discipline || "N/A",
//             "Degree": degree?.degree_name || "N/A",
//             "Course": course?.course_name || "N/A",
//             "Exam Center": examCenter?.centre_name || "N/A",
//             "Status": "Available for Allocation",
//             "Academic Year": academicYear,
//           };
//         });

//         const csv = [
//           Object.keys(exportData[0]).join(","),
//           ...exportData.map((row: any) =>
//             Object.values(row)
//               .map((val) => `"${String(val).replace(/"/g, '""')}"`)
//               .join(",")
//           ),
//         ].join("\n");

//         const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `available-admissions-${academicYear}-${new Date().toISOString().split("T")[0]}.csv`;
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//         toast.success("Exported successfully");
//       } else {
//         toast.error("Export failed");
//       }
//     } catch (error) {
//       console.error("Export error:", error);
//       toast.error("Export failed");
//     }
//   };

//   const handleViewAllocated = (id: number) => {
//     router.push(`/sys-ops/hall-tickets/${id}`);
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setProgramFilter("all");
//     setDegreeFilter("all");
//     setCourseFilter("all");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     searchTerm !== "" ||
//     programFilter !== "all" ||
//     degreeFilter !== "all" ||
//     courseFilter !== "all";

//   const getExamCenterName = (examCenterId: number): string => {
//     const center = examCenters.find((ec) => ec.id === examCenterId);
//     return center ? `${center.centre_name} (${center.location})` : "N/A";
//   };

//   return (
//     <>
//       <Toaster position="top-right" />
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Hall Ticket Allocation</h1>
//             <p className="text-gray-600 mt-1">
//               Allocate exam dates to students and manage hall tickets
//             </p>
//           </div>
//           <div className="flex gap-3 items-center">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-semibold text-gray-700">Academic Year:</span>
//               <select
//                 value={academicYear}
//                 onChange={(e) => {
//                   setAcademicYear(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm font-semibold"
//               >
//                 <option value="2026">2026</option>
//               </select>
//             </div>
//             <button
//               onClick={() => setShowAllocated(!showAllocated)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Eye className="w-4 h-4" />
//               {showAllocated ? "Show Available" : "Show Allocated"} ({showAllocated ? admissions.length : allocatedTickets.length})
//             </button>
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#2a2470] transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Allocation Panel - Only show when on available admissions view */}
//         {!showAllocated && selectedAdmissions.length > 0 && (
//           <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-2">
//                   Allocate Exam Details ({selectedAdmissions.length} selected)
//                 </h3>
//                 <div className="flex gap-4 items-end">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <Calendar className="w-4 h-4 inline mr-1" />
//                       Exam Date
//                     </label>
//                     <input
//                       type="date"
//                       value={examDate}
//                       onChange={(e) => setExamDate(e.target.value)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//                       min={new Date().toISOString().split('T')[0]}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       <Clock className="w-4 h-4 inline mr-1" />
//                       Exam Time
//                     </label>
//                     <input
//                       type="time"
//                       value={examTime}
//                       onChange={(e) => setExamTime(e.target.value)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//                     />
//                   </div>
//                   <button
//                     onClick={handleAllocate}
//                     disabled={isAllocating || !examDate || !examTime}
//                     className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   >
//                     {isAllocating ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Allocating...
//                       </>
//                     ) : (
//                       <>
//                         <CheckSquare className="w-4 h-4" />
//                         Allot Exam
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={() => setSelectedAdmissions([])}
//                     className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
//                   >
//                     Clear Selection
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           {/* Filters */}
//           {!showAllocated && (
//             <div className="flex flex-col gap-4 mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or mobile..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
//                 />
//               </div>

//               <div className="flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <Filter className="w-5 h-5 text-gray-400" />
//                   <span className="text-sm font-semibold text-gray-700">
//                     Filters:
//                   </span>
//                 </div>

//                 <select
//                   value={programFilter}
//                   onChange={(e) => {
//                     setProgramFilter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
//                 >
//                   <option value="all">All Programs</option>
//                   {programs.map((program) => (
//                     <option key={program.id} value={program.id}>
//                       {program.discipline}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   value={degreeFilter}
//                   onChange={(e) => {
//                     setDegreeFilter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   disabled={programFilter === "all" && filteredDegrees.length === 0}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <option value="all">All Degrees</option>
//                   {filteredDegrees.map((degree) => (
//                     <option key={degree.id} value={degree.id}>
//                       {degree.degree_name}
//                     </option>
//                   ))}
//                 </select>

//                 <select
//                   value={courseFilter}
//                   onChange={(e) => {
//                     setCourseFilter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   disabled={
//                     (programFilter === "all" && degreeFilter === "all") ||
//                     filteredCourses.length === 0
//                   }
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <option value="all">All Courses</option>
//                   {filteredCourses.map((course) => (
//                     <option key={course.id} value={course.id}>
//                       {course.course_name}
//                     </option>
//                   ))}
//                 </select>

//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearFilters}
//                     className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                     Clear Filters
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Table */}
//           {loadingAdmissions ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//             </div>
//           ) : showAllocated ? (
//             // Allocated Tickets Table
//             allocatedTickets.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No hall tickets allocated yet</p>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Application ID
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Name
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Email
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Exam Center
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Exam Date
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Exam Time
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Status
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {allocatedTickets.map((ticket) => (
//                         <tr
//                           key={ticket.id}
//                           className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
//                             {ticket.application_id}
//                           </td>
//                           <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                             {ticket.full_name}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {ticket.email}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {getExamCenterName(ticket.exam_center_id)}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {new Date(ticket.exam_date).toLocaleDateString("en-IN")}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {ticket.exam_time}
//                           </td>
//                           <td className="py-3 px-4">
//                             <StatusBadge status={ticket.status} />
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )
//           ) : (
//             // Available Admissions Table
//             admissions.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No admissions available for allocation</p>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearFilters}
//                     className="mt-4 text-primary hover:underline"
//                   >
//                     Clear all filters
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           <button
//                             onClick={handleSelectAll}
//                             className="flex items-center gap-2 hover:text-primary transition-colors"
//                           >
//                             {selectedAdmissions.length === admissions.length ? (
//                               <CheckSquare className="w-5 h-5 text-primary" />
//                             ) : (
//                               <Square className="w-5 h-5" />
//                             )}
//                             Select All
//                           </button>
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Application ID
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Name
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Email
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Mobile
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Program
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Exam Center
//                         </th>
//                         <th className="text-left py-3 px-4 font-semibold text-gray-700">
//                           Submitted
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {admissions.map((admission) => {
//                         const program = programs.find(
//                           (p) => p.id === admission.program_level_id
//                         );
//                         const isSelected = selectedAdmissions.includes(admission.id);

//                         return (
//                           <tr
//                             key={admission.id}
//                             className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
//                               isSelected ? "bg-blue-50" : ""
//                             }`}
//                             onClick={() => handleSelectAdmission(admission.id)}
//                           >
//                             <td className="py-3 px-4">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleSelectAdmission(admission.id);
//                                 }}
//                                 className="hover:scale-110 transition-transform"
//                               >
//                                 {isSelected ? (
//                                   <CheckSquare className="w-5 h-5 text-primary" />
//                                 ) : (
//                                   <Square className="w-5 h-5 text-gray-400" />
//                                 )}
//                               </button>
//                             </td>
//                             <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
//                               {generateApplicationId(
//                                 admission.program_level_id,
//                                 admission.degree_id,
//                                 admission.course_id,
//                                 admission.id
//                               )}
//                             </td>
//                             <td className="py-3 px-4 text-sm font-medium text-gray-900">
//                               {admission.full_name || "N/A"}
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                               {admission.email}
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                               {admission.mobile || "N/A"}
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                               {program?.discipline || "N/A"}
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                               {getExamCenterName(admission.exam_center_id)}
//                             </td>
//                             <td className="py-3 px-4 text-sm text-gray-600">
//                               {new Date(admission.updated_at).toLocaleDateString()}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-between mt-6">
//                   <p className="text-sm text-gray-600">
//                     Showing {admissions.length} of {totalRecords} records (Page{" "}
//                     {currentPage} of {totalPages})
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                       disabled={currentPage === 1}
//                       className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() =>
//                         setCurrentPage((p) => Math.min(totalPages, p + 1))
//                       }
//                       disabled={currentPage === totalPages}
//                       className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )
//           )}
//         </div>
//       </div>
//     </>
//   );
// }














// app/sys-ops/hall-tickets/page.tsx
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
  Calendar,
  Clock,
  CheckSquare,
  Square,
} from "lucide-react";
import { getAcademicYearConfig } from "@/app/lib/academicYearConfig";
import { YearPicker } from "@/app/sys-ops/components/YearPicker";
import StatusBadge from "../components/StatusBadge";

interface Admission {
  id: number;
  user_email: string;
  full_name: string;
  father_name: string;
  mobile: string;
  email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  payment_status: string;
  form_status: string;
  created_at: string;
  updated_at: string;
}

interface HallTicket {
  id: number;
  admission_id: number;
  application_id: string;
  full_name: string;
  father_name: string;
  mobile: string;
  email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  exam_date: string;
  exam_time: string;
  status: string;
  created_at: string;
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
  const paddedId = String(dbId).padStart(2, "0");
  const paddedCourseId = String(courseId).padStart(2, "0");
  return `LC${programLevelId}${degreeId}${paddedCourseId}20265${paddedId}`;
};

export default function HallTicketsPage() {
  const router = useRouter();

  // Get academic year config
  const academicYearConfig = getAcademicYearConfig();
  const defaultYear = academicYearConfig.start.toString();

  // Academic Year
  const [academicYear, setAcademicYear] = useState(defaultYear);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Available admissions (not yet allocated)
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [selectedAdmissions, setSelectedAdmissions] = useState<number[]>([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const perPage = 10;

  // Master data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
  const [filteredDegrees, setFilteredDegrees] = useState<Degree[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Allocation state
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [isAllocating, setIsAllocating] = useState(false);

  // Already allocated hall tickets
  const [allocatedTickets, setAllocatedTickets] = useState<HallTicket[]>([]);
  const [showAllocated, setShowAllocated] = useState(false);

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    fetchAvailableAdmissions();
  }, [currentPage, searchTerm, programFilter, degreeFilter, courseFilter, academicYear]);

  useEffect(() => {
    fetchPrograms();
    fetchAllDegrees();
    fetchAllCourses();
    fetchExamCenters();
    fetchAllocatedTickets();
  }, [academicYear]);

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

  const fetchAvailableAdmissions = async () => {
    setLoadingAdmissions(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        perPage: perPage.toString(),
        search: searchTerm,
        status: "completed",
        program: programFilter,
        degree: degreeFilter,
        course: courseFilter,
        year: academicYear,
      });

      const response = await fetch(`/api/sys-ops/admissions/available?${params}`);
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
      setLoadingAdmissions(false);
    }
  };

  const fetchAllocatedTickets = async () => {
    try {
      const response = await fetch(`/api/sys-ops/hall-tickets?year=${academicYear}&page=1&perPage=1000`);
      if (response.ok) {
        const data = await response.json();
        setAllocatedTickets(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching allocated tickets:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedAdmissions.length === admissions.length) {
      setSelectedAdmissions([]);
    } else {
      setSelectedAdmissions(admissions.map((a) => a.id));
    }
  };

  const handleSelectAdmission = (id: number) => {
    setSelectedAdmissions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAllocate = async () => {
    if (selectedAdmissions.length === 0) {
      toast.error("Please select at least one admission");
      return;
    }

    if (!examDate || !examTime) {
      toast.error("Please select exam date and time");
      return;
    }

    setIsAllocating(true);
    try {
      const tickets = selectedAdmissions.map((admissionId) => {
        const admission = admissions.find((a) => a.id === admissionId)!;
        return {
          admission_id: admission.id,
          application_id: generateApplicationId(
            admission.program_level_id,
            admission.degree_id,
            admission.course_id,
            admission.id
          ),
          full_name: admission.full_name,
          father_name: admission.father_name,
          mobile: admission.mobile,
          email: admission.email,
          program_level_id: admission.program_level_id,
          degree_id: admission.degree_id,
          course_id: admission.course_id,
          exam_center_id: admission.exam_center_id,
          exam_date: examDate,
          exam_time: examTime,
        };
      });

      const response = await fetch("/api/sys-ops/hall-tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets }),
      });

      if (response.ok) {
        toast.success(`${tickets.length} hall ticket(s) allocated successfully`);
        setSelectedAdmissions([]);
        setExamDate("");
        setExamTime("");
        fetchAvailableAdmissions();
        fetchAllocatedTickets();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to allocate hall tickets");
      }
    } catch (error) {
      toast.error("Error allocating hall tickets");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "100000",
        search: searchTerm,
        program: programFilter,
        degree: degreeFilter,
        course: courseFilter,
        year: academicYear,
      });

      const response = await fetch(`/api/sys-ops/admissions/available?${params}`);
      if (response.ok) {
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
          toast("No data to export for the selected year and filters.", {
            style: {
              background: "#3b82f6",
              color: "#fff",
            },
          });
          return;
        }

        const exportData = result.data.map((adm: Admission) => {
          const program = programs.find((p) => p.id === adm.program_level_id);
          const degree = degrees.find((d) => d.id === adm.degree_id);
          const course = courses.find((c) => c.id === adm.course_id);
          const examCenter = examCenters.find((ec) => ec.id === adm.exam_center_id);

          return {
            "Application ID": generateApplicationId(
              adm.program_level_id,
              adm.degree_id,
              adm.course_id,
              adm.id
            ),
            "Name": adm.full_name || "N/A",
            "Email": adm.email,
            "Mobile": adm.mobile || "N/A",
            "Program": program?.discipline || "N/A",
            "Degree": degree?.degree_name || "N/A",
            "Course": course?.course_name || "N/A",
            "Exam Center": examCenter?.centre_name || "N/A",
            "Status": "Available for Allocation",
            "Academic Year": academicYear,
          };
        });

        const csv = [
          Object.keys(exportData[0]).join(","),
          ...exportData.map((row: any) =>
            Object.values(row)
              .map((val) => `"${String(val).replace(/"/g, '""')}"`)
              .join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `available-admissions-${academicYear}-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Exported successfully");
      } else {
        toast.error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed");
    }
  };

  const handleViewAllocated = (id: number) => {
    router.push(`/sys-ops/hall-tickets/${id}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setProgramFilter("all");
    setDegreeFilter("all");
    setCourseFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    programFilter !== "all" ||
    degreeFilter !== "all" ||
    courseFilter !== "all";

  const getExamCenterName = (examCenterId: number): string => {
    const center = examCenters.find((ec) => ec.id === examCenterId);
    return center ? `${center.centre_name} (${center.location})` : "N/A";
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hall Ticket Allocation</h1>
            <p className="text-gray-600 mt-1">
              Allocate exam dates to students and manage hall tickets
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Year Picker with Calendar UI */}
            <YearPicker
              value={academicYear}
              onChange={(year) => {
                setAcademicYear(year);
                setCurrentPage(1);
              }}
              availableYears={availableYears}
              className="w-[160px]"
            />
            
            <button
              onClick={() => setShowAllocated(!showAllocated)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showAllocated ? "Show Available" : "Show Allocated"} ({showAllocated ? admissions.length : allocatedTickets.length})
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Allocation Panel - Only show when on available admissions view */}
        {!showAllocated && selectedAdmissions.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Allocate Exam Details ({selectedAdmissions.length} selected)
                </h3>
                <div className="flex gap-4 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Exam Date
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Exam Time
                    </label>
                    <input
                      type="time"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handleAllocate}
                    disabled={isAllocating || !examDate || !examTime}
                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAllocating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Allocating...
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        Allot Exam
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedAdmissions([])}
                    className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Filters */}
          {!showAllocated && (
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
                  disabled={programFilter === "all" && filteredDegrees.length === 0}
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
            </div>
          )}

          {/* Rest of your table code remains the same... */}
          {/* Table */}
          {loadingAdmissions ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : showAllocated ? (
            // Allocated Tickets Table
            allocatedTickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hall tickets allocated yet</p>
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
                          Exam Center
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Exam Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Exam Time
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocatedTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-mono text-primary font-semibold">
                            {ticket.application_id}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {ticket.full_name}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {ticket.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {getExamCenterName(ticket.exam_center_id)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(ticket.exam_date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {ticket.exam_time}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={ticket.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )
          ) : (
            // Available Admissions Table
            admissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No admissions available for allocation</p>
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
                          <button
                            onClick={handleSelectAll}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            {selectedAdmissions.length === admissions.length ? (
                              <CheckSquare className="w-5 h-5 text-primary" />
                            ) : (
                              <Square className="w-5 h-5" />
                            )}
                            Select All
                          </button>
                        </th>
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
                          Exam Center
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {admissions.map((admission) => {
                        const program = programs.find(
                          (p) => p.id === admission.program_level_id
                        );
                        const isSelected = selectedAdmissions.includes(admission.id);

                        return (
                          <tr
                            key={admission.id}
                            className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                              isSelected ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleSelectAdmission(admission.id)}
                          >
                            <td className="py-3 px-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectAdmission(admission.id);
                                }}
                                className="hover:scale-110 transition-transform"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 text-primary" />
                                ) : (
                                  <Square className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </td>
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
                              {admission.email}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {admission.mobile || "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {program?.discipline || "N/A"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {getExamCenterName(admission.exam_center_id)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(admission.updated_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Showing {admissions.length} of {totalRecords} records (Page{" "}
                    {currentPage} of {totalPages})
                  </p>
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
            )
          )}
        </div>
      </div>
    </>
  );
}
