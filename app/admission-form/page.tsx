// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast, Toaster } from "react-hot-toast";
// import Script from "next/script";
// import { useAcademicYear } from "../hooks/useAcademicYears";
// import { useAdmissionForm } from "../hooks/useAdmissionForm";
// import {
//   Program,
//   Degree,
//   Course,
//   ExamCenter,
//   SubjectMark,
//   AcademicMark,
//   CompleteFormData,
// } from "@/types/admission";
// import {
//   validateName,
//   validateMobile,
//   validateEmail,
//   validateAadhaar,
//   validatePincode,
//   validateYear,
//   validatePercentage,
// } from "../lib/validators";

// // Import tab components
// import ProgramPersonalTab from "./components/ProgramPersonalTab";
// import ContactFamilyTab from "./components/ContactFamilyTab";
// import AcademicRecordsTab from "./components/AcademicRecordsTab";
// import PaymentTab from "./components/PaymentTab";

// interface Tab {
//   name: string;
//   id: string;
//   fields: string[];
// }

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// function AdmissionFormContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const userEmail = searchParams.get("email");
//   const { academicYear, loading: yearLoading } = useAcademicYear();
//   const {
//     saveCompleteForm,
//     loadCompleteForm,
//     isLoading: formSaving,
//   } = useAdmissionForm(userEmail);

//   // Dropdown data
//   const [programs, setPrograms] = useState<Program[]>([]);
//   const [degrees, setDegrees] = useState<Degree[]>([]);
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);

//   // UI states
//   const [activeTab, setActiveTab] = useState<number>(0);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [completedTabs, setCompletedTabs] = useState<number[]>([]);
//   const [paymentStatus, setPaymentStatus] = useState<string>("");
//   const [admissionId, setAdmissionId] = useState<number | undefined>();
//   const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

//   // 12th standard subjects
//   const [twelfthSubjects, setTwelfthSubjects] = useState<SubjectMark[]>([
//     { subject_name: "", marks_obtained: undefined, max_marks: undefined },
//   ]);

//   // Form data - flattened structure for easier form handling
//   const [form, setForm] = useState<any>({
//     // Basic Info
//     program_level_id: "",
//     degree_id: "",
//     course_id: "",
//     second_preference_course_id: "",
//     third_preference_course_id: "",
//     exam_center_id: "",

//     // Personal Info
//     full_name: "",
//     gender: "",
//     dob: "",
//     mobile: "",
//     email: "",
//     aadhaar: "",
//     nationality: "",
//     religion: "",
//     category: "",
//     seat_reservation_quota: "",
//     caste: "",
//     mother_tongue: "",
//     nativity: "",
//     blood_group: "",

//     // Family Info
//     father_name: "",
//     father_mobile: "",
//     father_education: "",
//     father_occupation: "",
//     mother_name: "",
//     mother_mobile: "",
//     mother_education: "",
//     mother_occupation: "",
//     annual_family_income: "",
//     is_disabled: "no",
//     disability_type: "",
//     disability_percentage: "",
//     dependent_of: "none",
//     seeking_admission_under_quota: "no",
//     scholarship_or_fee_concession: "no",
//     hostel_accommodation_required: "no",
//     emergency_contact_name: "",
//     emergency_contact_relation: "",
//     emergency_contact_mobile: "",

//     // Address Info
//     communication_address: "",
//     communication_city: "",
//     communication_state: "",
//     communication_district: "",
//     communication_pincode: "",
//     communication_country: "",
//     permanent_address: "",
//     permanent_city: "",
//     permanent_state: "",
//     permanent_district: "",
//     permanent_pincode: "",
//     permanent_country: "",

//     // Academic Info (temporary flat structure)
//     tenth_register_number: "",
//     tenth_board: "",
//     tenth_school: "",
//     tenth_year: "",
//     tenth_percentage: "",
//     twelfth_register_number: "",
//     twelfth_board: "",
//     twelfth_school: "",
//     twelfth_year: "",
//     twelfth_percentage: "",
//     twelfth_stream: "",
//     ug_university: "",
//     ug_college: "",
//     ug_degree: "",
//     ug_year: "",
//     ug_percentage: "",
//     pg_university: "",
//     pg_college: "",
//     pg_degree: "",
//     pg_year: "",
//     pg_percentage: "",

//     // Additional
//     previous_gap: "",
//     extracurricular: "",
//     achievements: "",
//   });

