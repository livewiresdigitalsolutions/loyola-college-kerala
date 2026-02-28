// app/components/hero.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";

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
  const { academicYear, loading: yearLoading } = useAcademicYear();

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
          // No academicYearId needed - handled by API via config
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || "Registration successful! Please login with your email and mobile number.",
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
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render academic year header
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
          UG, PG and PhD Applications {academicYear.start}
        </p>
      </>
    );
  };

  const currentMedia = heroMedia[currentMediaIndex];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Toaster position="top-right" />
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
              type="button"
              aria-label={`Go to media ${index + 1}`}
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
  
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-16">
        <div className="w-full max-w-7xl">
          <div className="text-white max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tighter">
              Empowering Minds. <br />
              Enriching Society.
            </h1>

            <p className="mt-4 text-sm md:text-base text-gray-200">
              Loyola College Kerala (Autonomous) – A NAAC A++ Institution
              shaping leaders through values, excellence, and innovation.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <button className="rounded-md bg-primary px-6 py-3 text-sm font-black hover:bg-yellow-500 hover:text-white transition-transform duration-200 hover:scale-105">
                Explore Academics
              </button>

              <button
                onClick={() => {
                  setShowForm(true);
                  setShowLogin(false);
                }}
                disabled={yearLoading || !academicYear?.isOpen}
                className="rounded-md bg-white px-6 py-3 text-sm font-black text-primary hover:bg-yellow-500 hover:text-white transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {yearLoading
                  ? "Loading..."
                  : academicYear && academicYear.isOpen
                  ? `Admissions ${academicYear.start} →`
                  : `Admissions Closed for ${academicYear?.start}`}
              </button>
            </div>
          </div>
        </div>
      </div>






    </section>
  );
};

export default Hero;
