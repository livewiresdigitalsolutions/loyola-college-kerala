"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface ApplicationData {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  father_name: string;
  mother_name: string;
  parent_mobile: string;
  parent_email: string;
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
}

interface ProgramDetails {
  program: string;
  degree: string;
  course: string;
  examCenter: string;
}

export default function ApplicationDownload() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
      const response = await fetch(`/api/admission-form?email=${userEmail}`);
      const result = await response.json();

      if (result.data) {
        if (result.data.payment_status !== "completed") {
          toast.error("Payment not completed");
          router.push(`/admission-form?email=${userEmail}`);
          return;
        }
        setApplicationData(result.data);

        await fetchProgramDetails(
          result.data.program_level_id,
          result.data.degree_id,
          result.data.course_id,
          result.data.exam_center_id
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
      const [programRes, degreeRes, courseRes, examCenterRes] =
        await Promise.all([
          fetch(`/api/programs`),
          fetch(`/api/degrees?programid=${programId}`),
          fetch(`/api/courses?degreeid=${degreeId}`),
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
    return `LC${programLevelId}${degreeId}${courseId}20265${paddedId}`;
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
        applicationData!.program_level_id,
        applicationData!.degree_id,
        applicationData!.course_id,
        applicationData!.id
      );
      a.download = `Application-${applicationId}.pdf`;  // Changed to .pdf
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
    <>
      <Toaster position="top-right" />
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
            Your admission application has been submitted successfully and
            payment has been confirmed.
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
                                ? new Date(
                                    applicationData.dob
                                  ).toLocaleDateString("en-IN")
                                : "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Gender
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.gender || "N/A"}
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
                              {applicationData.address || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              City
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.city || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              State
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.state || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              PIN Code
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.pincode || "N/A"}
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
                              Mother's Name
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.mother_name || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Parent Mobile
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.parent_mobile || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Parent Email
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.parent_email || "N/A"}
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
                              {applicationData.emergency_contact_relation ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 font-semibold">
                              Emergency Mobile
                            </p>
                            <p className="text-lg font-semibold text-black">
                              {applicationData.emergency_contact_mobile ||
                                "N/A"}
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
                              {applicationData.payment_id}
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
                          onClick={handleDownloadDocument}
                          disabled={isDownloading}
                          className="px-8 py-4 bg-[#342D87] text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                        Please save this document for your records and future
                        reference
                      </p>
                    </div>
                  </>
                )}

                {/* Contact Support */}
                <div className="mt-8 text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-black mb-2">
                    <strong>Need Help?</strong> Contact our admission support
                    team
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <a
                      href="mailto:admissions@loyola.edu"
                      className="text-[#342D87] font-semibold flex items-center gap-2"
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
                      className="text-[#342D87] font-semibold flex items-center gap-2"
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
                    className="text-[#342D87] font-semibold flex items-center gap-2 mx-auto transition-colors duration-200"
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
    </>
  );
}
