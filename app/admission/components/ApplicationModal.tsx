"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";
import { X } from "lucide-react";

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

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  showLogin,
  setShowLogin,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchPrograms();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
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
        onClose();

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

  const renderAcademicYearHeader = () => {
    if (yearLoading) {
      return (
        <div className="text-center mb-4 animate-pulse" aria-live="polite">
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

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL - RIGHT SIDE */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-end px-6 md:px-16 pt-20 pointer-events-none">
        <div
          className="flex justify-end w-full max-w-7xl mx-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {!showLogin ? (
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[calc(100vh-200px)] overflow-y-auto relative">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {renderAcademicYearHeader()}

              <form onSubmit={handleRegister} className="space-y-3">
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  className="w-full rounded border p-2 text-sm text-black"
                  placeholder="Enter Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />

                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  className="w-full rounded border p-2 text-sm text-black"
                  placeholder="Enter Email Address *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  aria-required="true"
                />

                <div className="flex gap-2">
                  <label htmlFor="country-code" className="sr-only">
                    Country Code
                  </label>
                  <select
                    id="country-code"
                    className="rounded border p-2 w-20 text-sm text-black"
                    aria-label="Country code"
                  >
                    <option>+91</option>
                  </select>
                  <label htmlFor="mobile" className="sr-only">
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    className="flex-1 rounded border p-2 text-sm text-black"
                    placeholder="Enter Mobile Number *"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="state" className="sr-only">
                      State
                    </label>
                    <input
                      id="state"
                      className="w-full rounded border p-2 text-sm text-black"
                      placeholder="Enter State *"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="sr-only">
                      City
                    </label>
                    <input
                      id="city"
                      className="w-full rounded border p-2 text-sm text-black"
                      placeholder="Enter City *"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="program" className="sr-only">
                      Program
                    </label>
                    <select
                      id="program"
                      className="rounded border p-2 text-sm text-black w-full"
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      required
                      aria-required="true"
                    >
                      <option value="">Select Program *</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.discipline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="degree" className="sr-only">
                      Degree
                    </label>
                    <select
                      id="degree"
                      className="rounded border p-2 text-sm text-black w-full"
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      disabled={!selectedProgram}
                      required
                      aria-required="true"
                    >
                      <option value="">Select Degree *</option>
                      {degrees.map((degree) => (
                        <option key={degree.id} value={degree.id}>
                          {degree.degree_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="course" className="sr-only">
                    Course
                  </label>
                  <select
                    id="course"
                    className="rounded border p-2 text-sm text-black w-full"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={!selectedDegree}
                    required
                    aria-required="true"
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
                    id="consent"
                    type="checkbox"
                    className="mt-1"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                  <label htmlFor="consent" className="text-xs text-black">
                    I agree to receive information regarding my submitted
                    applications
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !academicYear?.isOpen}
                  className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={
                    isSubmitting ? "Registering..." : "Register for admission"
                  }
                >
                  {isSubmitting
                    ? "Registering..."
                    : !academicYear?.isOpen
                    ? "Registrations Not Open"
                    : "Register"}
                </button>

                {!academicYear?.isOpen && !yearLoading && (
                  <p className="text-xs text-center text-red-600" role="alert">
                    Admissions are currently not open. Please check back later.
                  </p>
                )}

                <p className="text-xs text-center text-black">
                  EXISTING USER?{" "}
                  <button
                    type="button"
                    className="font-semibold cursor-pointer text-black underline"
                    onClick={() => setShowLogin(true)}
                  >
                    LOGIN
                  </button>
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <h2
                id="login-modal-title"
                className="text-xl font-bold text-center text-black"
              >
                Login
              </h2>
              <p className="text-sm text-center text-primary mb-4">
                Access your application
                {academicYear &&
                  ` ${academicYear.start}-${parseInt(academicYear.start) + 1}`}
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    className="w-full rounded border p-2 text-black"
                    placeholder="Enter Email Address *"
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="sr-only">
                    Password (Mobile Number)
                  </label>
                  <input
                    id="login-password"
                    className="w-full rounded border p-2 text-black"
                    placeholder="Enter Mobile Number (Password) *"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    aria-required="true"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-2 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={
                    isSubmitting ? "Logging in..." : "Login to your account"
                  }
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>

                <p className="text-xs text-center text-black">
                  NEW USER?{" "}
                  <button
                    type="button"
                    className="font-semibold cursor-pointer text-black underline"
                    onClick={() => setShowLogin(false)}
                  >
                    REGISTER
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationModal;