"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface ApplicationData {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  nationality: string;
  category: string;
  communication_address: string;
  communication_city: string;
  communication_state: string;
  communication_pincode: string;
  father_name: string;
  mother_name: string;
  father_mobile: string;
  mother_mobile: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_mobile: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  payment_id: string;
  payment_amount: number;
  payment_status: string;
  submitted_at: string;
  academic_year: string;
}

interface ProgramDetails {
  program: string;
  degree: string;
  course: string;
  examCenter: string;
}

// Component that uses useSearchParams - wrapped in Suspense
function ApplicationDownloadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      toast.error("No email provided");
      router.push("/");
      return;
    }

    fetchApplicationData();
  }, [userEmail]);

  const fetchApplicationData = async () => {
    try {
      // Use the complete API endpoint
      const response = await fetch(`/api/admission-form/complete?email=${encodeURIComponent(userEmail!)}`);
      const result = await response.json();

      console.log('Application download data:', result);

      if (result.data) {
        // Check payment status
        if (result.data.payment_status !== "completed") {
          toast.error("Payment not completed");
          router.push(`/admission-form?email=${userEmail}`);
          return;
        }

        // Map the nested structure to flat structure for display
        const flattenedData: ApplicationData = {
          id: result.data.id,
          full_name: result.data.full_name || result.data.personalInfo?.full_name || '',
          email: result.data.email || result.data.personalInfo?.email || userEmail || '',
          mobile: result.data.mobile || result.data.personalInfo?.mobile || '',
          dob: result.data.dob || result.data.personalInfo?.dob || '',
          gender: result.data.gender || result.data.personalInfo?.gender || '',
          nationality: result.data.nationality || result.data.personalInfo?.nationality || '',
          category: result.data.category || result.data.personalInfo?.category || '',
          communication_address: result.data.communication_address || result.data.addressInfo?.communication_address || '',
          communication_city: result.data.communication_city || result.data.addressInfo?.communication_city || '',
          communication_state: result.data.communication_state || result.data.addressInfo?.communication_state || '',
          communication_pincode: result.data.communication_pincode || result.data.addressInfo?.communication_pincode || '',
          father_name: result.data.father_name || result.data.familyInfo?.father_name || '',
          mother_name: result.data.mother_name || result.data.familyInfo?.mother_name || '',
          father_mobile: result.data.father_mobile || result.data.familyInfo?.father_mobile || '',
          mother_mobile: result.data.mother_mobile || result.data.familyInfo?.mother_mobile || '',
          emergency_contact_name: result.data.emergency_contact_name || result.data.familyInfo?.emergency_contact_name || '',
          emergency_contact_relation: result.data.emergency_contact_relation || result.data.familyInfo?.emergency_contact_relation || '',
          emergency_contact_mobile: result.data.emergency_contact_mobile || result.data.familyInfo?.emergency_contact_mobile || '',
          program_level_id: result.data.program_level_id || result.data.basicInfo?.program_level_id || 0,
          degree_id: result.data.degree_id || result.data.basicInfo?.degree_id || 0,
          course_id: result.data.course_id || result.data.basicInfo?.course_id || 0,
          exam_center_id: result.data.exam_center_id || result.data.basicInfo?.exam_center_id || 0,
          payment_id: result.data.payment_id || '',
          payment_amount: result.data.payment_amount || 1000,
          payment_status: result.data.payment_status || 'completed',
          submitted_at: result.data.submitted_at || result.data.updated_at || '',
          academic_year: result.data.academic_year || '2026',
        };

        setApplicationData(flattenedData);

        await fetchProgramDetails(
          flattenedData.program_level_id,
          flattenedData.degree_id,
          flattenedData.course_id,
          flattenedData.exam_center_id
        );
      } else {
        toast.error("Application not found");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Failed to load application");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProgramDetails = async (
    programId: number,
    degreeId: number,
    courseId: number,
    examCenterId: number
  ) => {
    try {
      const [programRes, degreeRes, courseRes, examCenterRes] = await Promise.all([
        fetch(`/api/programs`),
        fetch(`/api/degrees?program_id=${programId}`),
        fetch(`/api/courses?degree_id=${degreeId}`),
        examCenterId ? fetch(`/api/exam-centers`) : null,
      ]);

      const [programs, degrees, courses, examCenters] = await Promise.all([
        programRes.json(),
        degreeRes.json(),
        courseRes.json(),
        examCenterRes ? examCenterRes.json() : [],
      ]);

      const program = programs.find((p: any) => p.id === programId);
      const degree = degrees.find((d: any) => d.id === degreeId);
      const course = courses.find((c: any) => c.id === courseId);
      const examCenter = examCenterId
        ? examCenters.find((e: any) => e.id === examCenterId)
        : null;

      setProgramDetails({
        program: program?.discipline || "N/A",
        degree: degree?.degree_name || "N/A",
        course: course?.course_name || "N/A",
        examCenter: examCenter?.centre_name || "N/A",
      });
    } catch (error) {
      console.error("Error fetching program details:", error);
    }
  };

  const generateApplicationId = (
    programLevelId: number,
    degreeId: number,
    courseId: number,
    dbId: number
  ): string => {
    const paddedId = String(dbId).padStart(2, "0");
    const paddedCourseId = String(courseId).padStart(2, "0");
    return `LC${programLevelId}${degreeId}${paddedCourseId}2026${paddedId}`;
  };

  const handleViewApplication = () => {
    router.push(`/application-preview?email=${userEmail}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-semibold">
            Loading your application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-[#342D87] py-20 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg mt-10">
          <svg
            className="w-14 h-14 text-[#342D87]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Payment Successful!
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto -mb-10">
          Your admission application has been submitted successfully and payment
          has been confirmed.
        </p>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Application Summary */}
              {applicationData && (
                <>
                  {/* Quick Info Cards */}
                  <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#342D87]/10 rounded-xl p-6 border-l-4 border-[#342D87]">
                      <p className="text-sm text-[#342D87] font-semibold mb-1">
                        Application ID
                      </p>
                      <p className="text-2xl font-bold text-black">
                        {generateApplicationId(
                          applicationData.program_level_id,
                          applicationData.degree_id,
                          applicationData.course_id,
                          applicationData.id
                        )}
                      </p>
                    </div>
                    <div className="bg-[#342D87]/10 rounded-xl p-6 border-l-4 border-[#342D87]">
                      <p className="text-sm text-[#342D87] font-semibold mb-1">
                        Payment Amount
                      </p>
                      <p className="text-2xl font-bold text-black">
                        ₹{applicationData.payment_amount}
                      </p>
                    </div>
                    <div className="bg-[#342D87]/10 rounded-xl p-6 border-l-4 border-[#342D87]">
                      <p className="text-sm text-[#342D87] font-semibold mb-1">
                        Status
                      </p>
                      <p className="text-2xl font-bold text-black capitalize">
                        {applicationData.payment_status}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-blue-200">
                        Personal Information
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Full Name
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.full_name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Date of Birth
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.dob
                              ? new Date(applicationData.dob).toLocaleDateString("en-IN")
                              : "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Gender
                          </p>
                          <p className="text-lg font-semibold text-black capitalize">
                            {applicationData.gender || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Nationality
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.nationality || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Category
                          </p>
                          <p className="text-lg font-semibold text-black uppercase">
                            {applicationData.category || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-blue-200">
                        Contact Information
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Mobile Number
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.mobile}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Email Address
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.email}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Address
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.communication_address || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            City
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.communication_city || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            State
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.communication_state || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            PIN Code
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.communication_pincode || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Parent/Emergency Contact */}
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-blue-200">
                        Parent/Emergency Contact
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Father's Name
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.father_name || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Father's Mobile
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.father_mobile || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Mother's Name
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.mother_name || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Mother's Mobile
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.mother_mobile || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Emergency Contact
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.emergency_contact_name || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Relation
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.emergency_contact_relation || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Emergency Mobile
                          </p>
                          <p className="text-lg font-semibold text-black">
                            {applicationData.emergency_contact_mobile || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Program Details */}
                    {programDetails && (
                      <div>
                        <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-blue-200">
                          Program Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Program Level
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {programDetails.program}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Degree
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {programDetails.degree}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Course
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {programDetails.course}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Exam Center
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {programDetails.examCenter}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Details */}
                    <div>
                      <h2 className="text-2xl font-bold text-black mb-6 pb-3 border-b-2 border-blue-200">
                        Payment Details
                      </h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Payment ID
                          </p>
                          <p className="text-lg font-semibold text-black font-mono">
                            {applicationData.payment_id || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 font-semibold">
                            Payment Status
                          </p>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-12 pt-8 border-t-2 border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleViewApplication}
                        className="px-8 py-4 bg-[#342D87] text-white font-bold rounded-xl hover:bg-[#2a2470] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View & Download Application
                      </button>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-6">
                      Please save this document for your records and future reference
                    </p>
                  </div>
                </>
              )}

              {/* Contact Support */}
              <div className="mt-8 text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-black mb-2">
                  <strong>Need Help?</strong> Contact our admission support team
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <a
                    href="mailto:admissions@loyola.edu"
                    className="text-[#342D87] font-semibold flex items-center gap-2 hover:underline"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    admissions@loyola.edu
                  </a>
                  <a
                    href="tel:+91XXXXXXXXXX"
                    className="text-[#342D87] font-semibold flex items-center gap-2 hover:underline"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    +91-XXXXXXXXXX
                  </a>
                </div>
              </div>

              {/* Back to Home */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-[#342D87] font-semibold flex items-center gap-2 mx-auto hover:underline transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ApplicationDownload() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-700 font-semibold">
                Loading application...
              </p>
            </div>
          </div>
        }
      >
        <ApplicationDownloadContent />
      </Suspense>
    </>
  );
}