//   // Define tabs based on payment status
//   const getTabsForProgramLevel = (): Tab[] => {
//     const baseTabs: Tab[] = [
//       {
//         name: "Program & Personal",
//         id: "personal",
//         fields: [
//           "program_level_id",
//           "degree_id",
//           "course_id",
//           "exam_center_id",
//           "full_name",
//           "gender",
//           "dob",
//           "nationality",
//           "category",
//           "seat_reservation_quota",
//           "caste",
//           "mother_tongue",
//           "nativity",
//           "aadhaar",
//         ],
//       },
//       {
//         name: "Contact & Family",
//         id: "contact",
//         fields: [
//           "mobile",
//           "email",
//           "communication_address",
//           "communication_city",
//           "communication_state",
//           "communication_district",
//           "communication_pincode",
//           "communication_country",
//           "permanent_address",
//           "permanent_city",
//           "permanent_state",
//           "permanent_district",
//           "permanent_pincode",
//           "permanent_country",
//           "father_name",
//           "father_mobile",
//           "father_education",
//           "father_occupation",
//           "mother_name",
//           "mother_mobile",
//           "mother_education",
//           "mother_occupation",
//           "annual_family_income",
//           "emergency_contact_name",
//           "emergency_contact_relation",
//           "emergency_contact_mobile",
//         ],
//       },
//       {
//         name: "Academic Records",
//         id: "academic",
//         fields: [],
//       },
//     ];

//     if (paymentStatus === "completed") {
//       baseTabs.push({
//         name: "Download Application",
//         id: "download",
//         fields: [],
//       });
//     } else {
//       baseTabs.push({
//         name: "Payment",
//         id: "payment",
//         fields: [],
//       });
//     }

//     return baseTabs;
//   };

//   const tabs = getTabsForProgramLevel();

//   const handleNext = async () => {
//   if (paymentStatus === "completed") {
//     toast.error("Form is locked. Cannot make changes.");
//     return;
//   }

//   // Validate current tab fields
//   const currentTab = tabs[activeTab];
//   const missingFields = currentTab.fields.filter(
//     field => !form[field] || form[field].toString().trim() === ""
//   );

//   if (missingFields.length > 0) {
//     toast.error("Please fill all required fields before proceeding");
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     // Prepare data for saving
//     const formDataToSave: CompleteFormData = {
//       ...form,
//       academicMarks: [], // Add your academic marks here
//       form_status: 'draft',
//     };

//     // Save the form
//     const result = await saveCompleteForm(formDataToSave, admissionId);

//     if (result.success) {
//       // Update admission ID if this is first save
//       if (!admissionId && result.admissionId) {
//         setAdmissionId(result.admissionId);
//       }

//       // Mark current tab as completed
//       if (!completedTabs.includes(activeTab)) {
//         setCompletedTabs(prev => [...prev, activeTab]);
//       }

//       // Move to next tab - THIS IS THE KEY PART
//       if (activeTab < tabs.length - 1) {
//         setActiveTab(activeTab + 1);
//         toast.success("Progress saved! Moving to next section.");
//       } else {
//         toast.success("Form saved successfully!");
//       }
//     } else {
//       toast.error(result.error || "Failed to save form");
//     }
//   } catch (error: any) {
//     console.error("Save error:", error);
//     toast.error("An error occurred while saving");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

// // Save active tab whenever it changes
// useEffect(() => {
//   if (userEmail) {
//     localStorage.setItem(`admission_active_tab_${userEmail}`, activeTab.toString());
//   }
// }, [activeTab, userEmail]);

// // Load active tab on mount
// useEffect(() => {
//   if (userEmail) {
//     const savedTab = localStorage.getItem(`admission_active_tab_${userEmail}`);
//     if (savedTab !== null) {
//       setActiveTab(parseInt(savedTab, 10));
//     }
//   }
// }, [userEmail]);

//   // Handle authentication errors on mount
//   useEffect(() => {
//     const error = searchParams.get("error");

//     if (error === "login_required") {
//       toast.error("Please login to access the admission form");
//       setTimeout(() => router.push("/"), 2000);
//       return;
//     } else if (error === "unauthorized") {
//       toast.error("Unauthorized access. Please login with your account.");
//       setTimeout(() => router.push("/"), 2000);
//       return;
//     } else if (error === "session_expired") {
//       toast.error("Your session has expired. Please login again.");
//       setTimeout(() => router.push("/"), 2000);
//       return;
//     }
//   }, [searchParams, router]);

//   // Logout function
//   const handleLogout = async () => {
//     if (isLoggingOut) return;

//     const confirmLogout = window.confirm(
//       "Are you sure you want to logout? Any unsaved changes will be lost."
//     );
//     if (!confirmLogout) return;

//     setIsLoggingOut(true);

//     try {
//       const response = await fetch("/api/logout", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (response.ok) {
//         toast.success("Logged out successfully");
//         // Clear any local storage
//         if (userEmail) {
//           localStorage.removeItem(`admission_active_tab_${userEmail}`);
//         }
//         setTimeout(() => {
//           router.push("/");
//         }, 500);
//       } else {
//         toast.error("Logout failed. Please try again.");
//         setIsLoggingOut(false);
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//       toast.error("An error occurred during logout");
//       setIsLoggingOut(false);
//     }
//   };

