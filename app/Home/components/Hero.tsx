// app/components/hero.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

interface HeroMedia {
  id: number;
  type: "image" | "video";
  url: string;
  title: string;
  display_order: number;
  is_active: boolean;
}

const Hero: React.FC = () => {
  const router = useRouter();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [heroMedia, setHeroMedia] = useState<HeroMedia[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    fetchHeroMedia();
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

  // Fetch hero media from API
  const fetchHeroMedia = async () => {
    try {
      const response = await fetch("/api/hero-media");
      const data = await response.json();
      if (data.success && data.data) {
        setHeroMedia(data.data);
      }
    } catch (error) {
      console.error("Error fetching hero media:", error);
    }
  };

  // Handle media carousel - videos play completely, then move to next
  useEffect(() => {
    if (heroMedia.length === 0) return;

    const currentMedia = heroMedia[currentMediaIndex];

    if (currentMedia?.type === "video") {
      // Video will auto-advance when it ends
      return;
    } else {
      // Images auto-advance after 5 seconds
      const timer = setTimeout(() => {
        setCurrentMediaIndex((prev) =>
          prev === heroMedia.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentMediaIndex, heroMedia]);

  const handleVideoEnd = () => {
    setCurrentMediaIndex((prev) =>
      prev === heroMedia.length - 1 ? 0 : prev + 1
    );
  };

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

        if (typeof window !== "undefined") {
          sessionStorage.setItem("userEmail", loginData.email);
        }

        setLoginData({ email: "", password: "" });
        setShowLogin(false);

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

  const currentMedia = heroMedia[currentMediaIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Toaster position="top-right" />
      // In hero.tsx, replace the Image component with conditional rendering
      {heroMedia.length > 0 && currentMedia ? (
        currentMedia.type === "video" ? (
          <video
            ref={videoRef}
            key={currentMedia.id}
            src={currentMedia.url}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : // Check if URL is external or local
        currentMedia.url.startsWith("http") ? (
          <img
            key={currentMedia.id}
            src={currentMedia.url}
            alt={currentMedia.title || "Campus view"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            key={currentMedia.id}
            src={currentMedia.url}
            alt={currentMedia.title || "Campus view"}
            fill
            priority
            className="object-cover"
          />
        )
      ) : (
        <Image
          src="/assets/loyola.png"
          alt="Campus view"
          fill
          priority
          className="object-cover"
        />
      )}
      {/* Media Indicators */}
      {heroMedia.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentMediaIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
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
              <button className="rounded-md bg-[#342D87] px-6 py-3 text-sm font-black hover:bg-yellow-600 hover:text-white transition-transform duration-200 hover:scale-105">
                Explore Academics
              </button>

              <button
                className="rounded-md bg-white px-6 py-3 text-sm font-black text-[#342D87] hover:bg-yellow-600 hover:text-white transition-transform duration-200 hover:scale-105"
              >
                Admissions 2026 →
              </button>
            </div>
          </div>

          <div className="flex justify-end">
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
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
        {/* <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setShowLogin(false);
          }}
          className="rotate-[-90deg] origin-bottom-right bg-yellow-600 px-4 py-2
                     text-sm font-semibold text-white shadow-lg rounded-t-md hover:bg-[#342D87] hover:text-white transition-transform duration-200 hover:scale-105"
        >
          Admissions Enquiry →
        </button> */}
      </div>
    </section>
  );
};

export default Hero;
