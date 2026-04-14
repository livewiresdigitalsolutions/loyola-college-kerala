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
  pref2?: string;
  pref3?: string;
  examCenter: string;
}

function HallTicketPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
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

        await fetchProgramDetails(result.data);
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

  const fetchProgramDetails = async (data: any) => {
    try {
      const { program_level_id: programId, degree_id: degreeId, exam_center_id: examCenterId } = data;
      const [programRes, degreeRes, examCenterRes] =
        await Promise.all([
          fetch(`/api/programs`),
          fetch(`/api/degrees?program_id=${programId}`),
          examCenterId ? fetch(`/api/exam-centers`) : null,
        ]);

      const [programs, degrees, examCenters] = await Promise.all([
        programRes.json(),
        degreeRes.json(),
        examCenterRes ? examCenterRes.json() : [],
      ]);

      const program = programs.find((p: any) => p.id === programId);
      const degree = degrees.find((d: any) => d.id === degreeId);
      const examCenter = examCenterId
        ? examCenters.find((e: any) => e.id === examCenterId)
        : null;

      setProgramDetails({
        program: program?.discipline || "N/A",
        degree: degree?.degree_name || "N/A",
        course: data.pref1_name || "N/A",
        pref2: data.pref2_name,
        pref3: data.pref3_name,
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
    if (!page1Ref.current || !page2Ref.current || !hallTicketData) return;

    setIsDownloading(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page 1
      const canvas1 = await html2canvas(page1Ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData1 = canvas1.toDataURL("image/png");
      pdf.addImage(imgData1, "PNG", 0, 0, 210, 297);

      // Page 2
      pdf.addPage();
      const canvas2 = await html2canvas(page2Ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData2 = canvas2.toDataURL("image/png");
      pdf.addImage(imgData2, "PNG", 0, 0, 210, 297);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#342D87] mx-auto"></div>
          <p className="mt-6 text-lg text-slate-700 font-semibold">
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
    <div className="min-h-screen bg-slate-100 py-8 pt-20">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-6 py-3 bg-[#342D87] text-white border-white border-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-white hover:text-[#342D87]"
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
              Download Hall Ticket
            </>
          )}
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-white border-2 border-white text-red-600 font-bold rounded-lg transition-colors shadow-lg hover:bg-red-50 hover:text-red-700"
        >
          Back to Home
        </button>
      </div>

      {/* Hall Ticket Content Area - Responsive Scaled Container */}
      <div
        ref={containerRef}
        className="pt-8 pb-24 flex justify-center items-start px-4"
      >
        <div className="flex flex-col gap-8" style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.3s ease" }}>
          
          {/* PAGE 1 */}
          <div
            ref={page1Ref}
            className="bg-white shadow-2xl relative flex flex-col"
            style={{ width: "210mm", height: "297mm", padding: "12mm", boxSizing: "border-box" }}
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
              Loyola Common Entrance Test (LCET 2026)
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
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50 align-top">
                        Course(s) Applied
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        <div className="flex flex-col gap-0.5">
                          <div>Option 1: {programDetails?.course || "N/A"}</div>
                          {programDetails?.pref2 && <div>Option 2: {programDetails.pref2}</div>}
                          {programDetails?.pref3 && <div>Option 3: {programDetails.pref3}</div>}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Exam Date
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {formattedExamDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[#342D87] p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">
                        Exam Center
                      </td>
                      <td className="border border-[#342D87] p-1.5 px-2.5 text-[11pt]">
                        {programDetails?.examCenter || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
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

            {/* Exam Schedule Table */}
            <div className="mt-8">
              <h3 className="text-[#342D87] text-sm font-bold mb-2 uppercase">Exam Time</h3>
              <table className="w-full border-collapse border border-[#342D87] text-center">
                <thead className="bg-[#342D87] text-white">
                  <tr>
                    <th className="border border-[#342D87] p-1.5 text-[10pt] font-semibold w-1/2">Examination</th>
                    <th className="border border-[#342D87] p-1.5 text-[10pt] font-semibold whitespace-nowrap">Number of Questions</th>
                    <th className="border border-[#342D87] p-1.5 text-[10pt] font-semibold whitespace-nowrap">Duration</th>
                    <th className="border border-[#342D87] p-1.5 text-[10pt] font-semibold whitespace-nowrap">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] text-left">General Paper (Common for All)</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">60</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">70 minutes</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">10:00 AM – 11:10 AM</td>
                  </tr>
                  <tr>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] text-left">Commerce (Fintech & AI, Finance & Accounts, Logistics & SCM)</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">11:30 AM – 12:05 PM</td>
                  </tr>
                  <tr>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] text-left">Data Science</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">12:20 PM – 12:50 PM</td>
                  </tr>
                  <tr>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] text-left">Social Sciences (Psychology & Social Work)</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-[#342D87] p-1.5 text-[10pt] whitespace-nowrap">01:00 PM – 01:35 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mt-auto mb-8 flex justify-between items-end gap-8">
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
                    src="/assets/COE_SIGN.png"
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

            <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-gray-500">
              Page 1 of 2
            </div>
          </div>

          {/* PAGE 2 */}
          <div
            ref={page2Ref}
            className="bg-white shadow-2xl relative"
            style={{ width: "210mm", height: "297mm", padding: "12mm", boxSizing: "border-box" }}
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

            <div className="bg-[#342D87] text-white text-center text-xl font-bold py-2 uppercase mb-4">
              Important Instructions
            </div>

            {/* Instructions/Rules Section */}
            <div className="mt-6 pt-4">
              <ol className="list-decimal pl-6 text-[11pt] space-y-4 text-justify">
                <li>
                  The Hall Ticket is mandatory for entry into the examination hall. Candidates must also carry one passport-size photograph.
                </li>
                <li>
                  Candidates must bring a valid Government-issued ID proof for verification.
                </li>
                <li>
                  Candidates are required to report to the examination centre at least 30 minutes prior to the commencement of the examination.
                </li>
                <li>
                  The use of mobile phones, calculators, smart devices, or any other electronic gadgets is strictly prohibited inside the examination hall.
                </li>
                <li>
                  The candidates shall write their Application Number and Date of Birth in the space provided in the Answer Sheet and shall blacken the appropriate bubbles.
                </li>
                <li>
                  Each question carries FOUR marks. There is no negative mark for wrong answers.
                </li>
                <li>
                  USE ONLY A BLACK/BLUE BALL-POINT PEN to mark your answers. Marking with any other ink or pencils will not be recognised by the system. Once an answer is marked, it cannot be changed. Marking more than one answer will not fetch the candidate any marks, even if one of the answers is RIGHT.
                </li>
                <li>
                  Candidates are not permitted to leave the examination hall before the conclusion of the examination.
                </li>
                <li>
                  Any form of malpractice or misconduct will result in immediate disqualification and cancellation of candidature.
                </li>
                <li>
                  The decision of the college management in all matters related to the examination shall be final and binding.
                </li>
              </ol>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center text-sm font-bold text-gray-500">
              Page 2 of 2
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