//   // Load initial data
//   useEffect(() => {
//     if (!userEmail) {
//       toast.error("Please login to access this form");
//       router.push("/");
//       return;
//     }
//     fetchPrograms();
//     fetchExamCenters();
//     loadFormData();
//   }, [userEmail]);

//   // Fetch degrees when program changes
//   useEffect(() => {
//     if (form.program_level_id) {
//       fetchDegrees(form.program_level_id);
//     }
//   }, [form.program_level_id]);

//   // Fetch courses when degree changes
//   useEffect(() => {
//     if (form.degree_id) {
//       fetchCourses(form.degree_id);
//     }
//   }, [form.degree_id]);

//   // Listen for copy address event
//   useEffect(() => {
//     const handleCopyAddress = () => {
//       setForm((prev: any) => ({
//         ...prev,
//         permanent_address: prev.communication_address,
//         permanent_city: prev.communication_city,
//         permanent_state: prev.communication_state,
//         permanent_district: prev.communication_district,
//         permanent_pincode: prev.communication_pincode,
//         permanent_country: prev.communication_country,
//       }));
//       toast.success("Address copied!");
//     };

//     window.addEventListener("copyAddress", handleCopyAddress);
//     return () => window.removeEventListener("copyAddress", handleCopyAddress);
//   }, []);

//   // Fetch functions
//   const fetchPrograms = async () => {
//     try {
//       const response = await fetch("/api/programs");
//       const data = await response.json();
//       setPrograms(data);
//     } catch (error) {
//       toast.error("Failed to load programs");
//     }
//   };

//   const fetchDegrees = async (programId: string) => {
//     try {
//       const response = await fetch(`/api/degrees?program_id=${programId}`);
//       const data = await response.json();
//       setDegrees(data);
//     } catch (error) {
//       toast.error("Failed to load degrees");
//     }
//   };

//   const fetchCourses = async (degreeId: string) => {
//     try {
//       const response = await fetch(`/api/courses?degree_id=${degreeId}`);
//       const data = await response.json();
//       setCourses(data);
//     } catch (error) {
//       toast.error("Failed to load courses");
//     }
//   };

//   const fetchExamCenters = async () => {
//     try {
//       const response = await fetch("/api/exam-centers");
//       const data = await response.json();
//       setExamCenters(data);
//     } catch (error) {
//       toast.error("Failed to load exam centers");
//     }
//   };

//   // Load existing form data
//   const loadFormData = async () => {
//     if (!userEmail) return;

//     try {
//       console.log("Starting to load form data...");
//       const data = await loadCompleteForm();

//       if (data) {
//         console.log("Form data received:", {
//           hasBasicInfo: !!data.basicInfo,
//           hasPersonalInfo: !!data.personalInfo,
//         });

//         // Populate form fields
//         const sanitizedData: any = {};
//         Object.keys(form).forEach((key) => {
//           const value = (data as any)[key];
//           sanitizedData[key] =
//             value === null || value === undefined ? "" : String(value);
//         });

//         setForm(sanitizedData);
//         setPaymentStatus(data.payment_status || "");
//         setAdmissionId((data as any).id);

//         // Load academic marks
//         if (data.academicMarks && Array.isArray(data.academicMarks)) {
//           data.academicMarks.forEach((mark: any) => {
//             if (mark.qualification_level === "12th" && mark.subjects) {
//               setTwelfthSubjects(
//                 mark.subjects.length > 0
//                   ? mark.subjects
//                   : [
//                       {
//                         subject_name: "",
//                         marks_obtained: undefined,
//                         max_marks: undefined,
//                       },
//                     ]
//               );
//             }
//           });
//         }

//         checkCompletedTabs(sanitizedData);
//         console.log("Form data loaded and populated successfully");
//       } else {
//         console.log("No existing form data - user can start fresh");
//       }
//     } catch (error) {
//       console.error("Error loading form:", error);
//       // Don't show error to user for initial load - they might be a new user
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Check which tabs are completed
//   const checkCompletedTabs = (formData: any) => {
//     const completed: number[] = [];
//     const currentTabs = getTabsForProgramLevel();

//     currentTabs.forEach((tab, index) => {
//       if (index < currentTabs.length - 1 && tab.fields.length > 0) {
//         const allFieldsFilled = tab.fields.every(
//           (field) => formData[field] && formData[field].toString().trim() !== ""
//         );
//         if (allFieldsFilled) {
//           completed.push(index);
//         }
//       }
//     });

//     setCompletedTabs(completed);
//   };

//   // Handle form input changes
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value } = e.target;

//     if (paymentStatus === "completed") {
//       toast.error("Form is locked. Cannot make changes.");
//       return;
//     }

//     setForm((prev: any) => ({ ...prev, [name]: value }));

