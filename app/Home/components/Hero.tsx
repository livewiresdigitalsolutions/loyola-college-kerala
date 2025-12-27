// // "use client";

// // import { useState, useEffect } from "react";
// // import Image from "next/image";

// // const Hero: React.FC = () => {
// //   const [showForm, setShowForm] = useState<boolean>(false);

// //   return (
// //     <section className="relative min-h-screen w-full overflow-hidden">
// //       <Image
// //         src="/assets/loyola.png"
// //         alt="Campus view"
// //         fill
// //         priority
// //         className="object-cover"
// //       />

// //       <div className="absolute inset-0 bg-black/40" />

// //       {/* MAIN CONTENT */}
// //       <div className="relative z-10 flex min-h-screen items-center px-6 md:px-16">
// //         <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-12">
// //           {/* LEFT HERO */}
// //           <div className="text-white max-w-2xl flex flex-col justify-center h-full">
// //             <h1 className="text-4xl md:text-6xl font-bold leading-tight pt-26">
// //               Empowering Minds. <br />
// //               Enriching Society.
// //             </h1>

// //             <p className="mt-4 text-sm md:text-base text-gray-200">
// //               Loyola College Kerala (Autonomous) – A NAAC A++ Institution
// //               shaping leaders through values, excellence, and innovation.
// //             </p>

// //             <div className="mt-6 flex gap-4">
// //               <button className="rounded-md bg-[#342D87] px-6 py-3 text-sm font-black">
// //                 Explore Academics
// //               </button>

// //               <button
// //                 onClick={() => setShowForm(true)}
// //                 className="rounded-md bg-white px-6 py-3 text-sm font-black text-[#342D87]"
// //               >
// //                 Admissions 2026 →
// //               </button>
// //             </div>
// //           </div>

// //           {/* RIGHT FORM */}
// //           <div className="flex justify-end">
// //             {showForm && (
// //               <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mt-24">
// //                 <h2 className="text-xl font-bold text-center">
// //                   Admissions Open 2026
// //                 </h2>
// //                 <p className="text-sm text-center text-[#342D87] mb-4">
// //                   UG, PG and PhD Applications 2026
// //                 </p>

// //                 <form className="space-y-3">
// //                   <input
// //                     className="w-full rounded border p-2"
// //                     placeholder="Enter Name *"
// //                   />

// //                   <input
// //                     className="w-full rounded border p-2"
// //                     placeholder="Enter Email Address *"
// //                   />

// //                   <div className="flex gap-2">
// //                     <select className="rounded border p-2 w-20">
// //                       <option>+91</option>
// //                     </select>
// //                     <input
// //                       className="flex-1 rounded border p-2"
// //                       placeholder="Enter Mobile Number *"
// //                     />
// //                   </div>

// //                   <div className="grid grid-cols-2 gap-2">
// //                     <input
// //                       className="w-full rounded border p-2"
// //                       placeholder="Enter State *"
// //                     />
// //                     <input
// //                       className="w-full rounded border p-2"
// //                       placeholder="Enter City *"
// //                     />
// //                   </div>

// //                   <div className="grid grid-cols-2 gap-2">
// //                     <select className="rounded border p-2">
// //                       <option value="">Select Program *</option>
// //                     </select>
// //                     <select className="rounded border p-2">
// //                       <option>Select Degree *</option>
// //                     </select>
// //                   </div>

// //                   <div className="grid grid-cols-1 gap-2">
// //                     <select className="rounded border p-2">
// //                       <option>Select Course *</option>
// //                     </select>
// //                   </div>

// //                   <div className="flex items-start gap-2">
// //                     <input type="checkbox" className="mt-1" />
// //                     <p className="text-xs">
// //                       I agree to receive information regarding my submitted
// //                       applications
// //                     </p>
// //                   </div>

// //                   <button className="w-full bg-[#342D87] text-white py-2 rounded font-bold">
// //                     Register
// //                   </button>

// //                   <p className="text-xs text-center">
// //                     EXISTING USER? <span className="font-semibold">LOGIN</span>
// //                   </p>
// //                 </form>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* SIDE BUTTON */}
// //       <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
// //         <button
// //           onClick={() => setShowForm((prev: boolean) => !prev)}
// //           className="rotate-[-90deg] origin-bottom-right bg-white px-4 py-2
// //                      text-sm font-semibold text-[#342D87] shadow-lg rounded-t-md"
// //         >
// //           Admissions Enquiry →
// //         </button>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Hero;





// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";

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

