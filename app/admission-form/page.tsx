"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Script from "next/script";
import { useAcademicYear } from "../hooks/useAcademicYears";
import { useAdmissionForm } from "../hooks/useAdmissionForm";
import {
  Program,
  Degree,
  Course,
  ExamCenter,
  SubjectMark,
  AcademicMark,
  CompleteFormData,
} from "@/types/admission";
import {
  validateName,
  validateMobile,
  validateEmail,
  validateAadhaar,
  validatePincode,
  validateYear,
  validatePercentage,
} from "../lib/validators";

// Import tab components
import ProgramPersonalTab from "./components/ProgramPersonalTab";
import ContactFamilyTab from "./components/ContactFamilyTab";
import AcademicRecordsTab from "./components/AcademicRecordsTab";
import PaymentTab from "./components/PaymentTab";
import EasebuzzCheckout from "@/components/EasebuzzCheckout";

interface Tab {
  name: string;
  id: string;
  fields: string[];
}

function AdmissionFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const { academicYear, loading: yearLoading } = useAcademicYear();
  const {
    saveCompleteForm,
    loadCompleteForm,
    isLoading: formSaving,
  } = useAdmissionForm(userEmail);

  // Dropdown data
  const [programs, setPrograms] = useState<Program[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);

  // UI states
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [admissionId, setAdmissionId] = useState<number | undefined>();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [showEasebuzzCheckout, setShowEasebuzzCheckout] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hasRestoredTab, setHasRestoredTab] = useState(false);
  const [hallTicketStatus, setHallTicketStatus] = useState<string>("");
  const [hasHallTicket, setHasHallTicket] = useState<boolean>(false);
  const [isAllocated, setIsAllocated] = useState<boolean>(false);
  const [secondPreferenceCourses, setSecondPreferenceCourses] = useState<
    Course[]
  >([]);
  const [thirdPreferenceCourses, setThirdPreferenceCourses] = useState<
    Course[]
  >([]);

  // 12th standard subjects
  const [twelfthSubjects, setTwelfthSubjects] = useState<SubjectMark[]>([
    { subject_name: "", marks_obtained: undefined, max_marks: undefined },
  ]);

  // Form data - flattened structure for easier form handling
  const [form, setForm] = useState<any>({
    // Basic Info
    program_level_id: "",
    degree_id: "",
    course_id: "",
    second_preference_degree_id: "",
    second_preference_course_id: "",
    third_preference_degree_id: "",
    third_preference_course_id: "",
    exam_center_id: "",

    // Personal Info
    full_name: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    aadhaar: "",
    nationality: "",
    religion: "",
    category: "",
    seat_reservation_quota: "",
    caste: "",
    mother_tongue: "",
    nativity: "",
    blood_group: "",

    // Family Info
    father_name: "",
    father_mobile: "",
    father_education: "",
    father_occupation: "",
    mother_name: "",
    mother_mobile: "",
    mother_education: "",
    mother_occupation: "",
    annual_family_income: "0.00",
    is_disabled: "no",
    disability_type: "",
    disability_percentage: "",
    dependent_of: "none",
    seeking_admission_under_quota: "no",
    scholarship_or_fee_concession: "no",
    hostel_accommodation_required: "no",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_mobile: "",

    // Address Info
    communication_address: "",
    communication_city: "",
    communication_state: "",
    communication_district: "",
    communication_pincode: "",
    communication_country: "",
    permanent_address: "",
    permanent_city: "",
    permanent_state: "",
    permanent_district: "",
    permanent_pincode: "",
    permanent_country: "",

    // Academic Info (temporary flat structure)
    tenth_register_number: "",
    tenth_board: "",
    tenth_school: "",
    tenth_year: "",
    tenth_percentage: "",
    twelfth_register_number: "",
    twelfth_board: "",
    twelfth_school: "",
    twelfth_year: "",
    twelfth_percentage: "",
    twelfth_stream: "",
    ug_university: "",
    ug_college: "",
    ug_degree: "",
    ug_year: "",
    ug_percentage: "",
    pg_university: "",
    pg_college: "",
    pg_degree: "",
    pg_year: "",
    pg_percentage: "",

    // Additional
    previous_gap: "",
    extracurricular: "",
    achievements: "",

    // Payment fields
    admission_quota: "",
    application_fee: 0,
  });

  // Define tabs based on payment status
  const getTabsForProgramLevel = (): Tab[] => {
    const baseTabs: Tab[] = [
      {
        name: "Program & Personal",
        id: "personal",
        fields: [
          "program_level_id",
          "degree_id",
          "course_id",
          "exam_center_id",
          "full_name",
          "gender",
          "dob",
          "nationality",
          "category",
          "seat_reservation_quota",
          "caste",
          "mother_tongue",
          "nativity",
          "aadhaar",
        ],
      },
      {
        name: "Contact & Family",
        id: "contact",
        fields: [
          "mobile",
          "email",
          "communication_address",
          "communication_city",
          "communication_state",
          "communication_district",
          "communication_pincode",
          "communication_country",
          "permanent_address",
          "permanent_city",
          "permanent_state",
          "permanent_district",
          "permanent_pincode",
          "permanent_country",
          "father_name",
          "father_mobile",
          "father_education",
          "father_occupation",
          "mother_name",
          "mother_mobile",
          "mother_education",
          "mother_occupation",
          "annual_family_income",
          "emergency_contact_name",
          "emergency_contact_relation",
          "emergency_contact_mobile",
        ],
      },
      {
        name: "Academic Records",
        id: "academic",
        fields: [],
      },
    ];

    if (paymentStatus === "completed") {
      baseTabs.push({
        name: "Downloads",
        id: "downloads",
        fields: [],
      });
    } else {
      baseTabs.push({
        name: "Payment",
        id: "payment",
        fields: [],
      });
    }

    return baseTabs;
  };

  const tabs = getTabsForProgramLevel();

  // Handle authentication errors on mount
  useEffect(() => {
    const error = searchParams.get("error");

    if (error === "login_required") {
      toast.error("Please login to access the admission form");
      setTimeout(() => router.push("/"), 2000);
      return;
    } else if (error === "unauthorized") {
      toast.error("Unauthorized access. Please login with your account.");
      setTimeout(() => router.push("/"), 2000);
      return;
    } else if (error === "session_expired") {
      toast.error("Your session has expired. Please login again.");
      setTimeout(() => router.push("/"), 2000);
      return;
    }
  }, [searchParams, router]);

  // Logout function
  const handleLogout = async () => {
    if (isLoggingOut) return;

    const confirmLogout = window.confirm(
      "Are you sure you want to logout? Any unsaved changes will be lost.",
    );
    if (!confirmLogout) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Logged out successfully");
        if (userEmail) {
          localStorage.removeItem(`admission_active_tab_${userEmail}`);
        }
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        toast.error("Logout failed. Please try again.");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
      setIsLoggingOut(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (!userEmail) {
      toast.error("Please login to access this form");
      router.push("/");
      return;
    }
    fetchPrograms();
    fetchExamCenters();
    loadFormData();
  }, [userEmail]);

  // Fetch degrees when program changes
  useEffect(() => {
    if (form.program_level_id) {
      fetchDegrees(form.program_level_id);
    }
  }, [form.program_level_id]);

  // Fetch courses when degree changes
  useEffect(() => {
    if (form.degree_id) {
      fetchCourses(form.degree_id);
    }
  }, [form.degree_id]);

  // Listen for copy address event
  useEffect(() => {
    const handleCopyAddress = () => {
      setForm((prev: any) => ({
        ...prev,
        permanent_address: prev.communication_address,
        permanent_city: prev.communication_city,
        permanent_state: prev.communication_state,
        permanent_district: prev.communication_district,
        permanent_pincode: prev.communication_pincode,
        permanent_country: prev.communication_country,
      }));
      toast.success("Address copied!");
    };

    window.addEventListener("copyAddress", handleCopyAddress);
    return () => window.removeEventListener("copyAddress", handleCopyAddress);
  }, []);

  useEffect(() => {
    if (form.second_preference_degree_id && dataLoaded) {
      fetchCourses(form.second_preference_degree_id, "second");
    } else {
      setSecondPreferenceCourses([]);
    }
  }, [form.second_preference_degree_id, dataLoaded]);

  useEffect(() => {
    if (form.third_preference_degree_id && dataLoaded) {
      fetchCourses(form.third_preference_degree_id, "third");
    } else {
      setThirdPreferenceCourses([]);
    }
  }, [form.third_preference_degree_id, dataLoaded]);

  // Fetch functions
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

  const fetchCourses = async (
    degreeId: string,
    preference: "first" | "second" | "third" = "first",
  ) => {
    try {
      const response = await fetch(`/api/courses?degree_id=${degreeId}`);
      const data = await response.json();

      if (preference === "first") {
        setCourses(data);
      } else if (preference === "second") {
        setSecondPreferenceCourses(data);
      } else {
        setThirdPreferenceCourses(data);
      }
    } catch (error) {
      toast.error(`Failed to load ${preference} preference courses`);
    }
  };

  const fetchExamCenters = async () => {
    try {
      const response = await fetch("/api/exam-centers");
      const data = await response.json();
      setExamCenters(data);
    } catch (error) {
      toast.error("Failed to load exam centers");
    }
  };

  const fetchHallTicketStatus = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `/api/hall-ticket/check-status?email=${userEmail}`,
      );
      const data = await response.json();

      console.log("Hall Ticket Check Response:", data);

      setHasHallTicket(data.hasHallTicket || false);
      setHallTicketStatus(data.status || "");
      setIsAllocated(data.isAllocated || false);
    } catch (error) {
      console.error("Error fetching hall ticket status:", error);
      setHasHallTicket(false);
      setHallTicketStatus("");
      setIsAllocated(false);
    }
  };

  // ADD THIS useEffect TO CALL THE FUNCTION
  useEffect(() => {
    // Check hall ticket status when payment is completed
    if (paymentStatus === "completed" && userEmail && dataLoaded) {
      console.log("Fetching hall ticket status...");
      fetchHallTicketStatus();

      // Optional: Poll every 30 seconds for updates
      const interval = setInterval(() => {
        fetchHallTicketStatus();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [paymentStatus, userEmail, dataLoaded]);

  // Load existing form data
  const loadFormData = async () => {
    if (!userEmail) return;

    try {
      console.log("Starting to load form data...");
      const data = await loadCompleteForm();

      if (data) {
        // Populate form fields
        const sanitizedData: any = {};
        Object.keys(form).forEach((key) => {
          const value = (data as any)[key];

          if (key === "dob" && value) {
            sanitizedData[key] =
              typeof value === "string" ? value.split("T")[0] : value;
          } else {
            sanitizedData[key] =
              value === null || value === undefined ? "" : String(value);
          }
        });

        setForm(sanitizedData);
        setPaymentStatus(data.payment_status || "");
        const allotment = (data as any).allotment_status || "";
        setAdmissionId((data as any).id);

        // Load academic marks
        if (data.academicMarks && Array.isArray(data.academicMarks)) {
          data.academicMarks.forEach((mark: any) => {
            if (mark.qualification_level === "12th") {
              if (
                mark.subjects &&
                Array.isArray(mark.subjects) &&
                mark.subjects.length > 0
              ) {
                setTwelfthSubjects(mark.subjects);
              } else {
                setTwelfthSubjects([
                  {
                    subject_name: "",
                    marks_obtained: undefined,
                    max_marks: undefined,
                  },
                ]);
              }
            }

            if (mark.qualification_level === "10th") {
              sanitizedData.tenth_register_number = mark.register_number || "";
              sanitizedData.tenth_board = mark.board_or_university || "";
              sanitizedData.tenth_school = mark.school_or_college || "";
              sanitizedData.tenth_year = mark.year_of_passing || "";
              sanitizedData.tenth_percentage = mark.percentage_or_cgpa || "";
            }

            if (mark.qualification_level === "12th") {
              sanitizedData.twelfth_register_number =
                mark.register_number || "";
              sanitizedData.twelfth_board = mark.board_or_university || "";
              sanitizedData.twelfth_school = mark.school_or_college || "";
              sanitizedData.twelfth_year = mark.year_of_passing || "";
              sanitizedData.twelfth_percentage = mark.percentage_or_cgpa || "";
              sanitizedData.twelfth_stream = mark.stream_or_degree || "";
            }

            if (mark.qualification_level === "ug") {
              sanitizedData.ug_university = mark.board_or_university || "";
              sanitizedData.ug_college = mark.school_or_college || "";
              sanitizedData.ug_degree = mark.stream_or_degree || "";
              sanitizedData.ug_year = mark.year_of_passing || "";
              sanitizedData.ug_percentage = mark.percentage_or_cgpa || "";
            }

            if (mark.qualification_level === "pg") {
              sanitizedData.pg_university = mark.board_or_university || "";
              sanitizedData.pg_college = mark.school_or_college || "";
              sanitizedData.pg_degree = mark.stream_or_degree || "";
              sanitizedData.pg_year = mark.year_of_passing || "";
              sanitizedData.pg_percentage = mark.percentage_or_cgpa || "";
            }
          });

          setForm(sanitizedData);
        }

        checkCompletedTabs(sanitizedData);
        console.log("Form data loaded successfully");
      }
    } catch (error) {
      console.error("Error loading form:", error);
    } finally {
      setIsLoading(false);
      setDataLoaded(true);
    }
  };

  // Restore tab
  useEffect(() => {
    if (dataLoaded && userEmail && !hasRestoredTab) {
      const savedTab = localStorage.getItem(
        `admission_active_tab_${userEmail}`,
      );

      if (savedTab !== null) {
        const tabIndex = parseInt(savedTab, 10);
        setActiveTab(tabIndex);
      }

      setHasRestoredTab(true);
    }
  }, [dataLoaded, userEmail, hasRestoredTab]);

  // Save tab changes
  useEffect(() => {
    if (dataLoaded && userEmail && hasRestoredTab) {
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        activeTab.toString(),
      );
    }
  }, [activeTab, dataLoaded, userEmail, hasRestoredTab]);

  // Check completed tabs
  const checkCompletedTabs = (formData: any) => {
    const completed: number[] = [];
    const currentTabs = getTabsForProgramLevel();

    currentTabs.forEach((tab, index) => {
      if (index < currentTabs.length - 1 && tab.fields.length > 0) {
        const allFieldsFilled = tab.fields.every(
          (field) =>
            formData[field] && formData[field].toString().trim() !== "",
        );
        if (allFieldsFilled) {
          completed.push(index);
        }
      }
    });

    setCompletedTabs(completed);
  };

  // Handle form input changes with validation
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (paymentStatus === "completed") {
      toast.error("Form is locked. Cannot make changes.");
      return;
    }

    if (name === "second_preference_degree_id") {
      setForm((prev: any) => ({
        ...prev,
        second_preference_degree_id: value,
        second_preference_course_id: "",
      }));
      setSecondPreferenceCourses([]);
      if (value) {
        fetchCourses(value, "second");
      }
      return;
    }

    if (name === "third_preference_degree_id") {
      setForm((prev: any) => ({
        ...prev,
        third_preference_degree_id: value,
        third_preference_course_id: "",
      }));
      setThirdPreferenceCourses([]);
      if (value) {
        fetchCourses(value, "third");
      }
      return;
    }

    // Input-specific validations
    let validatedValue = value;

    // Numbers-only fields
    if (
      [
        "mobile",
        "father_mobile",
        "mother_mobile",
        "emergency_contact_mobile",
        "aadhaar",
        "communication_pincode",
        "permanent_pincode",
      ].includes(name)
    ) {
      validatedValue = value.replace(/\D/g, ""); // Remove non-digits
    }

    // Percentage fields (0-100 with decimals)
    if (
      [
        "tenth_percentage",
        "twelfth_percentage",
        "ug_percentage",
        "pg_percentage",
        "disability_percentage",
      ].includes(name)
    ) {
      // Allow numbers and decimal point
      validatedValue = value.replace(/[^\d.]/g, "");
      const num = parseFloat(validatedValue);
      if (num > 100) validatedValue = "100";
    }

    // Year fields (4 digits)
    if (["tenth_year", "twelfth_year", "ug_year", "pg_year"].includes(name)) {
      validatedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Name fields (letters and spaces only)
    if (
      [
        "full_name",
        "father_name",
        "mother_name",
        "emergency_contact_name",
      ].includes(name)
    ) {
      validatedValue = value.replace(/[^a-zA-Z\s.]/g, "");
    }

    // Special handling for application_fee
    if (name === "application_fee") {
      setForm((prev: any) => ({ ...prev, [name]: Number(validatedValue) }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: validatedValue }));
    }

    // Reset dependent fields
    if (name === "program_level_id") {
      setForm((prev: any) => ({
        ...prev,
        program_level_id: value,
        degree_id: "",
        course_id: "",
        second_preference_degree_id: "",
        second_preference_course_id: "",
        third_preference_degree_id: "",
        third_preference_course_id: "",
      }));
      setDegrees([]);
      setCourses([]);
      setSecondPreferenceCourses([]);
      setThirdPreferenceCourses([]);
      return;
    }

    if (name === "degree_id") {
      setForm((prev: any) => ({
        ...prev,
        degree_id: validatedValue,
        course_id: "",
        second_preference_course_id: "",
        third_preference_course_id: "",
      }));
      setCourses([]);
    }
  };

  // Subject management
  const addSubject = () => {
    if (twelfthSubjects.length < 10) {
      setTwelfthSubjects([
        ...twelfthSubjects,
        { subject_name: "", marks_obtained: undefined, max_marks: undefined },
      ]);
    } else {
      toast.error("Maximum 10 subjects allowed");
    }
  };

  const removeSubject = (index: number) => {
    if (twelfthSubjects.length > 1) {
      setTwelfthSubjects(twelfthSubjects.filter((_, i) => i !== index));
    }
  };

  const handleSubjectChange = (
    index: number,
    field: keyof SubjectMark,
    value: any,
  ) => {
    const updated = [...twelfthSubjects];

    // Validate numeric fields
    if (field === "marks_obtained" || field === "max_marks") {
      const numValue = value.replace(/[^\d.]/g, "");
      updated[index] = {
        ...updated[index],
        [field]: numValue ? parseFloat(numValue) : undefined,
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    // Auto-calculate percentage
    if (field === "marks_obtained" || field === "max_marks") {
      const marks = updated[index].marks_obtained;
      const maxMarks = updated[index].max_marks;

      if (marks && maxMarks && maxMarks > 0) {
        updated[index].percentage = parseFloat(
          ((marks / maxMarks) * 100).toFixed(2),
        );
      }
    }

    setTwelfthSubjects(updated);
  };

  // Validate tab
  const validateTab = (tabIndex: number): boolean => {
    const tab = tabs[tabIndex];

    if (tab.fields.length === 0) return true;

    const emptyFields = tab.fields.filter(
      (field) => !form[field] || form[field].toString().trim() === "",
    );

    if (emptyFields.length > 0) {
      toast.error(`Please fill all required fields in ${tab.name}`);
      return false;
    }

    // Tab-specific validations
    if (tabIndex === 0) {
      if (!validateName(form.full_name)) {
        toast.error("Invalid full name format");
        return false;
      }
      if (!validateAadhaar(form.aadhaar)) {
        toast.error("Aadhaar must be exactly 12 digits");
        return false;
      }
    }

    if (tabIndex === 1) {
      if (!validateMobile(form.mobile)) {
        toast.error("Mobile must be exactly 10 digits");
        return false;
      }
      if (!validateEmail(form.email)) {
        toast.error("Invalid email format");
        return false;
      }
      if (!validatePincode(form.communication_pincode)) {
        toast.error("Communication PIN code must be exactly 6 digits");
        return false;
      }
      if (!validatePincode(form.permanent_pincode)) {
        toast.error("Permanent PIN code must be exactly 6 digits");
        return false;
      }
      if (!validateMobile(form.father_mobile)) {
        toast.error("Father's mobile must be exactly 10 digits");
        return false;
      }
      if (!validateMobile(form.mother_mobile)) {
        toast.error("Mother's mobile must be exactly 10 digits");
        return false;
      }
      if (!validateMobile(form.emergency_contact_mobile)) {
        toast.error("Emergency contact mobile must be exactly 10 digits");
        return false;
      }
      if (
        !form.annual_family_income ||
        form.annual_family_income.trim() === ""
      ) {
        toast.error("Please enter annual family income");
        return false;
      }
    }

    if (tabIndex === 2) {
      if (!form.tenth_board || !form.tenth_year || !form.tenth_percentage) {
        toast.error("Please fill all 10th standard details");
        return false;
      }
      if (!validateYear(form.tenth_year)) {
        toast.error("Invalid 10th passing year");
        return false;
      }
      if (!validatePercentage(form.tenth_percentage)) {
        toast.error("Invalid 10th percentage");
        return false;
      }

      if (
        !form.twelfth_board ||
        !form.twelfth_year ||
        !form.twelfth_percentage
      ) {
        toast.error("Please fill all 12th standard details");
        return false;
      }
      if (!validateYear(form.twelfth_year)) {
        toast.error("Invalid 12th passing year");
        return false;
      }
      if (!validatePercentage(form.twelfth_percentage)) {
        toast.error("Invalid 12th percentage");
        return false;
      }

      const validSubjects = twelfthSubjects.filter(
        (s) => s.subject_name && s.marks_obtained && s.max_marks,
      );
      if (validSubjects.length === 0) {
        toast.error("Please add at least one subject for 12th standard");
        return false;
      }

      if (form.program_level_id === "2" || form.program_level_id === "3") {
        if (!form.ug_university || !form.ug_year || !form.ug_percentage) {
          toast.error("Please fill all UG details");
          return false;
        }
        if (!validateYear(form.ug_year)) {
          toast.error("Invalid UG passing year");
          return false;
        }
        if (!validatePercentage(form.ug_percentage)) {
          toast.error("Invalid UG percentage");
          return false;
        }
      }

      if (form.program_level_id === "3") {
        if (!form.pg_university || !form.pg_year || !form.pg_percentage) {
          toast.error("Please fill all PG details");
          return false;
        }
        if (!validateYear(form.pg_year)) {
          toast.error("Invalid PG passing year");
          return false;
        }
        if (!validatePercentage(form.pg_percentage)) {
          toast.error("Invalid PG percentage");
          return false;
        }
      }
    }

    return true;
  };

  // Build academic marks
  const buildAcademicMarks = (): AcademicMark[] => {
    const academicMarks: AcademicMark[] = [];

    if (form.tenth_board) {
      academicMarks.push({
        qualification_level: "10th",
        register_number: form.tenth_register_number || undefined,
        board_or_university: form.tenth_board,
        school_or_college: form.tenth_school,
        year_of_passing: form.tenth_year,
        percentage_or_cgpa: form.tenth_percentage,
      });
    }

    if (form.twelfth_board) {
      const validSubjects = twelfthSubjects.filter(
        (s) => s.subject_name && s.marks_obtained && s.max_marks,
      );
      academicMarks.push({
        qualification_level: "12th",
        register_number: form.twelfth_register_number || undefined,
        board_or_university: form.twelfth_board,
        school_or_college: form.twelfth_school,
        year_of_passing: form.twelfth_year,
        percentage_or_cgpa: form.twelfth_percentage,
        stream_or_degree: form.twelfth_stream,
        subjects: validSubjects,
      });
    }

    if (form.ug_university) {
      academicMarks.push({
        qualification_level: "ug",
        board_or_university: form.ug_university,
        school_or_college: form.ug_college,
        year_of_passing: form.ug_year,
        percentage_or_cgpa: form.ug_percentage,
        stream_or_degree: form.ug_degree,
      });
    }

    if (form.pg_university) {
      academicMarks.push({
        qualification_level: "pg",
        board_or_university: form.pg_university,
        school_or_college: form.pg_college,
        year_of_passing: form.pg_year,
        percentage_or_cgpa: form.pg_percentage,
        stream_or_degree: form.pg_degree,
      });
    }

    return academicMarks;
  };

  // Save form
  const saveForm = async (status: string = "draft") => {
    if (!userEmail) {
      toast.error("User email not found");
      return false;
    }

    try {
      const academicMarks = buildAcademicMarks();

      const completeData: CompleteFormData = {
        ...form,
        form_status: status,
        academicMarks,
      };

      const result = await saveCompleteForm(completeData, admissionId);

      if (result.success) {
        if (result.admissionId && !admissionId) {
          setAdmissionId(result.admissionId);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save form");
      return false;
    }
  };

  const nextTab = async () => {
    if (!validateTab(activeTab)) return;

    setIsSubmitting(true);

    try {
      const saved = await saveForm();

      if (!saved) {
        toast.error("Please fix the errors before continuing");
        setIsSubmitting(false);
        return;
      }

      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs([...completedTabs, activeTab]);
      }

      if (activeTab < tabs.length - 1) {
        const newTab = activeTab + 1;
        setActiveTab(newTab);

        localStorage.setItem(
          `admission_active_tab_${userEmail}`,
          newTab.toString(),
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.success("Progress saved! Moving to next section.");
      } else {
        toast.success("Form saved successfully!");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      const newTab = activeTab - 1;
      setActiveTab(newTab);
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        newTab.toString(),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabClick = (index: number) => {
    if (paymentStatus === "completed") {
      setActiveTab(index);
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        index.toString(),
      );
      return;
    }

    if (
      completedTabs.includes(index) ||
      index === 0 ||
      completedTabs.includes(index - 1)
    ) {
      setActiveTab(index);
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        index.toString(),
      );
    } else {
      toast.error("Please complete previous sections first");
    }
  };

  const handlePayment = async () => {
    if (
      !completedTabs.includes(0) ||
      !completedTabs.includes(1) ||
      !completedTabs.includes(2)
    ) {
      toast.error("Please complete all sections before payment");
      return;
    }

    if (!form.admission_quota || form.application_fee === 0) {
      toast.error("Please select an admission quota");
      return;
    }

    setShowEasebuzzCheckout(true);
  };

  const handleViewApplication = () => {
    router.push(`/application-preview?email=${userEmail}`);
  };

  const handleDownloadHallTicket = () => {
    router.push(`/hall-ticket-preview?email=${userEmail}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  const isFormLocked = paymentStatus === "completed";

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header Banner */}
        <div className="relative h-72 md:h-90 overflow-hidden">
          <img
            src="/assets/loyolabanner.jpg"
            alt="University Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4 pt-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Admission Application Form
              </h1>
              <p className="text-lg md:text-xl">
                {yearLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : academicYear ? (
                  `Academic Year ${academicYear.start}`
                ) : (
                  "Academic Year Information"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg -mt-10 relative z-10 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="lg:w-64 bg-primary p-6">
              <nav className="space-y-2" role="tablist">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    disabled={
                      !isFormLocked &&
                      index > 0 &&
                      !completedTabs.includes(index - 1) &&
                      !completedTabs.includes(index)
                    }
                    className={`
                      w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3
                      ${
                        activeTab === index
                          ? "bg-white text-primary shadow-lg"
                          : completedTabs.includes(index)
                            ? "bg-primary text-white hover:bg-primary"
                            : "text-white hover:bg-white/10"
                      }
                      ${
                        !isFormLocked &&
                        index > 0 &&
                        !completedTabs.includes(index - 1) &&
                        !completedTabs.includes(index)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }
                    `}
                    role="tab"
                    aria-selected={activeTab === index}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
                        ${
                          activeTab === index
                            ? "border-primary text-primary"
                            : "border-current"
                        }
                      `}
                    >
                      {completedTabs.includes(index) || isFormLocked
                        ? "✓"
                        : index + 1}
                    </span>
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-600 rounded-lg transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm">Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Form Content */}
            <div className="flex-1 p-6 md:p-10">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* Tab 0: Program & Personal */}
                {activeTab === 0 && (
                  <ProgramPersonalTab
                    form={form}
                    programs={programs}
                    degrees={degrees}
                    courses={courses}
                    secondPreferenceCourses={secondPreferenceCourses} // NEW
                    thirdPreferenceCourses={thirdPreferenceCourses} // NEW
                    examCenters={examCenters}
                    isFormLocked={isFormLocked}
                    handleChange={handleChange}
                  />
                )}

                {/* Tab 1: Contact & Family */}
                {activeTab === 1 && (
                  <ContactFamilyTab
                    form={form}
                    isFormLocked={isFormLocked}
                    handleChange={handleChange}
                  />
                )}

                {/* Tab 2: Academic Records */}
                {activeTab === 2 && (
                  <AcademicRecordsTab
                    form={form}
                    programLevelId={form.program_level_id}
                    isFormLocked={isFormLocked}
                    twelfthSubjects={twelfthSubjects}
                    handleChange={handleChange}
                    handleSubjectChange={handleSubjectChange}
                    addSubject={addSubject}
                    removeSubject={removeSubject}
                  />
                )}

                {/* Tab 3: Payment or Downloads */}
                {activeTab === 3 && (
                  <>
                    {paymentStatus === "completed" ? (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <svg
                              className="w-8 h-8 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Application Submitted Successfully!
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Your payment has been completed and application is
                            submitted.
                          </p>
                        </div>

                        {/* Download Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Application Download - Always Available */}
                          <button
                            onClick={handleViewApplication}
                            className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Download Application
                          </button>

                          {/* Hall Ticket Status Card */}
                          {isAllocated ? (
                            // Hall ticket available - status is "allocated"
                            <button
                              onClick={handleDownloadHallTicket}
                              className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                />
                              </svg>
                              Download Hall Ticket
                            </button>
                          ) : hasHallTicket &&
                            hallTicketStatus?.toLowerCase() === "pending" ? (
                            // Hall ticket generated but pending
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-4 bg-yellow-50 border-2 border-yellow-300 text-yellow-800 rounded-lg">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <div className="font-semibold text-sm">
                                  Allocation Pending
                                </div>
                              </div>
                              <div className="text-xs text-center">
                                Available after allocation
                              </div>
                            </div>
                          ) : (
                            // Hall ticket not available yet
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-4 bg-gray-50 border-2 border-gray-200 text-gray-600 rounded-lg">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                <div className="font-semibold text-sm">
                                  Hall Ticket Not Available
                                </div>
                              </div>
                              <div className="text-xs text-center">
                                Check back later
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <PaymentTab
                        isFormLocked={isFormLocked}
                        isSubmitting={isSubmitting}
                        handlePayment={handlePayment}
                        handleViewApplication={handleViewApplication}
                        userName={form.full_name}
                        userPhone={form.mobile}
                        form={form}
                        handleChange={handleChange}
                      />
                    )}
                  </>
                )}

                {/* Navigation Buttons */}
                {activeTab < tabs.length - 1 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevTab}
                      disabled={activeTab === 0}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextTab}
                      disabled={isSubmitting || isFormLocked}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>Next →</>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        {showEasebuzzCheckout && (
          <EasebuzzCheckout
            amount={form.application_fee}
            firstname={form.full_name}
            email={form.email}
            phone={form.mobile}
            productinfo="Admission Application Fee"
            onClose={() => setShowEasebuzzCheckout(false)}
          />
        )}
      </div>
    </>
  );
}

export default function AdmissionFormPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <AdmissionFormContent />
    </Suspense>
  );
}