//     // Reset dependent fields
//     if (name === "program_level_id") {
//       setForm((prev: any) => ({
//         ...prev,
//         program_level_id: value,
//         degree_id: "",
//         course_id: "",
//         second_preference_course_id: "",
//         third_preference_course_id: "",
//       }));
//       setDegrees([]);
//       setCourses([]);
//     }

//     if (name === "degree_id") {
//       setForm((prev: any) => ({
//         ...prev,
//         degree_id: value,
//         course_id: "",
//         second_preference_course_id: "",
//         third_preference_course_id: "",
//       }));
//       setCourses([]);
//     }
//   };

//   // Subject management
//   const addSubject = () => {
//     if (twelfthSubjects.length < 10) {
//       setTwelfthSubjects([
//         ...twelfthSubjects,
//         { subject_name: "", marks_obtained: undefined, max_marks: undefined },
//       ]);
//     } else {
//       toast.error("Maximum 10 subjects allowed");
//     }
//   };

//   const removeSubject = (index: number) => {
//     if (twelfthSubjects.length > 1) {
//       setTwelfthSubjects(twelfthSubjects.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubjectChange = (
//     index: number,
//     field: keyof SubjectMark,
//     value: any
//   ) => {
//     const updated = [...twelfthSubjects];
//     updated[index] = { ...updated[index], [field]: value };

//     // Auto-calculate percentage
//     if (field === "marks_obtained" || field === "max_marks") {
//       const marks =
//         field === "marks_obtained"
//           ? parseFloat(value)
//           : updated[index].marks_obtained;
//       const maxMarks =
//         field === "max_marks" ? parseFloat(value) : updated[index].max_marks;

//       if (marks && maxMarks && maxMarks > 0) {
//         updated[index].percentage = parseFloat(
//           ((marks / maxMarks) * 100).toFixed(2)
//         );
//       }
//     }

//     setTwelfthSubjects(updated);
//   };

//   // Validate tab
//   const validateTab = (tabIndex: number): boolean => {
//     const tab = tabs[tabIndex];

//     if (tab.fields.length === 0) return true;

//     const emptyFields = tab.fields.filter(
//       (field) => !form[field] || form[field].toString().trim() === ""
//     );

//     if (emptyFields.length > 0) {
//       toast.error(`Please fill all required fields in ${tab.name}`);
//       return false;
//     }

//     // Tab-specific validations
//     if (tabIndex === 0) {
//       if (!validateName(form.full_name)) {
//         toast.error("Invalid full name format");
//         return false;
//       }
//       if (!validateAadhaar(form.aadhaar)) {
//         toast.error("Aadhaar must be exactly 12 digits");
//         return false;
//       }
//     }

//     if (tabIndex === 1) {
//       if (!validateMobile(form.mobile)) {
//         toast.error("Mobile must be exactly 10 digits");
//         return false;
//       }
//       if (!validateEmail(form.email)) {
//         toast.error("Invalid email format");
//         return false;
//       }
//       if (!validatePincode(form.communication_pincode)) {
//         toast.error("Communication PIN code must be exactly 6 digits");
//         return false;
//       }
//       if (!validatePincode(form.permanent_pincode)) {
//         toast.error("Permanent PIN code must be exactly 6 digits");
//         return false;
//       }
//       if (!validateMobile(form.father_mobile)) {
//         toast.error("Father's mobile must be exactly 10 digits");
//         return false;
//       }
//       if (!validateMobile(form.mother_mobile)) {
//         toast.error("Mother's mobile must be exactly 10 digits");
//         return false;
//       }
//       if (!validateMobile(form.emergency_contact_mobile)) {
//         toast.error("Emergency contact mobile must be exactly 10 digits");
//         return false;
//       }
//     }

//     if (tabIndex === 2) {
//       // Academic validation
//       if (!form.tenth_board || !form.tenth_year || !form.tenth_percentage) {
//         toast.error("Please fill all 10th standard details");
//         return false;
//       }
//       if (!validateYear(form.tenth_year)) {
//         toast.error("Invalid 10th passing year");
//         return false;
//       }
//       if (!validatePercentage(form.tenth_percentage)) {
//         toast.error("Invalid 10th percentage");
//         return false;
//       }

//       if (
//         !form.twelfth_board ||
//         !form.twelfth_year ||
//         !form.twelfth_percentage
//       ) {
//         toast.error("Please fill all 12th standard details");
//         return false;
//       }
//       if (!validateYear(form.twelfth_year)) {
//         toast.error("Invalid 12th passing year");
//         return false;
//       }
//       if (!validatePercentage(form.twelfth_percentage)) {
//         toast.error("Invalid 12th percentage");
//         return false;
//       }

//       // Validate at least one subject for 12th
//       const validSubjects = twelfthSubjects.filter(
//         (s) => s.subject_name && s.marks_obtained && s.max_marks
//       );
//       if (validSubjects.length === 0) {
//         toast.error("Please add at least one subject for 12th standard");
//         return false;
//       }

