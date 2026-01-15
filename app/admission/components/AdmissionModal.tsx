"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAcademicYear } from "@/app/hooks/useAcademicYears";
import { X, Upload } from "lucide-react";

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

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
}

const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  showLogin,
  setShowLogin,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { academicYear, loading: yearLoading } = useAcademicYear();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // PERSONAL DETAILS
  const [personalData, setPersonalData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    religion: "",
    seatReservation: "",
    communityCategory: "",
    caste: "",
    country: "INDIA",
    state: "",
    townVillage: "",
    motherTongue: "",
    bloodGroup: "",
    nativity: "",
    aadharNumber: "",
    email: "",
    mobileNo: "",
    photo: null as File | null,
    signature: null as File | null,
  });

  // ADDRESS DETAILS
  const [addressData, setAddressData] = useState({
    commAddressLine1: "",
    commAddressLine2: "",
    commPIN: "",
    commCountry: "INDIA",
    commState: "",
    commDistrict: "",
    sameAsAbove: false,
    permAddressLine1: "",
    permAddressLine2: "",
    permPIN: "",
    permCountry: "INDIA",
    permState: "",
    permDistrict: "",
  });

  // FAMILY DETAILS
  const [familyData, setFamilyData] = useState({
    fatherName: "",
    fatherMobile: "",
    fatherOccupation: "",
    fatherEducation: "",
    motherName: "",
    motherMobile: "",
    motherEducation: "",
    motherOccupation: "",
    annualIncome: "",
    guardianName: "",
    guardianAddress: "",
    guardianMobile: "",
  });

  // OTHER DETAILS
  const [otherData, setOtherData] = useState({
    differentlyAbled: "No",
    disabilityNature: "",
    disabilityPercentage: "",
    sonDaughterOf: "No",
    admissionQuota: "",
    scholarship: "No",
    hostelRequired: "No",
  });

  // EDUCATION - SSLC
  const [sslcData, setSSLCData] = useState({
    yearOfPassing: "",
    percentage: "",
    registerNo: "",
  });

  // EDUCATION - HSE/HSC
  const [hscData, setHSCData] = useState({
    schoolName: "",
    registerNo: "",
    numberOfAppearances: "1",
    boardOfExam: "",
    streamOfStudies: "",
  });

  // MARKS ENTRY (10 subjects)
  const [marksData, setMarksData] = useState(
    Array(10).fill(null).map((_, idx) => ({
      subject: "",
      maxMarks: "",
      obtainedMarks: "",
    }))
  );

  // PROGRAM CHOICES
  const [programChoices, setProgramChoices] = useState({
    firstChoice: "",
    secondChoice: "",
    thirdChoice: "",
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
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
    }
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

  // Auto-fill permanent address
  useEffect(() => {
    if (addressData.sameAsAbove) {
      setAddressData(prev => ({
        ...prev,
        permAddressLine1: prev.commAddressLine1,
        permAddressLine2: prev.commAddressLine2,
        permPIN: prev.commPIN,
        permCountry: prev.commCountry,
        permState: prev.commState,
        permDistrict: prev.commDistrict,
      }));
    }
  }, [addressData.sameAsAbove, addressData.commAddressLine1, addressData.commAddressLine2, addressData.commPIN, addressData.commState, addressData.commDistrict]);

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

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setAddressData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFamilyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOtherData(prev => ({ ...prev, [name]: value }));
  };

  const handleSSLCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSSLCData(prev => ({ ...prev, [name]: value }));
  };

  const handleHSCChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHSCData(prev => ({ ...prev, [name]: value }));
  };

  const handleMarksChange = (index: number, field: string, value: string) => {
    setMarksData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProgramChoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProgramChoices(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    setPersonalData(prev => ({ ...prev, [field]: file }));
  };

  const calculateTotalMarks = () => {
    const total = marksData.reduce((sum, mark) => {
      return sum + (parseInt(mark.obtainedMarks) || 0);
    }, 0);
    const maxTotal = marksData.reduce((sum, mark) => {
      return sum + (parseInt(mark.maxMarks) || 0);
    }, 0);
    return { total, maxTotal, percentage: maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : 0 };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!personalData.name || !personalData.email || !personalData.mobileNo) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!selectedProgram || !selectedDegree || !selectedCourse) {
      toast.error("Please select Program, Degree, and Course");
      setIsSubmitting(false);
      return;
    }

    // Combine all data
    const completeData = {
      personal: personalData,
      address: addressData,
      family: familyData,
      other: otherData,
      sslc: sslcData,
      hsc: hscData,
      marks: marksData,
      programChoices,
      programId: selectedProgram,
      degreeId: selectedDegree,
      courseId: selectedCourse,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.", { duration: 5000 });
        setCurrentStep(1);
        // Reset all forms
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

        router.push(`/admission-form?email=${encodeURIComponent(loginData.email)}`);
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
        <h2 className="text-2xl font-bold text-center text-black">
          Application Form for FYUG Programmes {academicYear.start}-{parseInt(academicYear.start) + 1}
        </h2>
        <p className="text-sm text-center text-primary mb-4">
          Step {currentStep} of 3
        </p>
      </>
    );
  };

  const renderStep1 = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* PERSONAL DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Personal Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Full Name"
              value={personalData.name}
              onChange={handlePersonalChange}
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full rounded border p-3 text-sm text-black"
              value={personalData.gender}
              onChange={handlePersonalChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              className="w-full rounded border p-3 text-sm text-black"
              value={personalData.dateOfBirth}
              onChange={handlePersonalChange}
              required
            />
          </div>

          <div>
            <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">
              Religion *
            </label>
            <input
              id="religion"
              name="religion"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Religion"
              value={personalData.religion}
              onChange={handlePersonalChange}
              required
            />
          </div>

          <div>
            <label htmlFor="seatReservation" className="block text-sm font-medium text-gray-700 mb-1">
              Seat Reservation Quota
            </label>
            <select
              id="seatReservation"
              name="seatReservation"
              className="w-full rounded border p-3 text-sm text-black"
              value={personalData.seatReservation}
              onChange={handlePersonalChange}
            >
              <option value="">Select</option>
              <option value="GENERAL">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>

          <div>
            <label htmlFor="communityCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Community Category
            </label>
            <input
              id="communityCategory"
              name="communityCategory"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., OBC/OBH/SEBC"
              value={personalData.communityCategory}
              onChange={handlePersonalChange}
            />
          </div>

          <div>
            <label htmlFor="caste" className="block text-sm font-medium text-gray-700 mb-1">
              Caste
            </label>
            <input
              id="caste"
              name="caste"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Caste"
              value={personalData.caste}
              onChange={handlePersonalChange}
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              id="state"
              name="state"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter State"
              value={personalData.state}
              onChange={handlePersonalChange}
              required
            />
          </div>

          <div>
            <label htmlFor="townVillage" className="block text-sm font-medium text-gray-700 mb-1">
              Town/Village
            </label>
            <input
              id="townVillage"
              name="townVillage"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Town/Village"
              value={personalData.townVillage}
              onChange={handlePersonalChange}
            />
          </div>

          <div>
            <label htmlFor="motherTongue" className="block text-sm font-medium text-gray-700 mb-1">
              Mother Tongue
            </label>
            <input
              id="motherTongue"
              name="motherTongue"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Mother Tongue"
              value={personalData.motherTongue}
              onChange={handlePersonalChange}
            />
          </div>

          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              className="w-full rounded border p-3 text-sm text-black"
              value={personalData.bloodGroup}
              onChange={handlePersonalChange}
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label htmlFor="nativity" className="block text-sm font-medium text-gray-700 mb-1">
              Nativity
            </label>
            <select
              id="nativity"
              name="nativity"
              className="w-full rounded border p-3 text-sm text-black"
              value={personalData.nativity}
              onChange={handlePersonalChange}
            >
              <option value="">Select</option>
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Aadhar Number *
            </label>
            <input
              id="aadharNumber"
              name="aadharNumber"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter 12-digit Aadhar Number"
              value={personalData.aadharNumber}
              onChange={handlePersonalChange}
              maxLength={12}
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Email Address"
              value={personalData.email}
              onChange={handlePersonalChange}
              required
            />
          </div>

          <div>
            <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              id="mobileNo"
              name="mobileNo"
              type="tel"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter 10-digit Mobile"
              value={personalData.mobileNo}
              onChange={handlePersonalChange}
              maxLength={10}
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo *
            </label>
            <div className="relative">
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="w-full rounded border p-3 text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                onChange={(e) => handleFileChange(e, "photo")}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Signature *
            </label>
            <input
              id="signature"
              name="signature"
              type="file"
              accept="image/*"
              className="w-full rounded border p-3 text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              onChange={(e) => handleFileChange(e, "signature")}
              required
            />
          </div>
        </div>
      </div>

      {/* ADDRESS DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          Communication Address
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="commAddressLine1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              id="commAddressLine1"
              name="commAddressLine1"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="House No, Building Name"
              value={addressData.commAddressLine1}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="commAddressLine2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              id="commAddressLine2"
              name="commAddressLine2"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Street, Locality"
              value={addressData.commAddressLine2}
              onChange={handleAddressChange}
            />
          </div>

          <div>
            <label htmlFor="commPIN" className="block text-sm font-medium text-gray-700 mb-1">
              PIN Code *
            </label>
            <input
              id="commPIN"
              name="commPIN"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter PIN"
              value={addressData.commPIN}
              onChange={handleAddressChange}
              maxLength={6}
              required
            />
          </div>

          <div>
            <label htmlFor="commState" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              id="commState"
              name="commState"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter State"
              value={addressData.commState}
              onChange={handleAddressChange}
              required
            />
          </div>

          <div>
            <label htmlFor="commDistrict" className="block text-sm font-medium text-gray-700 mb-1">
              District *
            </label>
            <input
              id="commDistrict"
              name="commDistrict"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter District"
              value={addressData.commDistrict}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            id="sameAsAbove"
            name="sameAsAbove"
            type="checkbox"
            checked={addressData.sameAsAbove}
            onChange={handleAddressChange}
            className="rounded"
          />
          <label htmlFor="sameAsAbove" className="text-sm font-medium text-gray-700">
            Permanent Address same as Communication Address
          </label>
        </div>

        {!addressData.sameAsAbove && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4 flex items-center gap-2">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Permanent Address
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="permAddressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  id="permAddressLine1"
                  name="permAddressLine1"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="House No, Building Name"
                  value={addressData.permAddressLine1}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="permAddressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  id="permAddressLine2"
                  name="permAddressLine2"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Street, Locality"
                  value={addressData.permAddressLine2}
                  onChange={handleAddressChange}
                />
              </div>

              <div>
                <label htmlFor="permPIN" className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code *
                </label>
                <input
                  id="permPIN"
                  name="permPIN"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Enter PIN"
                  value={addressData.permPIN}
                  onChange={handleAddressChange}
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="permState" className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  id="permState"
                  name="permState"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Enter State"
                  value={addressData.permState}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="permDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  id="permDistrict"
                  name="permDistrict"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Enter District"
                  value={addressData.permDistrict}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* FAMILY DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
          Family Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
              Father's Name *
            </label>
            <input
              id="fatherName"
              name="fatherName"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Father's Name"
              value={familyData.fatherName}
              onChange={handleFamilyChange}
              required
            />
          </div>

          <div>
            <label htmlFor="fatherMobile" className="block text-sm font-medium text-gray-700 mb-1">
              Father's Mobile
            </label>
            <input
              id="fatherMobile"
              name="fatherMobile"
              type="tel"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Mobile"
              value={familyData.fatherMobile}
              onChange={handleFamilyChange}
              maxLength={10}
            />
          </div>

          <div>
            <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
              Father's Occupation
            </label>
            <input
              id="fatherOccupation"
              name="fatherOccupation"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Occupation"
              value={familyData.fatherOccupation}
              onChange={handleFamilyChange}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="fatherEducation" className="block text-sm font-medium text-gray-700 mb-1">
              Father's Education *
            </label>
            <select
              id="fatherEducation"
              name="fatherEducation"
              className="w-full rounded border p-3 text-sm text-black"
              value={familyData.fatherEducation}
              onChange={handleFamilyChange}
              required
            >
              <option value="">Select</option>
              <option value="NO FORMAL EDUCATION">No Formal Education</option>
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
              <option value="HIGHER SECONDARY">Higher Secondary</option>
              <option value="GRADUATION">Graduation</option>
              <option value="POSTGRADUATION">Post Graduation</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Name *
            </label>
            <input
              id="motherName"
              name="motherName"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Mother's Name"
              value={familyData.motherName}
              onChange={handleFamilyChange}
              required
            />
          </div>

          <div>
            <label htmlFor="motherMobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Mobile
            </label>
            <input
              id="motherMobile"
              name="motherMobile"
              type="tel"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Mobile"
              value={familyData.motherMobile}
              onChange={handleFamilyChange}
              maxLength={10}
            />
          </div>

          <div>
            <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Occupation
            </label>
            <input
              id="motherOccupation"
              name="motherOccupation"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Occupation"
              value={familyData.motherOccupation}
              onChange={handleFamilyChange}
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="motherEducation" className="block text-sm font-medium text-gray-700 mb-1">
              Mother's Education *
            </label>
            <select
              id="motherEducation"
              name="motherEducation"
              className="w-full rounded border p-3 text-sm text-black"
              value={familyData.motherEducation}
              onChange={handleFamilyChange}
              required
            >
              <option value="">Select</option>
              <option value="NO FORMAL EDUCATION">No Formal Education</option>
              <option value="PRIMARY">Primary</option>
              <option value="SECONDARY">Secondary</option>
              <option value="HIGHER SECONDARY">Higher Secondary</option>
              <option value="GRADUATION">Graduation</option>
              <option value="POSTGRADUATION">Post Graduation</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Family Income (₹) *
            </label>
            <input
              id="annualIncome"
              name="annualIncome"
              type="number"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Annual Income"
              value={familyData.annualIncome}
              onChange={handleFamilyChange}
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Name (if any)
            </label>
            <input
              id="guardianName"
              name="guardianName"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Guardian Name"
              value={familyData.guardianName}
              onChange={handleFamilyChange}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <label htmlFor="guardianAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Address (if any)
            </label>
            <input
              id="guardianAddress"
              name="guardianAddress"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Guardian Address"
              value={familyData.guardianAddress}
              onChange={handleFamilyChange}
            />
          </div>

          <div>
            <label htmlFor="guardianMobile" className="block text-sm font-medium text-gray-700 mb-1">
              Guardian Mobile
            </label>
            <input
              id="guardianMobile"
              name="guardianMobile"
              type="tel"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Mobile"
              value={familyData.guardianMobile}
              onChange={handleFamilyChange}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      {/* OTHER DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
          Additional Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="differentlyAbled" className="block text-sm font-medium text-gray-700 mb-1">
              Differently Abled?
            </label>
            <select
              id="differentlyAbled"
              name="differentlyAbled"
              className="w-full rounded border p-3 text-sm text-black"
              value={otherData.differentlyAbled}
              onChange={handleOtherChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {otherData.differentlyAbled === "Yes" && (
            <>
              <div>
                <label htmlFor="disabilityNature" className="block text-sm font-medium text-gray-700 mb-1">
                  Nature of Disability
                </label>
                <input
                  id="disabilityNature"
                  name="disabilityNature"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Specify Disability"
                  value={otherData.disabilityNature}
                  onChange={handleOtherChange}
                />
              </div>

              <div>
                <label htmlFor="disabilityPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Disability Percentage
                </label>
                <input
                  id="disabilityPercentage"
                  name="disabilityPercentage"
                  type="number"
                  className="w-full rounded border p-3 text-sm text-black"
                  placeholder="Enter %"
                  value={otherData.disabilityPercentage}
                  onChange={handleOtherChange}
                  max={100}
                />
              </div>
            </>
          )}

          <div>
            <label htmlFor="admissionQuota" className="block text-sm font-medium text-gray-700 mb-1">
              Admission Quota
            </label>
            <select
              id="admissionQuota"
              name="admissionQuota"
              className="w-full rounded border p-3 text-sm text-black"
              value={otherData.admissionQuota}
              onChange={handleOtherChange}
            >
              <option value="">Select</option>
              <option value="GENERAL">General</option>
              <option value="MANAGEMENT">Management Quota</option>
              <option value="NRI">NRI Quota</option>
              <option value="SPORTS">Sports Quota</option>
            </select>
          </div>

          <div>
            <label htmlFor="scholarship" className="block text-sm font-medium text-gray-700 mb-1">
              Scholarship/Fee Concession Received?
            </label>
            <select
              id="scholarship"
              name="scholarship"
              className="w-full rounded border p-3 text-sm text-black"
              value={otherData.scholarship}
              onChange={handleOtherChange}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div>
            <label htmlFor="hostelRequired" className="block text-sm font-medium text-gray-700 mb-1">
              Hostel Required? *
            </label>
            <select
              id="hostelRequired"
              name="hostelRequired"
              className="w-full rounded border p-3 text-sm text-black"
              value={otherData.hostelRequired}
              onChange={handleOtherChange}
              required
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Next: Education Details →
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* SSLC DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          SSLC (10th Standard) Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sslc-year" className="block text-sm font-medium text-gray-700 mb-1">
              Year of Passing *
            </label>
            <input
              id="sslc-year"
              name="yearOfPassing"
              type="number"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., 2023"
              value={sslcData.yearOfPassing}
              onChange={handleSSLCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="sslc-percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Percentage *
            </label>
            <input
              id="sslc-percentage"
              name="percentage"
              type="number"
              step="0.01"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., 89.5"
              value={sslcData.percentage}
              onChange={handleSSLCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="sslc-regno" className="block text-sm font-medium text-gray-700 mb-1">
              Register Number *
            </label>
            <input
              id="sslc-regno"
              name="registerNo"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Register No"
              value={sslcData.registerNo}
              onChange={handleSSLCChange}
              required
            />
          </div>
        </div>
      </div>

      {/* HSE/HSC DETAILS */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
          HSE/HSC (+2) Details
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          If you don't have +2 marks yet, enter your +1 marks and proceed
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
              Name of School *
            </label>
            <input
              id="schoolName"
              name="schoolName"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter School Name"
              value={hscData.schoolName}
              onChange={handleHSCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="hsc-regno" className="block text-sm font-medium text-gray-700 mb-1">
              Register Number *
            </label>
            <input
              id="hsc-regno"
              name="registerNo"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="Enter Register No"
              value={hscData.registerNo}
              onChange={handleHSCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="numberOfAppearances" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Appearances *
            </label>
            <input
              id="numberOfAppearances"
              name="numberOfAppearances"
              type="number"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., 1"
              value={hscData.numberOfAppearances}
              onChange={handleHSCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="boardOfExam" className="block text-sm font-medium text-gray-700 mb-1">
              Board of Exam *
            </label>
            <input
              id="boardOfExam"
              name="boardOfExam"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., CBSE, HSE, ICSE"
              value={hscData.boardOfExam}
              onChange={handleHSCChange}
              required
            />
          </div>

          <div>
            <label htmlFor="streamOfStudies" className="block text-sm font-medium text-gray-700 mb-1">
              Stream of Studies *
            </label>
            <input
              id="streamOfStudies"
              name="streamOfStudies"
              className="w-full rounded border p-3 text-sm text-black"
              placeholder="e.g., Commerce, Science"
              value={hscData.streamOfStudies}
              onChange={handleHSCChange}
              required
            />
          </div>
        </div>
      </div>

      {/* MARKS ENTRY */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
          12th Standard Marks Entry
        </h3>
        <p className="text-xs text-gray-600 mb-4">
          Enter marks for all subjects studied in 12th standard
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">S.No</th>
                <th className="p-3 text-left">Subject Name</th>
                <th className="p-3 text-left">Max Marks</th>
                <th className="p-3 text-left">Obtained Marks</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((mark, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">
                    <input
                      className="w-full rounded border p-2 text-sm"
                      placeholder={idx < 5 ? "Enter Subject" : "Select/Enter (optional)"}
                      value={mark.subject}
                      onChange={(e) => handleMarksChange(idx, "subject", e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-full rounded border p-2 text-sm"
                      placeholder="100"
                      value={mark.maxMarks}
                      onChange={(e) => handleMarksChange(idx, "maxMarks", e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-full rounded border p-2 text-sm"
                      placeholder="0"
                      value={mark.obtainedMarks}
                      onChange={(e) => handleMarksChange(idx, "obtainedMarks", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-bold">
              <tr>
                <td colSpan={2} className="p-3 text-right">TOTAL</td>
                <td className="p-3">{calculateTotalMarks().maxTotal}</td>
                <td className="p-3">{calculateTotalMarks().total}</td>
              </tr>
              <tr>
                <td colSpan={3} className="p-3 text-right">OVERALL PERCENTAGE</td>
                <td className="p-3 text-primary">{calculateTotalMarks().percentage}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/10 transition-colors"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors"
        >
          Next: Program Selection →
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* PROGRAM SELECTION */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          Programme Selection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
              Program Level *
            </label>
            <select
              id="program"
              className="w-full rounded border p-3 text-sm text-black"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.discipline}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
              Degree *
            </label>
            <select
              id="degree"
              className="w-full rounded border p-3 text-sm text-black"
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              disabled={!selectedProgram}
              required
            >
              <option value="">Select Degree</option>
              {degrees.map((degree) => (
                <option key={degree.id} value={degree.id}>
                  {degree.degree_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
              Course *
            </label>
            <select
              id="course"
              className="w-full rounded border p-3 text-sm text-black"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              disabled={!selectedDegree}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="firstChoice" className="block text-sm font-medium text-gray-700 mb-1">
              Programme Applied (First Choice) *
            </label>
            <select
              id="firstChoice"
              name="firstChoice"
              className="w-full rounded border p-3 text-sm text-black"
              value={programChoices.firstChoice}
              onChange={handleProgramChoiceChange}
              required
            >
              <option value="">Select Programme</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="secondChoice" className="block text-sm font-medium text-gray-700 mb-1">
              Programme Applied (Second Choice) - Optional
            </label>
            <select
              id="secondChoice"
              name="secondChoice"
              className="w-full rounded border p-3 text-sm text-black"
              value={programChoices.secondChoice}
              onChange={handleProgramChoiceChange}
            >
              <option value="">Select Programme</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="thirdChoice" className="block text-sm font-medium text-gray-700 mb-1">
              Programme Applied (Third Choice) - Optional
            </label>
            <select
              id="thirdChoice"
              name="thirdChoice"
              className="w-full rounded border p-3 text-sm text-black"
              value={programChoices.thirdChoice}
              onChange={handleProgramChoiceChange}
            >
              <option value="">Select Programme</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DECLARATION */}
      <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Declaration</h3>
        <p className="text-sm text-gray-700 mb-4">
          I hereby declare that all the information provided in this application is true and correct to the best of my knowledge. 
          I understand that any false information may lead to cancellation of my admission.
        </p>
        <div className="flex items-start gap-2">
          <input
            id="declaration"
            type="checkbox"
            required
            className="mt-1"
          />
          <label htmlFor="declaration" className="text-sm font-medium text-gray-700">
            I agree to the above declaration *
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/10 transition-colors"
        >
          ← Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !academicYear?.isOpen}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div 
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* MODAL */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-modal-title"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex-shrink-0 border-b border-gray-200 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div id="admission-modal-title">
              {renderAcademicYearHeader()}
            </div>
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {!showLogin ? (
              <form onSubmit={handleRegister}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-center text-black mb-2">Login</h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                  Access your application portal
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="login-email"
                      className="w-full rounded border p-3 text-black"
                      placeholder="Enter Email Address"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password (Mobile Number) *
                    </label>
                    <input
                      id="login-password"
                      className="w-full rounded border p-3 text-black"
                      placeholder="Enter Mobile Number"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>

                  <p className="text-sm text-center text-gray-700">
                    NEW USER?{" "}
                    <button
                      type="button"
                      className="font-semibold text-primary hover:underline"
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
      </div>
    </>
  );
};

export default AdmissionModal;