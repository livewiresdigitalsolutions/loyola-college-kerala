"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Script from "next/script";

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
}

interface FormData {
  program_level_id: string;
  degree_id: string;
  course_id: string;
  exam_center_id: string;
  full_name: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  aadhaar: string;
  father_name: string;
  mother_name: string;
  parent_mobile: string;
  parent_email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  nationality: string;
  religion: string;
  category: string;
  blood_group: string;
  tenth_board: string;
  tenth_school: string;
  tenth_year: string;
  tenth_percentage: string;
  tenth_subjects: string;
  twelfth_board: string;
  twelfth_school: string;
  twelfth_year: string;
  twelfth_percentage: string;
  twelfth_stream: string;
  twelfth_subjects: string;
  ug_university: string;
  ug_college: string;
  ug_degree: string;
  ug_year: string;
  ug_percentage: string;
  pg_university: string;
  pg_college: string;
  pg_degree: string;
  pg_year: string;
  pg_percentage: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_mobile: string;
  previous_gap: string;
  extracurricular: string;
  achievements: string;
}

interface ExtendedFormData extends FormData {
  payment_status?: string;
  id?: number;
}

interface Tab {
  name: string;
  id: string;
  fields: (keyof FormData)[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function AdmissionFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [programs, setPrograms] = useState<Program[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  const [selectedProgramLevel, setSelectedProgramLevel] = useState<string>("");

  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [applicationData, setApplicationData] = useState<ExtendedFormData | null>(null);

  const [form, setForm] = useState<FormData>({
    program_level_id: "",
    degree_id: "",
    course_id: "",
    exam_center_id: "",
    full_name: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    aadhaar: "",
    father_name: "",
    mother_name: "",
    parent_mobile: "",
    parent_email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    nationality: "",
    religion: "",
    category: "",
    blood_group: "",
    tenth_board: "",
    tenth_school: "",
    tenth_year: "",
    tenth_percentage: "",
    tenth_subjects: "",
    twelfth_board: "",
    twelfth_school: "",
    twelfth_year: "",
    twelfth_percentage: "",
    twelfth_stream: "",
    twelfth_subjects: "",
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
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_mobile: "",
    previous_gap: "",
    extracurricular: "",
    achievements: "",
  });

  // Validation functions
  const validateName = (value: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(value);
  };

  const validateMobile = (value: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(value);
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validateAadhaar = (value: string): boolean => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(value);
  };

  const validatePincode = (value: string): boolean => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(value);
  };

  const validateYear = (value: string): boolean => {
    const yearRegex = /^[0-9]{4}$/;
    if (!yearRegex.test(value)) return false;
    const year = parseInt(value);
    return year >= 1950 && year <= new Date().getFullYear();
  };

  const validatePercentage = (value: string): boolean => {
    const percentageRegex = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
    if (!percentageRegex.test(value)) return false;
    const num = parseFloat(value);
    return num >= 0 && num <= 100;
  };

  const validateTextOnly = (value: string): boolean => {
    const textRegex = /^[a-zA-Z\s,.\-()]+$/;
    return textRegex.test(value);
  };

  const generateApplicationId = (
    programLevelId: number,
    degreeId: number,
    courseId: number,
    id: number
  ) => {
    return `${programLevelId}${degreeId}${courseId}${id}`;
  };

  const handleDownloadDocument = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const applicationId = generateApplicationId(
          parseInt(applicationData!.program_level_id),
          parseInt(applicationData!.degree_id),
          parseInt(applicationData!.course_id),
          applicationData!.id!
        );
        a.download = `Application-${applicationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Application PDF downloaded successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getTabsForProgramLevel = (): Tab[] => {
    const baseAcademicFields: (keyof FormData)[] = [
      "tenth_board",
      "tenth_school",
      "tenth_year",
      "tenth_percentage",
      "tenth_subjects",
      "twelfth_board",
      "twelfth_school",
      "twelfth_year",
      "twelfth_percentage",
      "twelfth_stream",
      "twelfth_subjects",
    ];

    let academicFields = [...baseAcademicFields];

    if (form.program_level_id === "2" || form.program_level_id === "3") {
      academicFields.push(
        "ug_university",
        "ug_college",
        "ug_degree",
        "ug_year",
        "ug_percentage"
      );
    }

    if (form.program_level_id === "3") {
      academicFields.push(
        "pg_university",
        "pg_college",
        "pg_degree",
        "pg_year",
        "pg_percentage"
      );
    }

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
          "aadhaar",
        ],
      },
      {
        name: "Contact & Parents",
        id: "contact",
        fields: [
          "mobile",
          "email",
          "address",
          "city",
          "state",
          "pincode",
          "father_name",
          "mother_name",
          "parent_mobile",
          "emergency_contact_name",
          "emergency_contact_relation",
          "emergency_contact_mobile",
        ],
      },
      {
        name: "Academic Records",
        id: "academic",
        fields: academicFields,
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

  useEffect(() => {
    if (form.program_level_id) {
      fetchDegrees(form.program_level_id);
    }
  }, [form.program_level_id]);

  useEffect(() => {
    if (form.degree_id) {
      fetchCourses(form.degree_id);
    }
  }, [form.degree_id]);

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

  const loadFormData = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch(`/api/admission-form?email=${userEmail}`);
      const result = await response.json();

      if (result.data) {
        const sanitizedData: Partial<ExtendedFormData> = {};
        Object.keys(form).forEach((key) => {
          const value = result.data[key];
          sanitizedData[key as keyof FormData] =
            value === null ? "" : String(value);
        });

        const status = result.data.payment_status || "";
        setPaymentStatus(status);

        const fullData = {
          ...sanitizedData,
          payment_status: status,
          id: result.data.id,
        } as ExtendedFormData;

        setApplicationData(fullData);
        setForm(sanitizedData as FormData);

        if (sanitizedData.program_level_id) {
          const program = programs.find(
            (p) => p.id === parseInt(sanitizedData.program_level_id as string)
          );
          if (program) {
            setSelectedProgramLevel(program.discipline);
          }
        }

        checkCompletedTabs(sanitizedData as FormData);

        const savedTab = localStorage.getItem(`admission_active_tab_${userEmail}`);
        if (savedTab && !isNaN(parseInt(savedTab))) {
          const tabIndex = parseInt(savedTab);
          if (tabIndex < getTabsForProgramLevel().length) {
            setActiveTab(tabIndex);
          }
        } else {
          const firstIncompleteTab = findFirstIncompleteTab(sanitizedData as FormData);
          setActiveTab(firstIncompleteTab);
        }
      }
    } catch (error) {
      console.error("Error loading form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const findFirstIncompleteTab = (formData: FormData): number => {
    const currentTabs = getTabsForProgramLevel();

    for (let i = 0; i < currentTabs.length - 1; i++) {
      const tab = currentTabs[i];
      const allFieldsFilled = tab.fields.every(
        (field) => formData[field] && formData[field].toString().trim() !== ""
      );
      if (!allFieldsFilled) {
        return i;
      }
    }

    return currentTabs.length - 1;
  };

  const checkCompletedTabs = (formData: FormData) => {
    const completed: number[] = [];
    const currentTabs = getTabsForProgramLevel();

    currentTabs.forEach((tab, index) => {
      if (index < currentTabs.length - 1) {
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

    let isValid = true;
    let errorMessage = "";

    switch (name) {
      case "full_name":
      case "father_name":
      case "mother_name":
      case "emergency_contact_name":
        if (value && !validateName(value)) {
          isValid = false;
          errorMessage = "Only letters and spaces allowed";
        }
        break;

      case "mobile":
      case "parent_mobile":
      case "emergency_contact_mobile":
        if (value && !/^[0-9]{0,10}$/.test(value)) {
          isValid = false;
          errorMessage = "Only numbers allowed (max 10 digits)";
        }
        break;

      case "aadhaar":
        if (value && !/^[0-9]{0,12}$/.test(value)) {
          isValid = false;
          errorMessage = "Only numbers allowed (max 12 digits)";
        }
        break;

      case "pincode":
        if (value && !/^[0-9]{0,6}$/.test(value)) {
          isValid = false;
          errorMessage = "Only numbers allowed (max 6 digits)";
        }
        break;

      case "tenth_year":
      case "twelfth_year":
      case "ug_year":
      case "pg_year":
        if (value && !/^[0-9]{0,4}$/.test(value)) {
          isValid = false;
          errorMessage = "Only numbers allowed (4 digits)";
        }
        break;

      case "tenth_percentage":
      case "twelfth_percentage":
      case "ug_percentage":
      case "pg_percentage":
        if (value && !/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
          isValid = false;
          errorMessage = "Enter valid percentage (0-100)";
        }
        break;

      case "city":
      case "state":
      case "nationality":
      case "religion":
      case "emergency_contact_relation":
        if (value && !validateTextOnly(value)) {
          isValid = false;
          errorMessage = "Only letters and basic punctuation allowed";
        }
        break;
    }

    if (!isValid) {
      toast.error(errorMessage);
      return;
    }

    setForm({ ...form, [name]: value });

    if (name === "program_level_id") {
      const selectedProgram = programs.find((p) => p.id === parseInt(value));
      if (selectedProgram) {
        setSelectedProgramLevel(selectedProgram.discipline);
      }

      setForm((prev) => ({
        ...prev,
        program_level_id: value,
        degree_id: "",
        course_id: "",
      }));
      setDegrees([]);
      setCourses([]);
    }

    if (name === "degree_id") {
      setForm((prev) => ({
        ...prev,
        degree_id: value,
        course_id: "",
      }));
      setCourses([]);
    }
  };

  const validateTab = (tabIndex: number): boolean => {
    const tab = tabs[tabIndex];
    const emptyFields = tab.fields.filter(
      (field) => !form[field] || form[field].toString().trim() === ""
    );

    if (emptyFields.length > 0) {
      toast.error(`Please fill all required fields in ${tab.name}`);
      return false;
    }

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
      if (!validatePincode(form.pincode)) {
        toast.error("Pincode must be exactly 6 digits");
        return false;
      }
      if (!validateName(form.father_name) || !validateName(form.mother_name)) {
        toast.error("Invalid parent name format");
        return false;
      }
      if (!validateMobile(form.parent_mobile)) {
        toast.error("Parent mobile must be exactly 10 digits");
        return false;
      }
      if (!validateMobile(form.emergency_contact_mobile)) {
        toast.error("Emergency contact mobile must be exactly 10 digits");
        return false;
      }
    }

    if (tabIndex === 2) {
      if (!validateYear(form.tenth_year)) {
        toast.error("Invalid 10th passing year");
        return false;
      }
      if (!validatePercentage(form.tenth_percentage)) {
        toast.error("Invalid 10th percentage");
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

      if (form.program_level_id === "2" || form.program_level_id === "3") {
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

  const saveForm = async (status: string = "draft") => {
    if (!userEmail) {
      toast.error("User email not found");
      return false;
    }

    try {
      const response = await fetch("/api/admission-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          formData: {
            ...form,
            form_status: status,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return true;
      } else {
        console.error("Save failed:", result);
        toast.error(result.error || result.details || "Failed to save form");
        return false;
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Network error while saving form");
      return false;
    }
  };

  const nextTab = async () => {
    if (!validateTab(activeTab)) return;

    setIsSubmitting(true);
    const saved = await saveForm();
    setIsSubmitting(false);

    if (!saved) {
      toast.error("Please fix the errors before continuing");
      return;
    }

    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }

    if (activeTab < tabs.length - 1) {
      const newTab = activeTab + 1;
      setActiveTab(newTab);
      localStorage.setItem(`admission_active_tab_${userEmail}`, newTab.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Progress saved successfully!");
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      const newTab = activeTab - 1;
      setActiveTab(newTab);
      localStorage.setItem(`admission_active_tab_${userEmail}`, newTab.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTabClick = (index: number) => {
    if (paymentStatus === "completed") {
      setActiveTab(index);
      localStorage.setItem(`admission_active_tab_${userEmail}`, index.toString());
      return;
    }

    if (
      completedTabs.includes(index) ||
      index === 0 ||
      completedTabs.includes(index - 1)
    ) {
      setActiveTab(index);
      localStorage.setItem(`admission_active_tab_${userEmail}`, index.toString());
    } else {
      toast.error("Please complete previous sections first");
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);

    try {
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1000,
        }),
      });

      const { orderId, amount, currency } = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Loyola College",
        description: "Admission Application Fee",
        order_id: orderId,
        handler: async function (response: any) {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              email: userEmail,
              amount: amount / 100,
            }),
          });

          if (verifyResponse.ok) {
            toast.success("Application submitted successfully!");
            setTimeout(() => {
              if (userEmail) {
                router.push(
                  `/application-download?email=${encodeURIComponent(userEmail)}`
                );
              } else {
                toast.error("User email not found");
                router.push("/");
              }
            }, 1500);
          }
        },

        prefill: {
          name: form.full_name,
          email: form.email,
          contact: form.mobile,
        },
        theme: {
          color: "#342D87",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        setIsSubmitting(false);
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment initialization failed");
      setIsSubmitting(false);
    }
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
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
              <p className="text-lg md:text-xl">Academic Year 2025-26</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <div className="bg-white rounded-2xl shadow-lg -mt-10 relative z-10 flex flex-col lg:flex-row overflow-hidden">
            
            <div className="lg:w-64 bg-[#342D87] p-6">
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
                          ? "bg-white text-[#342D87] shadow-lg"
                          : completedTabs.includes(index)
                          ? "bg-[#342D87] text-white hover:bg-[#342D87]"
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
                          ? "border-[#342D87] text-[#342D87]"
                          : "border-current"
                      }
                    `}
                    >
                      {completedTabs.includes(index) || isFormLocked ? "✓" : index + 1}
                    </span>
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6 md:p-10">
              {isFormLocked && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                  <p className="font-semibold">✓ Application Submitted Successfully</p>
                  <p className="text-sm">Viewing mode - You can view your submitted application but cannot edit it.</p>
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                {activeTab === 0 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Program Selection
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Select Program Level *
                          </label>
                          <select
                            name="program_level_id"
                            value={form.program_level_id}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Level</option>
                            {programs.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.discipline}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Select Degree *
                          </label>
                          <select
                            name="degree_id"
                            value={form.degree_id}
                            onChange={handleChange}
                            disabled={!form.program_level_id || isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Degree</option>
                            {degrees.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.degree_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Select Course *
                          </label>
                          <select
                            name="course_id"
                            value={form.course_id}
                            onChange={handleChange}
                            disabled={!form.degree_id || isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Course</option>
                            {courses.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.course_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Select Exam Center *
                          </label>
                          <select
                            name="exam_center_id"
                            value={form.exam_center_id}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Exam Center</option>
                            {examCenters.map((center) => (
                              <option key={center.id} value={center.id}>
                                {center.centre_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Personal Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Full Name * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="full_name"
                            value={form.full_name}
                            placeholder="Enter your full name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Gender *
                          </label>
                          <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Blood Group
                          </label>
                          <select
                            name="blood_group"
                            value={form.blood_group}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select blood group</option>
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>O+</option>
                            <option>O-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Nationality * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="nationality"
                            value={form.nationality}
                            placeholder="e.g., Indian"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Religion <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="religion"
                            value={form.religion}
                            placeholder="Enter religion"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select category</option>
                            <option>General</option>
                            <option>OBC</option>
                            <option>SC</option>
                            <option>ST</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Aadhaar Number * <span className="text-xs text-gray-500">(12 digits)</span>
                          </label>
                          <input
                            name="aadhaar"
                            value={form.aadhaar}
                            placeholder="123456789012"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={12}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Contact Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Mobile Number * <span className="text-xs text-gray-500">(10 digits)</span>
                          </label>
                          <input
                            name="mobile"
                            value={form.mobile}
                            placeholder="9876543210"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={10}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            placeholder="your.email@example.com"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">
                            Address *
                          </label>
                          <textarea
                            name="address"
                            value={form.address}
                            placeholder="House No., Street, Locality"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            City * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="city"
                            value={form.city}
                            placeholder="City"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            State * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="state"
                            value={form.state}
                            placeholder="State"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            PIN Code * <span className="text-xs text-gray-500">(6 digits)</span>
                          </label>
                          <input
                            name="pincode"
                            value={form.pincode}
                            placeholder="600001"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Parent / Guardian Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Father\'s Name * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="father_name"
                            value={form.father_name}
                            placeholder="Father\'s full name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Mother\'s Name * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="mother_name"
                            value={form.mother_name}
                            placeholder="Mother\'s full name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Parent\'s Mobile * <span className="text-xs text-gray-500">(10 digits)</span>
                          </label>
                          <input
                            name="parent_mobile"
                            value={form.parent_mobile}
                            placeholder="9876543210"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={10}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Parent\'s Email
                          </label>
                          <input
                            type="email"
                            name="parent_email"
                            value={form.parent_email}
                            placeholder="parent@example.com"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Emergency Contact
                      </h3>

                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Contact Name * <span className="text-xs text-gray-500">(Letters only)</span>
                          </label>
                          <input
                            name="emergency_contact_name"
                            value={form.emergency_contact_name}
                            placeholder="Emergency contact name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Relationship *
                          </label>
                          <input
                            name="emergency_contact_relation"
                            value={form.emergency_contact_relation}
                            placeholder="e.g., Uncle, Aunt"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Mobile * <span className="text-xs text-gray-500">(10 digits)</span>
                          </label>
                          <input
                            name="emergency_contact_mobile"
                            value={form.emergency_contact_mobile}
                            placeholder="9876543210"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={10}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        10th Standard Details
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Board *
                          </label>
                          <input
                            name="tenth_board"
                            value={form.tenth_board}
                            placeholder="e.g., CBSE, State Board"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            School Name *
                          </label>
                          <input
                            name="tenth_school"
                            value={form.tenth_school}
                            placeholder="School name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Year of Passing * <span className="text-xs text-gray-500">(4 digits)</span>
                          </label>
                          <input
                            name="tenth_year"
                            value={form.tenth_year}
                            placeholder="2020"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Percentage / CGPA * <span className="text-xs text-gray-500">(0-100)</span>
                          </label>
                          <input
                            name="tenth_percentage"
                            value={form.tenth_percentage}
                            placeholder="85.5 or 8.5"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-black mb-2">
                            Main Subjects *
                          </label>
                          <input
                            name="tenth_subjects"
                            value={form.tenth_subjects}
                            placeholder="e.g., English, Mathematics, Science"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        12th Standard Details
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Board *
                          </label>
                          <input
                            name="twelfth_board"
                            value={form.twelfth_board}
                            placeholder="e.g., CBSE, State Board"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            School Name *
                          </label>
                          <input
                            name="twelfth_school"
                            value={form.twelfth_school}
                            placeholder="School name"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Year of Passing * <span className="text-xs text-gray-500">(4 digits)</span>
                          </label>
                          <input
                            name="twelfth_year"
                            value={form.twelfth_year}
                            placeholder="2022"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Percentage / CGPA * <span className="text-xs text-gray-500">(0-100)</span>
                          </label>
                          <input
                            name="twelfth_percentage"
                            value={form.twelfth_percentage}
                            placeholder="85.5 or 8.5"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Stream *
                          </label>
                          <select
                            name="twelfth_stream"
                            value={form.twelfth_stream}
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Select stream</option>
                            <option>Science</option>
                            <option>Commerce</option>
                            <option>Arts</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Main Subjects *
                          </label>
                          <input
                            name="twelfth_subjects"
                            value={form.twelfth_subjects}
                            placeholder="e.g., Physics, Chemistry, Maths"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {(form.program_level_id === "2" || form.program_level_id === "3") && (
                      <div>
                        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                          Undergraduate (UG) Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              University *
                            </label>
                            <input
                              name="ug_university"
                              value={form.ug_university}
                              placeholder="University name"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              College Name *
                            </label>
                            <input
                              name="ug_college"
                              value={form.ug_college}
                              placeholder="College name"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Degree *
                            </label>
                            <input
                              name="ug_degree"
                              value={form.ug_degree}
                              placeholder="e.g., B.Sc, B.Com, B.A"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Year of Passing * <span className="text-xs text-gray-500">(4 digits)</span>
                            </label>
                            <input
                              name="ug_year"
                              value={form.ug_year}
                              placeholder="2024"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              maxLength={4}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Percentage / CGPA * <span className="text-xs text-gray-500">(0-100)</span>
                            </label>
                            <input
                              name="ug_percentage"
                              value={form.ug_percentage}
                              placeholder="75.5 or 7.5"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {form.program_level_id === "3" && (
                      <div>
                        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                          Postgraduate (PG) Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              University *
                            </label>
                            <input
                              name="pg_university"
                              value={form.pg_university}
                              placeholder="University name"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              College Name *
                            </label>
                            <input
                              name="pg_college"
                              value={form.pg_college}
                              placeholder="College name"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Degree *
                            </label>
                            <input
                              name="pg_degree"
                              value={form.pg_degree}
                              placeholder="e.g., M.Sc, M.Com, M.A"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Year of Passing * <span className="text-xs text-gray-500">(4 digits)</span>
                            </label>
                            <input
                              name="pg_year"
                              value={form.pg_year}
                              placeholder="2024"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              maxLength={4}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-black mb-2">
                              Percentage / CGPA * <span className="text-xs text-gray-500">(0-100)</span>
                            </label>
                            <input
                              name="pg_percentage"
                              value={form.pg_percentage}
                              placeholder="75.5 or 7.5"
                              onChange={handleChange}
                              disabled={isFormLocked}
                              required
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
                        Additional Information
                      </h3>

                      <div className="grid md:grid-cols-1 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Gap in Education (if any)
                          </label>
                          <textarea
                            name="previous_gap"
                            value={form.previous_gap}
                            placeholder="Mention any gap years and reason"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Extracurricular Activities
                          </label>
                          <textarea
                            name="extracurricular"
                            value={form.extracurricular}
                            placeholder="Sports, cultural activities, clubs, etc."
                            onChange={handleChange}
                            disabled={isFormLocked}
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">
                            Achievements & Awards
                          </label>
                          <textarea
                            name="achievements"
                            value={form.achievements}
                            placeholder="Academic awards, competitions, certifications"
                            onChange={handleChange}
                            disabled={isFormLocked}
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-black placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    {paymentStatus === "completed" ? (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-black mb-4">
                          Application Submitted Successfully
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Your application has been processed and payment confirmed
                        </p>

                        <div className="bg-green-50 p-6 rounded-lg mb-6">
                          <svg
                            className="w-16 h-16 text-green-500 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg font-semibold text-green-700">
                            Payment Completed
                          </p>
                        </div>

                        <div className="mt-12 pt-8 border-t-2 border-gray-200">
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                              onClick={handleDownloadDocument}
                              disabled={isDownloading}
                              className="px-8 py-4 bg-[#342D87] text-white font-bold rounded-xl hover:bg-[#2a2470] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                              {isDownloading ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                  Generating Document...
                                </>
                              ) : (
                                <>
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
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-center text-sm text-gray-600 mt-6">
                            Please save this document for your records and future reference
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-black mb-4">
                          Application Fee Payment
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Complete your application by paying the admission fee
                        </p>

                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                          <p className="text-3xl font-bold text-blue-600 mb-2">
                            ₹1000
                          </p>
                          <p className="text-sm text-gray-600">
                            Application Processing Fee
                          </p>
                        </div>

                        <button
                          onClick={handlePayment}
                          disabled={isSubmitting}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                            ? "Processing..."
                            : "Pay Now with Razorpay"}
                        </button>

                        <p className="text-xs text-gray-500 mt-4">
                          Secure payment powered by Razorpay
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={prevTab}
                    disabled={activeTab === 0}
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all duration-200
                      ${
                        activeTab === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                    `}
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {tabs.map((_, index) => (
                      <div
                        key={index}
                        className={`
                          w-2 h-2 rounded-full transition-all duration-200
                          ${
                            activeTab === index
                              ? "bg-blue-600 w-8"
                              : completedTabs.includes(index) || isFormLocked
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }
                        `}
                      />
                    ))}
                  </div>

                  {activeTab < tabs.length - 1 && !isFormLocked && (
                    <button
                      type="button"
                      onClick={nextTab}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          Save & Continue
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  )}

                  {isFormLocked && activeTab < tabs.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newTab = activeTab + 1;
                        setActiveTab(newTab);
                        localStorage.setItem(`admission_active_tab_${userEmail}`, newTab.toString());
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                    >
                      Next
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                {isFormLocked 
                  ? "Application submitted. Contact support for any queries."
                  : "By submitting, you agree to our terms and conditions"
                }
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-black">
            <p className="text-sm">
              Need help? Contact:{" "}
              <span className="font-semibold text-blue-600">
                admissions@loyola.edu
              </span>{" "}
              |{" "}
              <span className="font-semibold text-blue-600">
                +91-XXXXXXXXXX
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdmissionForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    }>
      <AdmissionFormContent />
    </Suspense>
  );
}