//       // Validate UG for PG and PhD
//       if (form.program_level_id === "2" || form.program_level_id === "3") {
//         if (!form.ug_university || !form.ug_year || !form.ug_percentage) {
//           toast.error("Please fill all UG details");
//           return false;
//         }
//         if (!validateYear(form.ug_year)) {
//           toast.error("Invalid UG passing year");
//           return false;
//         }
//         if (!validatePercentage(form.ug_percentage)) {
//           toast.error("Invalid UG percentage");
//           return false;
//         }
//       }

//       // Validate PG for PhD
//       if (form.program_level_id === "3") {
//         if (!form.pg_university || !form.pg_year || !form.pg_percentage) {
//           toast.error("Please fill all PG details");
//           return false;
//         }
//         if (!validateYear(form.pg_year)) {
//           toast.error("Invalid PG passing year");
//           return false;
//         }
//         if (!validatePercentage(form.pg_percentage)) {
//           toast.error("Invalid PG percentage");
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   // Build academic marks array from form data
//   const buildAcademicMarks = (): AcademicMark[] => {
//     const academicMarks: AcademicMark[] = [];

//     // 10th standard
//     if (form.tenth_board) {
//       academicMarks.push({
//         qualification_level: "10th",
//         register_number: form.tenth_register_number || undefined,
//         board_or_university: form.tenth_board,
//         school_or_college: form.tenth_school,
//         year_of_passing: form.tenth_year,
//         percentage_or_cgpa: form.tenth_percentage,
//       });
//     }

//     // 12th standard with subjects
//     if (form.twelfth_board) {
//       const validSubjects = twelfthSubjects.filter(
//         (s) => s.subject_name && s.marks_obtained && s.max_marks
//       );
//       academicMarks.push({
//         qualification_level: "12th",
//         register_number: form.twelfth_register_number || undefined,
//         board_or_university: form.twelfth_board,
//         school_or_college: form.twelfth_school,
//         year_of_passing: form.twelfth_year,
//         percentage_or_cgpa: form.twelfth_percentage,
//         stream_or_degree: form.twelfth_stream,
//         subjects: validSubjects,
//       });
//     }

//     // UG
//     if (form.ug_university) {
//       academicMarks.push({
//         qualification_level: "ug",
//         board_or_university: form.ug_university,
//         school_or_college: form.ug_college,
//         year_of_passing: form.ug_year,
//         percentage_or_cgpa: form.ug_percentage,
//         stream_or_degree: form.ug_degree,
//       });
//     }

//     // PG
//     if (form.pg_university) {
//       academicMarks.push({
//         qualification_level: "pg",
//         board_or_university: form.pg_university,
//         school_or_college: form.pg_college,
//         year_of_passing: form.pg_year,
//         percentage_or_cgpa: form.pg_percentage,
//         stream_or_degree: form.pg_degree,
//       });
//     }

//     return academicMarks;
//   };

//   // Save form
//   const saveForm = async (status: string = "draft") => {
//     if (!userEmail) {
//       toast.error("User email not found");
//       return false;
//     }

//     try {
//       const academicMarks = buildAcademicMarks();

//       const completeData: CompleteFormData = {
//         ...form,
//         form_status: status,
//         academicMarks,
//       };

//       const result = await saveCompleteForm(completeData, admissionId);

//       if (result.success) {
//         if (result.admissionId && !admissionId) {
//           setAdmissionId(result.admissionId);
//         }
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error("Save error:", error);
//       toast.error("Failed to save form");
//       return false;
//     }
//   };

//   // Navigation
//   const nextTab = async () => {
//     if (!validateTab(activeTab)) return;

//     setIsSubmitting(true);
//     const saved = await saveForm();
//     setIsSubmitting(false);

//     if (!saved) {
//       toast.error("Please fix the errors before continuing");
//       return;
//     }

//     if (!completedTabs.includes(activeTab)) {
//       setCompletedTabs([...completedTabs, activeTab]);
//     }

//     if (activeTab < tabs.length - 1) {
//       const newTab = activeTab + 1;
//       setActiveTab(newTab);
//       localStorage.setItem(
//         `admission_active_tab_${userEmail}`,
//         newTab.toString()
//       );
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       toast.success("Progress saved successfully!");
//     }
//   };

