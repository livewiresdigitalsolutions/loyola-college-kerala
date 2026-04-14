"use client";

import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export default function HallTicketDemo() {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [scale, setScale] = useState(1);

  // Dummy data instead of fetching from API
  const hallTicketData = {
    application_id: "APP-2026-123456",
    full_name: "JOHN DOE",
    father_name: "RICHARD DOE",
    mobile: "+91 9876543210",
    exam_date: "2026-05-20",
    exam_time: "10:00 AM - 12:00 PM",
    passport_photo_url: null, // Set to null to show "Affix passport size photo here"
  };

  const programDetails = {
    program: "Undergraduate (UG)",
    degree: "B.Sc",
    course: "Computer Science",
    pref2: "Mathematics",
    pref3: "Physics",
    examCenter: "Main Campus - Block A, Room 101",
  };

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

  const handleDownloadPDF = async () => {
    if (!page1Ref.current || !page2Ref.current) return;

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

      pdf.save(`HallTicket-DEMO.pdf`);

      toast.success("Demo Hall ticket downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedExamDate = new Date(hallTicketData.exam_date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 py-8 pt-20">
      <Toaster position="top-right" />
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-6 py-3 bg-primary text-white border-white border-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-white hover:text-primary"
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Demo PDF
            </>
          )}
        </button>
        <button
          onClick={() => window.close()}
          className="px-6 py-3 bg-white border-2 border-white text-red-600 font-bold rounded-lg transition-colors shadow-lg hover:bg-red-50 hover:text-red-700"
        >
          Close Window
        </button>
      </div>

      {/* Hall Ticket Content Area - Responsive Scaled Container */}
      <div ref={containerRef} className="pt-8 pb-24 flex justify-center items-start px-4">
        <div className="flex flex-col gap-8" style={{ transform: `scale(${scale})`, transformOrigin: "top center", transition: "transform 0.3s ease" }}>
          
          {/* PAGE 1 */}
          <div
            ref={page1Ref}
            className="bg-white shadow-2xl relative flex flex-col"
            style={{ width: "210mm", height: "297mm", padding: "12mm", boxSizing: "border-box" }}
          >
            {/* Header with Logo */}
            <div className="text-center mb-4">
              <img src="/loyola-banner.jpg" alt="Institution Logo" className="max-w-[600px] h-auto mx-auto mb-2" crossOrigin="anonymous" />
            </div>

            {/* Title */}
            <div className="bg-primary text-white text-center text-xl font-bold py-2 uppercase mb-4">
              Loyola Common Entrance Test (LCET 2026)
            </div>

            {/* Content */}
            <div className="flex gap-5 mt-4">
              {/* Left Section */}
              <div className="flex-1">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 w-2/5 font-bold text-[11pt] bg-gray-50">Application ID</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{hallTicketData.application_id}</td>
                    </tr>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">Name</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{hallTicketData.full_name}</td>
                    </tr>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">Father's Name</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{hallTicketData.father_name}</td>
                    </tr>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">Mobile Number</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{hallTicketData.mobile}</td>
                    </tr>

                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50 align-top">Course(s) Applied</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">
                        <div className="flex flex-col gap-0.5">
                          <div>Option 1: {programDetails.course}</div>
                          {programDetails.pref2 && <div>Option 2: {programDetails.pref2}</div>}
                          {programDetails.pref3 && <div>Option 3: {programDetails.pref3}</div>}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">Exam Date</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{formattedExamDate}</td>
                    </tr>
                    <tr>
                      <td className="border border-primary p-1.5 px-2.5 font-bold text-[11pt] bg-gray-50">Exam Center</td>
                      <td className="border border-primary p-1.5 px-2.5 text-[11pt]">{programDetails.examCenter}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Right Section - Passport Photo */}
              <div
                className="border-2 border-dashed border-primary flex items-center justify-center bg-gray-50 p-2"
                style={{ width: "35mm", height: "45mm", minWidth: "35mm", minHeight: "45mm" }}
              >
                <div className="text-center text-gray-500 text-xs">
                  <p>Affix passport</p>
                  <p>size photo here</p>
                </div>
              </div>
            </div>

            {/* Exam Schedule Table */}
            <div className="mt-8">
              <h3 className="text-primary text-sm font-bold mb-2 uppercase">Exam Time</h3>
              <table className="w-full border-collapse border border-primary text-center">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="border border-primary p-1.5 text-[10pt] font-semibold w-1/2">Examination</th>
                    <th className="border border-primary p-1.5 text-[10pt] font-semibold whitespace-nowrap">Number of Questions</th>
                    <th className="border border-primary p-1.5 text-[10pt] font-semibold whitespace-nowrap">Duration</th>
                    <th className="border border-primary p-1.5 text-[10pt] font-semibold whitespace-nowrap">Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-primary p-1.5 text-[10pt] text-left">General Paper (Common for All)</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">60</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">70 minutes</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">10:00 AM – 11:10 AM</td>
                  </tr>
                  <tr>
                    <td className="border border-primary p-1.5 text-[10pt] text-left">Commerce (Fintech & AI, Finance & Accounts, Logistics & SCM)</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">11:30 AM – 12:05 PM</td>
                  </tr>
                  <tr>
                    <td className="border border-primary p-1.5 text-[10pt] text-left">Data Science</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">12:20 PM – 12:50 PM</td>
                  </tr>
                  <tr>
                    <td className="border border-primary p-1.5 text-[10pt] text-left">Social Sciences (Psychology & Social Work)</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">30</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">35 minutes</td>
                    <td className="border border-primary p-1.5 text-[10pt] whitespace-nowrap">01:00 PM – 01:35 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Section */}
            <div className="mt-auto mb-8 flex justify-between items-end gap-8">
              <div className="flex-1 text-center">
                <div className="h-12"></div>
                <div className="border-t-2 border-black mx-8"></div>
                <div className="text-[10pt] mt-1 font-semibold">Signature of the candidate</div>
              </div>
              <div className="flex-1 text-center">
                <div className="h-18 flex items-center justify-center">
                  <img src="/assets/COE_SIGN.png" alt="Controller Signature" className="h-24 w-auto object-contain" crossOrigin="anonymous" />
                </div>
                <div className="border-t-2 border-black mx-8"></div>
                <div className="text-[10pt] mt-1 font-semibold">Controller of Examinations</div>
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
              <img src="/loyola-banner.jpg" alt="Institution Logo" className="max-w-[600px] h-auto mx-auto mb-2" crossOrigin="anonymous" />
            </div>

            <div className="bg-primary text-white text-center text-xl font-bold py-2 uppercase mb-4">
              Important Instructions
            </div>

            {/* Instructions/Rules Section */}
            <div className="mt-6 pt-4">
              <ol className="list-decimal pl-6 text-[11pt] space-y-4 text-justify">
                <li>The Hall Ticket is mandatory for entry into the examination hall. Candidates must also carry one passport-size photograph.</li>
                <li>Candidates must bring a valid Government-issued ID proof for verification.</li>
                <li>Candidates are required to report to the examination centre at least 30 minutes prior to the commencement of the examination.</li>
                <li>The use of mobile phones, calculators, smart devices, or any other electronic gadgets is strictly prohibited inside the examination hall.</li>
                <li>The candidates shall write their Application Number and Date of Birth in the space provided in the Answer Sheet and shall blacken the appropriate bubbles.</li>
                <li>Each question carries FOUR marks. There is no negative mark for wrong answers.</li>
                <li>USE ONLY A BLACK/BLUE BALL-POINT PEN to mark your answers. Marking with any other ink or pencils will not be recognised by the system. Once an answer is marked, it cannot be changed. Marking more than one answer will not fetch the candidate any marks, even if one of the answers is RIGHT.</li>
                <li>Candidates are not permitted to leave the examination hall before the conclusion of the examination.</li>
                <li>Any form of malpractice or misconduct will result in immediate disqualification and cancellation of candidature.</li>
                <li>The decision of the college management in all matters related to the examination shall be final and binding.</li>
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