// const Hero: React.FC = () => {
//   const [showForm, setShowForm] = useState<boolean>(false);
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [degrees, setDegrees] = useState<Degree[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [selectedProgram, setSelectedProgram] = useState<string>("");
//   const [selectedDegree, setSelectedDegree] = useState<string>("");

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   useEffect(() => {
//     if (selectedProgram) {
//       fetchDegrees(selectedProgram);
//       setSelectedDegree("");
//       setCourses([]);
//     }
//   }, [selectedProgram]);

//   useEffect(() => {
//     if (selectedDegree) {
//       fetchCourses(selectedDegree);
//     }
//   }, [selectedDegree]);

//   const fetchPrograms = async () => {
//     try {
//       const response = await fetch('/api/programs');
//       const data = await response.json();
//       setPrograms(data);
//     } catch (error) {
//       console.error('Error fetching programs:', error);
//     }
//   };

//   const fetchDegrees = async (programId: string) => {
//     try {
//       const response = await fetch(`/api/degrees?program_id=${programId}`);
//       const data = await response.json();
//       setDegrees(data);
//     } catch (error) {
//       console.error('Error fetching degrees:', error);
//     }
//   };

//   const fetchCourses = async (degreeId: string) => {
//     try {
//       const response = await fetch(`/api/courses?degree_id=${degreeId}`);
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   return (
//     <section className="relative min-h-screen w-full overflow-hidden">
//       <Image
//         src="/assets/loyola.png"
//         alt="Campus view"
//         fill
//         priority
//         className="object-cover"
//       />

//       <div className="absolute inset-0 bg-black/40" />

//       <div className="relative z-10 flex min-h-screen items-center px-6 md:px-16">
//         <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-12">
//           <div className="text-white max-w-2xl flex flex-col justify-center h-full">
//             <h1 className="text-4xl md:text-6xl font-bold leading-tight pt-26">
//               Empowering Minds. <br />
//               Enriching Society.
//             </h1>

//             <p className="mt-4 text-sm md:text-base text-gray-200">
//               Loyola College Kerala (Autonomous) – A NAAC A++ Institution
//               shaping leaders through values, excellence, and innovation.
//             </p>

//             <div className="mt-6 flex gap-4">
//               <button className="rounded-md bg-[#342D87] px-6 py-3 text-sm font-black">
//                 Explore Academics
//               </button>

//               <button
//                 onClick={() => setShowForm(true)}
//                 className="rounded-md bg-white px-6 py-3 text-sm font-black text-[#342D87]"
//               >
//                 Admissions 2026 →
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             {showForm && (
//               <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mt-24">
//                 <h2 className="text-xl font-bold text-center">
//                   Admissions Open 2026
//                 </h2>
//                 <p className="text-sm text-center text-[#342D87] mb-4">
//                   UG, PG and PhD Applications 2026
//                 </p>

//                 <form className="space-y-3">
//                   <input
//                     className="w-full rounded border p-2"
//                     placeholder="Enter Name *"
//                   />

//                   <input
//                     className="w-full rounded border p-2"
//                     placeholder="Enter Email Address *"
//                   />

//                   <div className="flex gap-2">
//                     <select className="rounded border p-2 w-20">
//                       <option>+91</option>
//                     </select>
//                     <input
//                       className="flex-1 rounded border p-2"
//                       placeholder="Enter Mobile Number *"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       className="w-full rounded border p-2"
//                       placeholder="Enter State *"
//                     />
//                     <input
//                       className="w-full rounded border p-2"
//                       placeholder="Enter City *"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <select 
//                       className="rounded border p-2"
//                       value={selectedProgram}
//                       onChange={(e) => setSelectedProgram(e.target.value)}
//                     >
//                       <option value="">Select Program *</option>
//                       {programs.map((program) => (
//                         <option key={program.id} value={program.id}>
//                           {program.discipline}
//                         </option>
//                       ))}
//                     </select>

//                     <select 
//                       className="rounded border p-2"
//                       value={selectedDegree}
//                       onChange={(e) => setSelectedDegree(e.target.value)}
//                       disabled={!selectedProgram}
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
//                       className="rounded border p-2"
//                       disabled={!selectedDegree}
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
//                     <input type="checkbox" className="mt-1" />
//                     <p className="text-xs">
//                       I agree to receive information regarding my submitted
//                       applications
//                     </p>
//                   </div>

//                   <button className="w-full bg-[#342D87] text-white py-2 rounded font-bold">
//                     Register
//                   </button>

//                   <p className="text-xs text-center">
//                     EXISTING USER? <span className="font-semibold">LOGIN</span>
//                   </p>
//                 </form>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
//         <button
//           onClick={() => setShowForm((prev: boolean) => !prev)}
//           className="rotate-[-90deg] origin-bottom-right bg-white px-4 py-2
//                      text-sm font-semibold text-[#342D87] shadow-lg rounded-t-md"
//         >
//           Admissions Enquiry →
//         </button>
//       </div>
//     </section>
//   );
// };

// export default Hero;







"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Changed from "next/router"

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

const Hero: React.FC = () => {
  const router = useRouter(); // Now correctly imported
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    state: "",
    city: "",
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
    password: "",
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
      console.error("Error fetching programs:", error);
      toast.error("Failed to load programs");
    }
  };

  const fetchDegrees = async (programId: string) => {
    try {
      const response = await fetch(`/api/degrees?program_id=${programId}`);
      const data = await response.json();
      setDegrees(data);
    } catch (error) {
      console.error("Error fetching degrees:", error);
      toast.error("Failed to load degrees");
    }
  };

  const fetchCourses = async (degreeId: string) => {
    try {
      const response = await fetch(`/api/courses?degree_id=${degreeId}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
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

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      setIsSubmitting(false);
      return;
    }

    try {
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Registration successful! Please login with your email and mobile number.",
          { duration: 5000 }
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          state: "",
          city: "",
          consent: false,
        });
        setSelectedProgram("");
        setSelectedDegree("");
        setSelectedCourse("");

        // Show login form after 2 seconds
        setTimeout(() => {
          setShowForm(false);
          setShowLogin(true);
        }, 2000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!loginData.email || !loginData.password) {
      toast.error("Please enter email and password");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful! Redirecting...");
        
        // Store user email in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('userEmail', loginData.email);
        }
        
        setLoginData({ email: "", password: "" });
        setShowLogin(false);

        // Redirect to admission form with email
        router.push(
          `/admission-form?email=${encodeURIComponent(loginData.email)}`
        );
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <Toaster position="top-right" />

      <Image
        src="/assets/loyola.png"
        alt="Campus view"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex min-h-screen items-center px-6 md:px-16">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="text-white max-w-2xl flex flex-col justify-center h-full">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight pt-26">
              Empowering Minds. <br />
              Enriching Society.
            </h1>

            <p className="mt-4 text-sm md:text-base text-gray-200">
              Loyola College Kerala (Autonomous) – A NAAC A++ Institution
              shaping leaders through values, excellence, and innovation.
            </p>

            <div className="mt-6 flex gap-4">
              <button className="rounded-md bg-[#342D87] px-6 py-3 text-sm font-black">
                Explore Academics
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setShowLogin(false);
                }}
                className="rounded-md bg-white px-6 py-3 text-sm font-black text-[#342D87]"
              >
                Admissions 2026 →
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            {/* Registration Form */}
            {showForm && !showLogin && (
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mt-24 max-h-[calc(100vh-200px)] overflow-y-auto">
                <h2 className="text-xl font-bold text-center">
                  Admissions Open 2026
                </h2>
                <p className="text-sm text-center text-[#342D87] mb-4">
                  UG, PG and PhD Applications 2026
                </p>

                <form onSubmit={handleRegister} className="space-y-3">
                  <input
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Enter Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    className="w-full rounded border p-2 text-sm"
                    placeholder="Enter Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="flex gap-2">
                    <select className="rounded border p-2 w-20 text-sm">
                      <option>+91</option>
                    </select>
                    <input
                      className="flex-1 rounded border p-2 text-sm"
                      placeholder="Enter Mobile Number *"
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      className="w-full rounded border p-2 text-sm"
                      placeholder="Enter State *"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="w-full rounded border p-2 text-sm"
                      placeholder="Enter City *"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="rounded border p-2 text-sm"
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
                      className="rounded border p-2 text-sm"
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
                      className="rounded border p-2 text-sm"
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
                    <p className="text-xs">
                      I agree to receive information regarding my submitted
                      applications
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#342D87] text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>

                  <p className="text-xs text-center">
                    EXISTING USER?{" "}
                    <span
                      className="font-semibold cursor-pointer text-[#342D87]"
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

            {/* Login Form */}
            {showLogin && (
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mt-24">
                <h2 className="text-xl font-bold text-center">Login</h2>
                <p className="text-sm text-center text-[#342D87] mb-4">
                  Access your application
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    className="w-full rounded border p-2"
                    placeholder="Enter Email Address *"
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />

                  <input
                    className="w-full rounded border p-2"
                    placeholder="Enter Mobile Number (Password) *"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#342D87] text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <p className="text-xs text-center">
                    NEW USER?{" "}
                    <span
                      className="font-semibold cursor-pointer text-[#342D87]"
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
      </div>

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setShowLogin(false);
          }}
          className="rotate-[-90deg] origin-bottom-right bg-white px-4 py-2
                     text-sm font-semibold text-[#342D87] shadow-lg rounded-t-md"
        >
          Admissions Enquiry →
        </button>
      </div>
    </section>
  );
};

export default Hero;