//   const prevTab = () => {
//     if (activeTab > 0) {
//       const newTab = activeTab - 1;
//       setActiveTab(newTab);
//       localStorage.setItem(
//         `admission_active_tab_${userEmail}`,
//         newTab.toString()
//       );
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handleTabClick = (index: number) => {
//     if (paymentStatus === "completed") {
//       setActiveTab(index);
//       localStorage.setItem(
//         `admission_active_tab_${userEmail}`,
//         index.toString()
//       );
//       return;
//     }

//     if (
//       completedTabs.includes(index) ||
//       index === 0 ||
//       completedTabs.includes(index - 1)
//     ) {
//       setActiveTab(index);
//       localStorage.setItem(
//         `admission_active_tab_${userEmail}`,
//         index.toString()
//       );
//     } else {
//       toast.error("Please complete previous sections first");
//     }
//   };

//   // Payment handling
//   const handlePayment = async () => {
//     setIsSubmitting(true);

//     try {
//       const orderResponse = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ amount: 1000 }),
//       });

//       const { orderId, amount, currency } = await orderResponse.json();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: amount,
//         currency: currency,
//         name: "Loyola College",
//         description: "Admission Application Fee",
//         order_id: orderId,
//         handler: async function (response: any) {
//           const verifyResponse = await fetch("/api/payment/verify", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               email: userEmail,
//               amount: amount / 100,
//             }),
//           });

//           if (verifyResponse.ok) {
//             toast.success("Application submitted successfully!");
//             setTimeout(() => {
//               if (userEmail) {
//                 router.push(
//                   `/application-download?email=${encodeURIComponent(userEmail)}`
//                 );
//               } else {
//                 toast.error("User email not found");
//                 router.push("/");
//               }
//             }, 1500);
//           }
//         },
//         prefill: {
//           name: form.full_name,
//           email: form.email,
//           contact: form.mobile,
//         },
//         theme: {
//           color: "#342D87",
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//       paymentObject.on("payment.failed", function (response: any) {
//         toast.error("Payment failed. Please try again.");
//         setIsSubmitting(false);
//       });
//     } catch (error) {
//       console.error("Payment error:", error);
//       toast.error("Payment initialization failed");
//       setIsSubmitting(false);
//     }
//   };

//   const handleViewApplication = () => {
//     router.push(`/application-preview?email=${userEmail}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading form...</p>
//         </div>
//       </div>
//     );
//   }

//   const isFormLocked = paymentStatus === "completed";

//   return (
//     <>
//       <Script
//         id="razorpay-checkout-js"
//         src="https://checkout.razorpay.com/v1/checkout.js"
//       />
//       <Toaster position="top-right" />

//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//         {/* Header Banner */}
//         <div className="relative h-72 md:h-90 overflow-hidden">
//           <img
//             src="/assets/loyolabanner.jpg"
//             alt="University Campus"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <div className="text-center text-white px-4 pt-10">
//               <h1 className="text-4xl md:text-5xl font-bold mb-3">
//                 Admission Application Form
//               </h1>
//               <p className="text-lg md:text-xl">
//                 {yearLoading ? (
//                   <span className="animate-pulse">Loading...</span>
//                 ) : academicYear ? (
//                   `Academic Year ${academicYear.start}`
//                 ) : (
//                   "Academic Year Information"
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Container */}
//         <div className="container mx-auto px-4 py-10 max-w-7xl">
//           <div className="bg-white rounded-2xl shadow-lg -mt-10 relative z-10 flex flex-col lg:flex-row overflow-hidden">
//             {/* Sidebar Tabs */}
//             <div className="lg:w-64 bg-primary p-6">
//               <nav className="space-y-2" role="tablist">
//                 {tabs.map((tab, index) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => handleTabClick(index)}
//                     disabled={
//                       !isFormLocked &&
//                       index > 0 &&
//                       !completedTabs.includes(index - 1) &&
//                       !completedTabs.includes(index)
//                     }
//                     className={`
//           w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-3
//           ${
//             activeTab === index
//               ? "bg-white text-primary shadow-lg"
//               : completedTabs.includes(index)
//               ? "bg-primary text-white hover:bg-primary"
//               : "text-white hover:bg-white/10"
//           }
//           ${
//             !isFormLocked &&
//             index > 0 &&
//             !completedTabs.includes(index - 1) &&
//             !completedTabs.includes(index)
//               ? "opacity-50 cursor-not-allowed"
//               : "cursor-pointer"
//           }
//         `}
//                     role="tab"
//                     aria-selected={activeTab === index}
//                   >
//                     <span
//                       className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2
//           ${
//             activeTab === index
//               ? "border-primary text-primary"
//               : "border-current"
//           }
//         `}
//                     >
//                       {completedTabs.includes(index) || isFormLocked
//                         ? "✓"
//                         : index + 1}
//                     </span>
//                     <span className="text-sm">{tab.name}</span>
//                   </button>
//                 ))}
//               </nav>

//               {/* Logout Button - Below all tabs */}
//               <div className="mt-6 pt-6 border-t border-white/20">
//                 <button
//                   onClick={handleLogout}
//                   disabled={isLoggingOut}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoggingOut ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       <span className="text-sm">Logging out...</span>
//                     </>
//                   ) : (
//                     <>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                         />
//                       </svg>
//                       <span className="text-sm">Logout</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Main Form Content */}
//             <div className="flex-1 p-6 md:p-10">
//               {isFormLocked && (
//                 <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
//                   <p className="font-semibold">
//                     ✓ Application Submitted Successfully
//                   </p>
//                   <p className="text-sm">
//                     Viewing mode - You can view your submitted application but
//                     cannot edit it.
//                   </p>
//                 </div>
//               )}

