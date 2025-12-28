"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

function ApplicationPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const contentRef = useRef<HTMLDivElement>(null);

  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(null);
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
      const [programRes, degreeRes, courseRes, examCenterRes] = await Promise.all([
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

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !applicationData) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      const applicationId = generateApplicationId(
        applicationData.program_level_id,
        applicationData.degree_id,
        applicationData.course_id,
        applicationData.id
      );

      pdf.save(`Application-${applicationId}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#342D87]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-6 text-lg text-white font-semibold">
            Loading your application...
          </p>
        </div>
      </div>
    );
  }

  if (!applicationData) return null;

  const applicationId = generateApplicationId(
    applicationData.program_level_id,
    applicationData.degree_id,
    applicationData.course_id,
    applicationData.id
  );

  const formattedDob = applicationData.dob
    ? new Date(applicationData.dob).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#342D87] py-8">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#342D87] border-2 border-white text-white font-bold rounded-lg transition-colors shadow-lg"
        >
          Back to Home
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-6 py-3 bg-[#342D87] text-white border-white border-2 font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#342D87]"></div>
              Generating...
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* PDF Content Area */}
      <div className="pt-20">
        <div
          ref={contentRef}
          className="max-w-[210mm] mx-auto bg-white shadow-2xl p-[15mm]"
        >
          {/* Header with Logo */}
          <div className="text-center mb-4 pt-20">
            <img
              src="/loyola-banner.jpg"
              alt="Loyola College Logo"
              className="w-[800px] h-auto mx-auto -mt-[100px] mb-[-50px] z-50"
              crossOrigin="anonymous"
            />
          </div>
          
          <div className="bg-transparent text-white text-center text-xl font-bold py-2.5 mb-2.5 uppercase pt-10">
          </div>

          {/* Title */}
          <div className="bg-[#342D87] text-white text-center text-xl font-bold py-2.5 mb-2.5 uppercase">
            APPLICATION FORM 2026
          </div>

          {/* Application ID */}
          <table className="w-full border-collapse mb-0">
            <tbody>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Application ID
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationId}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Personal Information */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                  style={{ verticalAlign: 'middle' }}
                >
                  PERSONAL INFORMATION
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Full Name
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.full_name}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Date of Birth
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {formattedDob}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Gender
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.gender || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Mobile Number
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.mobile}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Email Address
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.email}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Contact Information */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                  style={{ verticalAlign: 'middle' }}
                >
                  CONTACT INFORMATION
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Address
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.address || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  City
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.city || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  State
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.state || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  PIN Code
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.pincode || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Parent/Guardian Information */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                  style={{ verticalAlign: 'middle' }}
                >
                  PARENT/GUARDIAN INFORMATION
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Father's Name
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.father_name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Mother's Name
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.mother_name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Parent Mobile
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.parent_mobile || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Parent Email
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.parent_email || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Emergency Contact */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                  style={{ verticalAlign: 'middle' }}
                >
                  EMERGENCY CONTACT
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Emergency Contact Name
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.emergency_contact_name || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Relation
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.emergency_contact_relation || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Emergency Mobile
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.emergency_contact_mobile || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Program Details */}
          {programDetails && (
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td
                    colSpan={2}
                    className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                    style={{ verticalAlign: 'middle' }}
                  >
                    PROGRAM DETAILS
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    Program Level
                  </td>
                  <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    {programDetails.program}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    Degree
                  </td>
                  <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    {programDetails.degree}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    Course
                  </td>
                  <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    {programDetails.course}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    Exam Center
                  </td>
                  <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                    {programDetails.examCenter}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Payment Details */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="bg-[#342D87] text-white font-bold p-1.5 px-2 text-[12pt]"
                  style={{ verticalAlign: 'middle' }}
                >
                  PAYMENT DETAILS
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 w-2/5 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Payment ID
                </td>
                <td className="border border-black p-1 px-3 w-3/5 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  {applicationData.payment_id || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Payment Amount
                </td>
                <td className="border border-black p-1 px-3 text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  ₹{applicationData.payment_amount || 0}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-1 px-3 font-semibold text-[11pt]" style={{ verticalAlign: 'middle' }}>
                  Payment Status
                </td>
                <td className="border border-black p-1 px-3 text-[11pt] uppercase" style={{ verticalAlign: 'middle' }}>
                  {applicationData.payment_status || "PENDING"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationPreview() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#342D87]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
              <p className="mt-6 text-lg text-white font-semibold">
                Loading application...
              </p>
            </div>
          </div>
        }
      >
        <ApplicationPreviewContent />
      </Suspense>
    </>
  );
}
