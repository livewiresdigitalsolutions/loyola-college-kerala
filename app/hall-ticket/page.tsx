"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

interface HallTicketData {
  id: number;
  admission_id: number;
  application_id: string;
  full_name: string;
  father_name: string;
  mobile: string;
  email: string;
  program_level_id: number;
  degree_id: number;
  course_id: number;
  exam_center_id: number;
  exam_date: string;
  exam_time: string;
  passport_photo_url: string;
  status: string;
}

interface ProgramDetails {
  program: string;
  degree: string;
  course: string;
  examCenter: string;
}

function HallTicketPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hallTicketData, setHallTicketData] = useState<HallTicketData | null>(
    null
  );
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!userEmail) {
      toast.error("No email provided");
      router.push("/");
      return;
    }
    fetchHallTicketData();
  }, [userEmail]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const a4Width = 794; // 210mm in pixels at 96 DPI
        const newScale = Math.min(1, (containerWidth - 32) / a4Width);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchHallTicketData = async () => {
    try {
      const response = await fetch(`/api/hall-ticket?email=${userEmail}`);
      const result = await response.json();

      if (result.data) {
        setHallTicketData(result.data);

        await fetchProgramDetails(
          result.data.program_level_id,
          result.data.degree_id,
          result.data.course_id,
          result.data.exam_center_id
        );
      } else {
        toast.error("Hall ticket not allocated yet");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to load hall ticket");
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
        examCenter: examCenter
          ? examCenter.location
            ? `${examCenter.centre_name} - ${examCenter.location}`
            : examCenter.centre_name
          : "N/A",
      });
    } catch (error) {
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !hallTicketData) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // A4 Portrait
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

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save(`HallTicket-${hallTicketData.application_id}.pdf`);

      // Update status to downloaded
      await updateDownloadStatus();

      toast.success("Hall ticket downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateDownloadStatus = async () => {
    try {
      await fetch(`/api/hall-ticket/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          status: "downloaded",
        }),
      });
    } catch (error) {
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#342D87]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-6 text-lg text-white font-semibold">
            Loading your hall ticket...
          </p>
        </div>
      </div>
    );
  }

  if (!hallTicketData) return null;

  const formattedExamDate = hallTicketData.exam_date
    ? new Date(hallTicketData.exam_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#342D87] py-8 pt-20">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#342D87] border-2 border-white text-white font-bold rounded-lg transition-colors shadow-lg hover:bg-white hover:text-[#342D87]"
        >
          Back to Home
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-6 py-3 bg-[#342D87] text-white border-white border-2 font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-white hover:text-[#342D87]"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
              Download Hall Ticket
            </>
          )}
        </button>
      </div>

      {/* Hall Ticket Content Area - Responsive Scaled Container */}
      <div
        ref={containerRef}
        className="pt-8 pb-24 flex justify-center items-start px-4"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.3s ease",
          }}
        >
          <div
            ref={contentRef}
            className="bg-white shadow-2xl"
            style={{
              width: "210mm",
              height: "297mm", // A4 Portrait
              padding: "12mm",
              boxSizing: "border-box",
            }}
          >
            {/* Header with Logo */}
            <div className="text-center mb-4">
              <img
                src="/loyola-banner.jpg"
                alt="Institution Logo"
                className="max-w-[600px] h-auto mx-auto mb-2"
                crossOrigin="anonymous"
              />
            </div>

            {/* Title */}
            <div className="bg-[#342D87] text-white text-center text-xl font-bold py-2 uppercase mb-4">
              Hall Ticket - 2026
            </div>

            {/* Content */}
            <div className="flex gap-5 mt-4">
              {/* Left Section */}
              <div className="flex-1">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 w-2/5 font-bold text-[11pt] bg-gray-50">
                        Application ID
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {hallTicketData.application_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Name
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {hallTicketData.full_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Father's Name
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {hallTicketData.father_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Mobile Number
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {hallTicketData.mobile}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Program
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {programDetails?.program || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Degree
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {programDetails?.degree || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Course
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {programDetails?.course || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Exam Details */}
                <div className="mt-4 border-2 border-[#342D87] p-2.5 bg-gray-50">
                  <h3 className="text-[#342D87] text-sm font-bold mb-2 uppercase">
                    Exam Details
                  </h3>
                  <div className="flex gap-5">
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-600 mb-1">
                        Date
                      </div>
                      <div className="text-[13pt] font-bold text-black">
                        {formattedExamDate}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-600 mb-1">
                        Time
                      </div>
                      <div className="text-[13pt] font-bold text-black">
                        {hallTicketData.exam_time}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <div className="text-xs font-bold text-gray-600 mb-1">
                      Test Center
                    </div>
                    <div className="text-[13pt] font-bold text-black">
                      {programDetails?.examCenter || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Passport Photo */}
              <div
                className="border-2 border-dashed border-[#342D87] flex items-center justify-center bg-gray-50 p-2"
                style={{
                  width: "35mm", // Standard passport photo width
                  height: "45mm", // Standard passport photo height
                  minWidth: "35mm",
                  minHeight: "45mm",
                }}
              >
                {hallTicketData.passport_photo_url ? (
                  <img
                    src={hallTicketData.passport_photo_url}
                    alt="Passport Photo"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="text-center text-gray-500 text-xs">
                    <p>Affix passport</p>
                    <p>size photo here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Signature Section */}
            <div className="mt-10 mb-4 flex justify-between items-end gap-8">
              <div className="flex-1 text-center">
                <div className="h-12"></div>
                <div className="border-t-2 border-black mx-8"></div>
                <div className="text-[10pt] mt-1 font-semibold">
                  Signature of the candidate
                </div>
              </div>
              <div className="flex-1 text-center">
                {/* Controller Signature Image */}
                <div className="h-18 flex items-center justify-center">
                  <img
                    src="/assets/COE_sign.png"
                    alt="Controller Signature"
                    className="h-20 w-auto object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="border-t-2 border-black mx-8"></div>
                <div className="text-[10pt] mt-1 font-semibold">
                  Controller of Examinations
                </div>
              </div>
            </div>

            {/* Instructions/Rules Section */}
            <div className="mt-6 border-t-2 border-[#342D87] pt-4">
              <h3 className="text-[#342D87] text-sm font-bold mb-3 uppercase">
                Instructions for Candidates
              </h3>
              <ol className="list-decimal pl-6 text-[10pt] space-y-2">
                <li>
                  Candidates must bring this hall ticket along with a valid
                  photo ID proof (Aadhaar Card/Passport/Driving License) to the
                  examination center.
                </li>
                <li>
                  Candidates must report to the examination center at least 30
                  minutes before the scheduled start time. Late arrivals will
                  not be permitted entry.
                </li>
                <li>
                  Mobile phones, electronic devices, books, notes, or any
                  unauthorized materials are strictly prohibited inside the
                  examination hall.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HallTicketPreview() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#342D87]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
              <p className="mt-6 text-lg text-white font-semibold">
                Loading hall ticket...
              </p>
            </div>
          </div>
        }
      >
        <HallTicketPreviewContent />
      </Suspense>
    </>
  );
}