//               <form onSubmit={(e) => e.preventDefault()}>
//                 {/* Tab 0: Program & Personal */}
//                 {activeTab === 0 && (
//                   <ProgramPersonalTab
//                     form={form}
//                     programs={programs}
//                     degrees={degrees}
//                     courses={courses}
//                     examCenters={examCenters}
//                     isFormLocked={isFormLocked}
//                     handleChange={handleChange}
//                   />
//                 )}

//                 {/* Tab 1: Contact & Family */}
//                 {activeTab === 1 && (
//                   <ContactFamilyTab
//                     form={form}
//                     isFormLocked={isFormLocked}
//                     handleChange={handleChange}
//                   />
//                 )}

//                 {/* Tab 2: Academic Records */}
//                 {activeTab === 2 && (
//                   <AcademicRecordsTab
//                     form={form}
//                     programLevelId={form.program_level_id}
//                     isFormLocked={isFormLocked}
//                     twelfthSubjects={twelfthSubjects}
//                     handleChange={handleChange}
//                     handleSubjectChange={handleSubjectChange}
//                     addSubject={addSubject}
//                     removeSubject={removeSubject}
//                   />
//                 )}

//                 {/* Tab 3: Payment/Download */}
//                 {activeTab === 3 && (
//                   <PaymentTab
//                     isFormLocked={isFormLocked}
//                     isSubmitting={isSubmitting}
//                     handlePayment={handlePayment}
//                     handleViewApplication={handleViewApplication}
//                   />
//                 )}

