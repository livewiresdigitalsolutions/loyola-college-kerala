// "use client";

// import { useState, useEffect } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import { useAcademicYear } from "@/app/hooks/useAcademicYears";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

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

// const Sidebar: React.FC = () => {
//   const router = useRouter();
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [showLogin, setShowLogin] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const { academicYear, loading: yearLoading } = useAcademicYear();
//   const pathname = usePathname();

//   // Form data
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     state: "",
//     city: "",
//     dob: null as Date | null,
//     consent: false,
//   });

//   // Dropdown data
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [degrees, setDegrees] = useState<Degree[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedProgram, setSelectedProgram] = useState<string>("");
//   const [selectedDegree, setSelectedDegree] = useState<string>("");
//   const [selectedCourse, setSelectedCourse] = useState<string>("");

//   // Login data
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   useEffect(() => {
//     if (selectedProgram) {
//       fetchDegrees(selectedProgram);
//       setSelectedDegree("");
//       setSelectedCourse("");
//       setCourses([]);
//     }
//   }, [selectedProgram]);

//   useEffect(() => {
//     if (selectedDegree) {
//       fetchCourses(selectedDegree);
//       setSelectedCourse("");
//     }
//   }, [selectedDegree]);

//   const fetchPrograms = async () => {
//     try {
//       const response = await fetch("/api/programs");
//       const data = await response.json();
//       setPrograms(data);
//     } catch (error) {
//       console.error("Error fetching programs:", error);
//       toast.error("Failed to load programs");
//     }
//   };

//   const fetchDegrees = async (programId: string) => {
//     try {
//       const response = await fetch(`/api/degrees?program_id=${programId}`);
//       const data = await response.json();
//       setDegrees(data);
//     } catch (error) {
//       console.error("Error fetching degrees:", error);
//       toast.error("Failed to load degrees");
//     }
//   };

//   const fetchCourses = async (degreeId: string) => {
//     try {
//       const response = await fetch(`/api/courses?degree_id=${degreeId}`);
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       toast.error("Failed to load courses");
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!formData.name || !formData.email || !formData.mobileNumber) {
//       toast.error("Please fill in all required fields");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedProgram || !selectedDegree || !selectedCourse) {
//       toast.error("Please select Program, Degree, and Course");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!formData.consent) {
//       toast.error("Please agree to receive information");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!/^\d{10}$/.test(formData.mobileNumber)) {
//       toast.error("Please enter a valid 10-digit mobile number");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!academicYear || !academicYear.isOpen) {
//       toast.error("Admissions are currently closed.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!formData.dob) {
//       toast.error("Please select your Date of Birth");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           mobileNumber: formData.mobileNumber,
//           state: formData.state,
//           city: formData.city,
//           programId: selectedProgram,
//           degreeId: selectedDegree,
//           courseId: selectedCourse,
//           consent: formData.consent,
//           // No academicYearId needed - handled by API via config
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success(
//           data.message ||
//             "Registration successful! Please login with your email and mobile number.",
//           { duration: 5000 }
//         );

//         setFormData({
//           name: "",
//           email: "",
//           mobileNumber: "",
//           state: "",
//           city: "",
//           dob: null,
//           consent: false,
//         });
//         setSelectedProgram("");
//         setSelectedDegree("");
//         setSelectedCourse("");

//         setTimeout(() => {
//           setShowForm(false);
//           setShowLogin(true);
//         }, 2000);
//       } else {
//         toast.error(data.error || "Registration failed");
//       }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const hideNavbarRoutes = ["/sys-ops", "/admission-form"];
//   const shouldHideNavbar = hideNavbarRoutes.some((route) =>
//     pathname?.startsWith(route)
//   );

//   // Don't render navbar on sys-ops pages
//   if (shouldHideNavbar) {
//     return null;
//   }

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!loginData.email || !loginData.password) {
//       toast.error("Please enter email and password");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(loginData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Login successful! Redirecting...");

//         if (typeof window !== "undefined") {
//           sessionStorage.setItem("userEmail", loginData.email);
//         }

//         setLoginData({ email: "", password: "" });
//         setShowLogin(false);

//         router.push(
//           `/admission-form?email=${encodeURIComponent(loginData.email)}`
//         );
//       } else {
//         toast.error(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render academic year header with loading and fallback states
//   const renderAcademicYearHeader = () => {
//     if (yearLoading) {
//       return (
//         <div className="text-center mb-4 animate-pulse">
//           <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
//         </div>
//       );
//     }

//     if (!academicYear || !academicYear.isOpen) {
//       return (
//         <>
//           <h2 className="text-xl font-bold text-center text-gray-600">
//             Admissions Opening Soon
//           </h2>
//           <p className="text-sm text-center text-gray-500 mb-4">
//             Academic year will be announced shortly
//           </p>
//         </>
//       );
//     }

//     return (
//       <>
//         <h2 className="text-xl font-bold text-center text-black">
//           Admissions Open {academicYear.start}
//         </h2>
//         <p className="text-sm text-center text-primary mb-4">
//           UG, PG and PhD Applications {academicYear.start}-
//           {parseInt(academicYear.start) + 1}
//         </p>
//       </>
//     );
//   };

//   return (
//     <section className="text-black">
//       <Toaster position="top-right" />
//       {/* Modal Overlay - Full Screen with Backdrop */}
//       {(showForm || showLogin) && (
//         <div className="fixed inset-0 bg-black/40 z-[9998] flex items-center justify-end px-6 md:px-16 -right-14 pt-20">
//           <div className="flex justify-end w-full max-w-7xl mx-auto">
//             {showForm && !showLogin && (
//               <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[calc(100vh-200px)] overflow-y-auto">
//                 {renderAcademicYearHeader()}

//                 <form onSubmit={handleRegister} className="space-y-3">
//                   <input
//                     className="w-full rounded border p-2 text-sm text-black"
//                     placeholder="Enter Name *"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                   />

//                   <input
//                     className="w-full rounded border p-2 text-sm text-black"
//                     placeholder="Enter Email Address *"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     required
//                   />

//                   <div className="flex gap-2">
//                     <select className="rounded border p-2 w-20 text-sm text-black">
//                       <option>+91</option>
//                     </select>
//                     <input
//                       className="flex-1 rounded border p-2 text-sm text-black"
//                       placeholder="Enter Mobile Number *"
//                       name="mobileNumber"
//                       type="tel"
//                       value={formData.mobileNumber}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <DatePicker
//                       selected={formData.dob}
//                       onChange={(date: Date | null) =>
//                         setFormData((prev) => ({ ...prev, dob: date }))
//                       }
//                       dateFormat="dd/MM/yyyy"
//                       placeholderText="Date of Birth *"
//                       maxDate={new Date()}
//                       showMonthDropdown
//                       showYearDropdown
//                       dropdownMode="select"
//                       className="w-full rounded border p-2 text-sm text-black"
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       className="w-full rounded border p-2 text-sm text-black"
//                       placeholder="Enter State *"
//                       name="state"
//                       value={formData.state}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <input
//                       className="w-full rounded border p-2 text-sm text-black"
//                       placeholder="Enter City *"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <select
//                       className="rounded border p-2 text-sm text-black"
//                       value={selectedProgram}
//                       onChange={(e) => setSelectedProgram(e.target.value)}
//                       required
//                     >
//                       <option value="">Select Program *</option>
//                       {programs.map((program) => (
//                         <option key={program.id} value={program.id}>
//                           {program.discipline}
//                         </option>
//                       ))}
//                     </select>

//                     <select
//                       className="rounded border p-2 text-sm text-black"
//                       value={selectedDegree}
//                       onChange={(e) => setSelectedDegree(e.target.value)}
//                       disabled={!selectedProgram}
//                       required
//                     >
//                       <option value="">Select Degree *</option>
//                       {degrees.map((degree) => (
//                         <option key={degree.id} value={degree.id}>
//                           {degree.degree_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="grid grid-cols-1 gap-2">
//                     <select
//                       className="rounded border p-2 text-sm text-black"
//                       value={selectedCourse}
//                       onChange={(e) => setSelectedCourse(e.target.value)}
//                       disabled={!selectedDegree}
//                       required
//                     >
//                       <option value="">Select Course *</option>
//                       {courses.map((course) => (
//                         <option key={course.id} value={course.id}>
//                           {course.course_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="flex items-start gap-2">
//                     <input
//                       type="checkbox"
//                       className="mt-1"
//                       name="consent"
//                       checked={formData.consent}
//                       onChange={handleInputChange}
//                       required
//                     />
//                     <p className="text-xs text-black">
//                       I agree to receive information regarding my submitted
//                       applications
//                     </p>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isSubmitting || !academicYear?.isOpen}
//                     className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting
//                       ? "Registering..."
//                       : !academicYear?.isOpen
//                       ? "Registrations Not Open"
//                       : "Register"}
//                   </button>

//                   {!academicYear?.isOpen && !yearLoading && (
//                     <p className="text-xs text-center text-red-600">
//                       Admissions are currently not open. Please check back
//                       later.
//                     </p>
//                   )}

//                   <p className="text-xs text-center text-black">
//                     EXISTING USER?{" "}
//                     <span
//                       className="font-semibold cursor-pointer text-black underline"
//                       onClick={() => {
//                         setShowForm(false);
//                         setShowLogin(true);
//                       }}
//                     >
//                       LOGIN
//                     </span>
//                   </p>
//                 </form>
//               </div>
//             )}

//             {showLogin && (
//               <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
//                 <h2 className="text-xl font-bold text-center text-black">
//                   Login
//                 </h2>
//                 <p className="text-sm text-center text-primary mb-4">
//                   Access your application
//                   {academicYear &&
//                     ` ${academicYear.start}-${
//                       parseInt(academicYear.start) + 1
//                     }`}
//                 </p>

//                 <form onSubmit={handleLogin} className="space-y-4">
//                   <input
//                     className="w-full rounded border p-2 text-black"
//                     placeholder="Enter Email Address *"
//                     type="email"
//                     value={loginData.email}
//                     onChange={(e) =>
//                       setLoginData({ ...loginData, email: e.target.value })
//                     }
//                     required
//                   />

//                   <input
//                     className="w-full rounded border p-2 text-black"
//                     placeholder="Enter Mobile Number (Password) *"
//                     type="password"
//                     value={loginData.password}
//                     onChange={(e) =>
//                       setLoginData({ ...loginData, password: e.target.value })
//                     }
//                     required
//                   />

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSubmitting ? "Logging in..." : "Login"}
//                   </button>

//                   <p className="text-xs text-center text-black">
//                     NEW USER?{" "}
//                     <span
//                       className="font-semibold cursor-pointer text-black underline"
//                       onClick={() => {
//                         setShowLogin(false);
//                         setShowForm(true);
//                       }}
//                     >
//                       REGISTER
//                     </span>
//                   </p>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Fixed Side Button */}
//       <div className="fixed right-0 top-1/3 -translate-y-1/2 z-[9999]">
//         <button
//           onClick={() => {
//             setShowForm((prev) => !prev);
//             setShowLogin(false);
//           }}
//           disabled={!academicYear?.isOpen}
//           className="rotate-[-90deg] origin-bottom-right bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-lg rounded-t-md hover:bg-primary hover:text-white transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {yearLoading
//             ? "Loading..."
//             : academicYear?.isOpen
//             ? `Admissions Enquiry ${academicYear.start} →`
//             : "Admissions Coming Soon →"}
//         </button>
//       </div>
//     </section>
//   );
// };

// export default Sidebar;








"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { academicYear, loading: yearLoading } = useAcademicYear();
  const pathname = usePathname();

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    state: "",
    city: "",
    dob: null as Date | null,
    consent: false,
  });

  // Dropdown data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedDegree, setSelectedDegree] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Login data
  const [loginData, setLoginData] = useState({
    email: "",
    dob: null as Date | null,
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      fetchDegrees(selectedProgram);
      setSelectedDegree("");
      setSelectedCourse("");
      setCourses([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedDegree) {
      fetchCourses(selectedDegree);
      setSelectedCourse("");
    }
  }, [selectedDegree]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      toast.error("Failed to load programs");
    }
  };

  const fetchDegrees = async (programId: string) => {
    try {
      const response = await fetch(`/api/degrees?program_id=${programId}`);
      const data = await response.json();
      setDegrees(data);
    } catch (error) {
      toast.error("Failed to load degrees");
    }
  };

  const fetchCourses = async (degreeId: string) => {
    try {
      const response = await fetch(`/api/courses?degree_id=${degreeId}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDOBForPassword = (dob: Date): string => {
    const year = dob.getFullYear();
    const month = String(dob.getMonth() + 1).padStart(2, "0");
    const day = String(dob.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.mobileNumber) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!selectedProgram || !selectedDegree || !selectedCourse) {
      toast.error("Please select Program, Degree, and Course");
      setIsSubmitting(false);
      return;
    }

    if (!formData.consent) {
      toast.error("Please agree to receive information");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setIsSubmitting(false);
      return;
    }

    if (!academicYear || !academicYear.isOpen) {
      toast.error("Admissions are currently closed.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.dob) {
      toast.error("Please select your Date of Birth");
      setIsSubmitting(false);
      return;
    }

    try {
      const dobPassword = formatDOBForPassword(formData.dob);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          state: formData.state,
          city: formData.city,
          programId: selectedProgram,
          degreeId: selectedDegree,
          courseId: selectedCourse,
          consent: formData.consent,
          dobPassword: dobPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
            "Registration successful! Please login with your email and date of birth.",
          { duration: 5000 }
        );

        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          state: "",
          city: "",
          dob: null,
          consent: false,
        });
        setSelectedProgram("");
        setSelectedDegree("");
        setSelectedCourse("");

        setTimeout(() => {
          setShowForm(false);
          setShowLogin(true);
        }, 2000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hideNavbarRoutes = [
    "/sys-ops",
    "/admission-form",
    "/application-preview",
    "/hall-ticket-preview",
  ];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  // Don't render navbar on sys-ops pages
  if (shouldHideNavbar) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!loginData.email || !loginData.dob) {
      toast.error("Please enter email and date of birth");
      setIsSubmitting(false);
      return;
    }

    try {
      const dobPassword = formatDOBForPassword(loginData.dob);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: allows cookies to be sent/received
        body: JSON.stringify({
          email: loginData.email,
          password: dobPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful! Redirecting...");

        // No need to store anything in sessionStorage
        // The auth token is securely stored in HTTP-only cookie

        setLoginData({ email: "", dob: null });
        setShowLogin(false);

        // Redirect to admission form
        router.push(
          `/admission-form?email=${encodeURIComponent(loginData.email)}`
        );
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render academic year header with loading and fallback states
  const renderAcademicYearHeader = () => {
    if (yearLoading) {
      return (
        <div className="text-center mb-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>
      );
    }

    if (!academicYear || !academicYear.isOpen) {
      return (
        <>
          <h2 className="text-xl font-bold text-center text-gray-600">
            Admissions Opening Soon
          </h2>
          <p className="text-sm text-center text-gray-500 mb-4">
            Academic year will be announced shortly
          </p>
        </>
      );
    }

    return (
      <>
        <h2 className="text-xl font-bold text-center text-black">
          Admissions Open {academicYear.start}
        </h2>
        <p className="text-sm text-center text-primary mb-4">
          UG, PG and PhD Applications {academicYear.start}-
          {parseInt(academicYear.start) + 1}
        </p>
      </>
    );
  };

  return (
    <section className="text-black">
      <Toaster position="top-right" />
      {/* Modal Overlay - Full Screen with Backdrop */}
      {(showForm || showLogin) && (
        <div className="fixed inset-0 bg-black/40 z-[9998] flex items-center justify-end px-6 md:px-16 -right-14 pt-20">
          <div className="flex justify-end w-full max-w-7xl mx-auto">
            {showForm && !showLogin && (
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[calc(100vh-200px)] overflow-y-auto">
                {renderAcademicYearHeader()}

                <form onSubmit={handleRegister} className="space-y-3">
                  <input
                    className="w-full rounded border p-2 text-sm text-black"
                    placeholder="Enter Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    className="w-full rounded border p-2 text-sm text-black"
                    placeholder="Enter Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="flex gap-2">
                    <select className="rounded border p-2 w-20 text-sm text-black">
                      <option>+91</option>
                    </select>
                    <input
                      className="flex-1 rounded border p-2 text-sm text-black"
                      placeholder="Enter Mobile Number *"
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                    <DatePicker
                      selected={formData.dob}
                      onChange={(date: Date | null) =>
                        setFormData((prev) => ({ ...prev, dob: date }))
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Date of Birth *"
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="w-full rounded border p-2 text-sm text-black"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="w-full rounded border p-2 text-sm text-black"
                      placeholder="Enter State *"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="w-full rounded border p-2 text-sm text-black"
                      placeholder="Enter City *"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="rounded border p-2 text-sm text-black"
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      required
                    >
                      <option value="">Select Program *</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.discipline}
                        </option>
                      ))}
                    </select>

                    <select
                      className="rounded border p-2 text-sm text-black"
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      disabled={!selectedProgram}
                      required
                    >
                      <option value="">Select Degree *</option>
                      {degrees.map((degree) => (
                        <option key={degree.id} value={degree.id}>
                          {degree.degree_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <select
                      className="rounded border p-2 text-sm text-black"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      disabled={!selectedDegree}
                      required
                    >
                      <option value="">Select Course *</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-black">
                      I agree to receive information regarding my submitted
                      applications
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !academicYear?.isOpen}
                    className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Registering..."
                      : !academicYear?.isOpen
                      ? "Registrations Not Open"
                      : "Register"}
                  </button>

                  {!academicYear?.isOpen && !yearLoading && (
                    <p className="text-xs text-center text-red-600">
                      Admissions are currently not open. Please check back
                      later.
                    </p>
                  )}

                  <p className="text-xs text-center text-black">
                    EXISTING USER?{" "}
                    <span
                      className="font-semibold cursor-pointer text-black underline"
                      onClick={() => {
                        setShowForm(false);
                        setShowLogin(true);
                      }}
                    >
                      LOGIN
                    </span>
                  </p>
                </form>
              </div>
            )}

            {showLogin && (
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-center text-black">
                  Login
                </h2>
                <p className="text-sm text-center text-primary mb-4">
                  Access your application
                  {academicYear &&
                    ` ${academicYear.start}-${
                      parseInt(academicYear.start) + 1
                    }`}
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input with User Icon */}
                  <div className="relative flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute ml-3 text-gray-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      className="w-full rounded border p-2 pl-10 pr-3 text-black focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter Email Address *"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* DatePicker with Calendar Icon */}
                  <div className="relative flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute ml-3 text-gray-400 pointer-events-none z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <DatePicker
                      selected={loginData.dob}
                      onChange={(date: Date | null) =>
                        setLoginData({ ...loginData, dob: date })
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Enter Date of Birth (Password) *"
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="w-full rounded border p-2 pl-10 pr-3 text-black focus:outline-none focus:ring-2 focus:ring-primary"
                      wrapperClassName="w-full"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <p className="text-xs text-center text-black">
                    NEW USER?{" "}
                    <span
                      className="font-semibold cursor-pointer text-black underline"
                      onClick={() => {
                        setShowLogin(false);
                        setShowForm(true);
                      }}
                    >
                      REGISTER
                    </span>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fixed Side Button */}
      <div className="fixed right-0 top-1/3 -translate-y-1/2 z-[9999]">
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setShowLogin(false);
          }}
          disabled={!academicYear?.isOpen}
          className="rotate-[-90deg] origin-bottom-right bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-lg rounded-t-md hover:bg-primary hover:text-white transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {yearLoading
            ? "Loading..."
            : academicYear?.isOpen
            ? `Admissions Enquiry ${academicYear.start} →`
            : `Admissions Closed for ${academicYear?.start}`}
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