//                 {/* Navigation Buttons */}
//                 {activeTab < tabs.length - 1 && (
//                   <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//                     <button
//                       type="button"
//                       onClick={prevTab}
//                       disabled={activeTab === 0}
//                       className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       ← Previous
//                     </button>
//                     <button
//                       type="button"
//                       onClick={nextTab}
//                       disabled={isSubmitting || isFormLocked}
//                       className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                           Saving...
//                         </>
//                       ) : (
//                         <>Next →</>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default function AdmissionFormPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       }
//     >
//       <AdmissionFormContent />
//     </Suspense>
//   );
// }












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
    second_preference_course_id: "",
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
    annual_family_income: "",
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
        name: "Download Application",
        id: "download",
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

  // Save active tab whenever it changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        activeTab.toString()
      );
    }
  }, [activeTab, userEmail]);

  // Load active tab on mount
  useEffect(() => {
    if (userEmail) {
      const savedTab = localStorage.getItem(
        `admission_active_tab_${userEmail}`
      );
      if (savedTab !== null) {
        setActiveTab(parseInt(savedTab, 10));
      }
    }
  }, [userEmail]);

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
      "Are you sure you want to logout? Any unsaved changes will be lost."
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
        // Clear any local storage
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

  const fetchCourses = async (degreeId: string) => {
    try {
      const response = await fetch(`/api/courses?degree_id=${degreeId}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      toast.error("Failed to load courses");
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

  // Load existing form data
  const loadFormData = async () => {
    if (!userEmail) return;

    try {
      console.log("Starting to load form data...");
      const data = await loadCompleteForm();

      if (data) {
        console.log("Form data received:", {
          hasBasicInfo: !!data.basicInfo,
          hasPersonalInfo: !!data.personalInfo,
        });

        // Populate form fields
        const sanitizedData: any = {};
        Object.keys(form).forEach((key) => {
          const value = (data as any)[key];
          sanitizedData[key] =
            value === null || value === undefined ? "" : String(value);
        });

        setForm(sanitizedData);
        setPaymentStatus(data.payment_status || "");
        setAdmissionId((data as any).id);

        // Load academic marks
        if (data.academicMarks && Array.isArray(data.academicMarks)) {
          data.academicMarks.forEach((mark: any) => {
            if (mark.qualification_level === "12th" && mark.subjects) {
              setTwelfthSubjects(
                mark.subjects.length > 0
                  ? mark.subjects
                  : [
                      {
                        subject_name: "",
                        marks_obtained: undefined,
                        max_marks: undefined,
                      },
                    ]
              );
            }
          });
        }

        checkCompletedTabs(sanitizedData);
        console.log("Form data loaded and populated successfully");
      } else {
        console.log("No existing form data - user can start fresh");
      }
    } catch (error) {
      console.error("Error loading form:", error);
      // Don't show error to user for initial load - they might be a new user
    } finally {
      setIsLoading(false);
    }
  };

  // Check which tabs are completed
  const checkCompletedTabs = (formData: any) => {
    const completed: number[] = [];
    const currentTabs = getTabsForProgramLevel();

    currentTabs.forEach((tab, index) => {
      if (index < currentTabs.length - 1 && tab.fields.length > 0) {
        const allFieldsFilled = tab.fields.every(
          (field) => formData[field] && formData[field].toString().trim() !== ""
        );
        if (allFieldsFilled) {
          completed.push(index);
        }
      }
    });

    setCompletedTabs(completed);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (paymentStatus === "completed") {
      toast.error("Form is locked. Cannot make changes.");
      return;
    }

    setForm((prev: any) => ({ ...prev, [name]: value }));

    // Reset dependent fields
    if (name === "program_level_id") {
      setForm((prev: any) => ({
        ...prev,
        program_level_id: value,
        degree_id: "",
        course_id: "",
        second_preference_course_id: "",
        third_preference_course_id: "",
      }));
      setDegrees([]);
      setCourses([]);
    }

    if (name === "degree_id") {
      setForm((prev: any) => ({
        ...prev,
        degree_id: value,
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
    value: any
  ) => {
    const updated = [...twelfthSubjects];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate percentage
    if (field === "marks_obtained" || field === "max_marks") {
      const marks =
        field === "marks_obtained"
          ? parseFloat(value)
          : updated[index].marks_obtained;
      const maxMarks =
        field === "max_marks" ? parseFloat(value) : updated[index].max_marks;

      if (marks && maxMarks && maxMarks > 0) {
        updated[index].percentage = parseFloat(
          ((marks / maxMarks) * 100).toFixed(2)
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
      (field) => !form[field] || form[field].toString().trim() === ""
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
    }

    if (tabIndex === 2) {
      // Academic validation
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

      // Validate at least one subject for 12th
      const validSubjects = twelfthSubjects.filter(
        (s) => s.subject_name && s.marks_obtained && s.max_marks
      );
      if (validSubjects.length === 0) {
        toast.error("Please add at least one subject for 12th standard");
        return false;
      }

      // Validate UG for PG and PhD
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

      // Validate PG for PhD
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

  // Build academic marks array from form data
  const buildAcademicMarks = (): AcademicMark[] => {
    const academicMarks: AcademicMark[] = [];

    // 10th standard
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

    // 12th standard with subjects
    if (form.twelfth_board) {
      const validSubjects = twelfthSubjects.filter(
        (s) => s.subject_name && s.marks_obtained && s.max_marks
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

    // UG
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

    // PG
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

  // Navigation - FIXED VERSION
  const nextTab = async () => {
    // Validate current tab
    if (!validateTab(activeTab)) return;

    setIsSubmitting(true);

    try {
      // Save the form
      const saved = await saveForm();

      if (!saved) {
        toast.error("Please fix the errors before continuing");
        setIsSubmitting(false);
        return;
      }

      // Mark current tab as completed
      if (!completedTabs.includes(activeTab)) {
        setCompletedTabs([...completedTabs, activeTab]);
      }

      // Move to next tab - THIS IS THE KEY FIX
      if (activeTab < tabs.length - 1) {
        const newTab = activeTab + 1;
        setActiveTab(newTab);
        localStorage.setItem(
          `admission_active_tab_${userEmail}`,
          newTab.toString()
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
        newTab.toString()
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabClick = (index: number) => {
    if (paymentStatus === "completed") {
      setActiveTab(index);
      localStorage.setItem(
        `admission_active_tab_${userEmail}`,
        index.toString()
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
        index.toString()
      );
    } else {
      toast.error("Please complete previous sections first");
    }
  };

  // Replace handlePayment function
  const handlePayment = async () => {
    // Validate that all previous tabs are complete
    if (
      !completedTabs.includes(0) ||
      !completedTabs.includes(1) ||
      !completedTabs.includes(2)
    ) {
      toast.error("Please complete all sections before payment");
      return;
    }

    // Show Easebuzz checkout
    setShowEasebuzzCheckout(true);
  };

  const handleViewApplication = () => {
    router.push(`/application-preview?email=${userEmail}`);
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
              {isFormLocked && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                  <p className="font-semibold">
                    ✓ Application Submitted Successfully
                  </p>
                  <p className="text-sm">
                    Viewing mode - You can view your submitted application but
                    cannot edit it.
                  </p>
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                {/* Tab 0: Program & Personal */}
                {activeTab === 0 && (
                  <ProgramPersonalTab
                    form={form}
                    programs={programs}
                    degrees={degrees}
                    courses={courses}
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

                {activeTab === 3 && (
                  <PaymentTab
                    isFormLocked={isFormLocked}
                    isSubmitting={isSubmitting}
                    handlePayment={handlePayment}
                    handleViewApplication={handleViewApplication}
                    userName={form.full_name}
                    userPhone={form.mobile}
                  />
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
              amount={1}
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
