// // "use client";
// // import React, { useState } from "react";
// // import { ArrowRight, Mail, Phone } from "lucide-react";
// // import { Toaster } from "react-hot-toast";
// // import ApplicationModal from "./ApplicationModal";

// // export default function StartApplication() {
// //   const [showModal, setShowModal] = useState<boolean>(false);
// //   const [showLogin, setShowLogin] = useState<boolean>(false);

// //   const handleApplyNowClick = () => {
// //     setShowModal(true);
// //     setShowLogin(false);
// //   };

// //   const handleContactClick = () => {
// //     // Scroll to contact section or open contact modal
// //     window.location.href = "/";
// //   };

// //   const handleCloseModal = () => {
// //     setShowModal(false);
// //     setShowLogin(false);
// //   };

// //   return (
// //     <>
// //       <Toaster position="top-right" />

// //       {/* ADMISSION MODAL */}
// //       <ApplicationModal
// //         isOpen={showModal}
// //         onClose={handleCloseModal}
// //         showLogin={showLogin}
// //         setShowLogin={setShowLogin}
// //       />

// //       {/* CTA SECTION - MINIMAL CENTERED */}
// //       <section className="w-full py-20">
// //         <div className="max-w-7xl mx-auto px-6">
// //           <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px]">
// //             {/* BACKGROUND IMAGE */}
// //             <img
// //               src="./assets/loyola.png"
// //               alt="University campus"
// //               className="absolute inset-0 w-full h-full object-cover"
// //             />

// //             {/* DARK OVERLAY */}
// //             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>

// //             {/* CONTENT - CENTERED */}
// //             <div className="relative z-10 h-full flex items-center justify-center">
// //               <div className="text-center max-w-3xl px-6">
// //                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
// //                   Ready to Apply?
// //                 </h2>

// //                 <p className="text-white/90 text-xl mb-10 leading-relaxed">
// //                   Start your application today and join our community of excellence.
// //                 </p>

// //                 {/* CTA BUTTONS */}
// //                 <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
// //                   {/* <button
// //                     onClick={handleApplyNowClick}
// //                     className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 group shadow-2xl"
// //                   >
// //                     Apply Now
// //                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// //                   </button> */}
// //                   <button
// //                     onClick={handleContactClick}
// //                     className="border-2 border-white bg-transparent text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300"
// //                   >
// //                     Apply Now
// //                   </button>
// //                 </div>

// //                 {/* CONTACT INFO */}
// //                 <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80 text-sm">
// //                   <a
// //                     href="mailto:admissions@college.edu"
// //                     className="hover:text-white transition-colors flex items-center justify-center gap-2"
// //                   >
// //                     <Mail className="w-4 h-4" />
// //                     <span>loyolacollegetvm@gmail.com</span>
// //                   </a>
// //                   <a
// //                     href="tel:+91XXXXXXXXXX"
// //                     className="hover:text-white transition-colors flex items-center justify-center gap-2"
// //                   >
// //                     <Phone className="w-4 h-4" />
// //                     <span>+91-471-2592059, 2591018</span>
// //                   </a>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* FAQ PREVIEW SECTION */}
// //       <section className="w-full bg-white py-20">
// //         <div className="max-w-4xl mx-auto px-6">
// //           <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
// //             Have Questions?
// //           </h2>
// //           <p className="text-center text-gray-600 mb-12">
// //             Find quick answers to common admission queries
// //           </p>

// //           <div className="space-y-4">
// //             <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
// //               <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                 Is the application fee refundable?
// //               </h3>
// //               <p className="text-gray-600">
// //                 No, the application fee is non-refundable under any circumstances. Please ensure all details are correct before payment.
// //               </p>
// //             </div>

// //             <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
// //               <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                 Can I edit my application after submission?
// //               </h3>
// //               <p className="text-gray-600">
// //                 Yes, You can save your application as a draft and edit multiple times. However, once submitted and payment is made, changes cannot be made.
// //               </p>
// //             </div>

// //             <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
// //               <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                 How will I know if my application is accepted?
// //               </h3>
// //               <p className="text-gray-600">
// //                 Admission decisions will be communicated via email. You can also check your application status on the admission portal.
// //               </p>
// //             </div>

// //             <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
// //               <h3 className="font-bold text-lg text-gray-800 mb-2">
// //                 How to Download Hall Ticket?
// //               </h3>
// //               <p className="text-gray-600">
// //                 You can download your hall ticket through the application portal after allocation. The Hall ticket is mandatory for the entrance exam.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="text-center mt-10">
// //             {/* <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2 group">
// //               View All FAQs
// //               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
// //             </button> */}
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }


















// "use client";
// import React, { useState } from "react";
// import { ArrowRight, Mail, Phone, ChevronDown } from "lucide-react";
// import { Toaster } from "react-hot-toast";
// import ApplicationModal from "./ApplicationModal";


// export default function StartApplication() {
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [showLogin, setShowLogin] = useState<boolean>(false);
//   const [expandedFaq, setExpandedFaq] = useState<number | null>(null);


//   const handleApplyNowClick = () => {
//     setShowModal(true);
//     setShowLogin(false);
//   };


//   const handleContactClick = () => {
//     // Scroll to contact section or open contact modal
//     window.location.href = "/";
//   };


//   const handleCloseModal = () => {
//     setShowModal(false);
//     setShowLogin(false);
//   };


//   const toggleFaq = (index: number) => {
//     setExpandedFaq(expandedFaq === index ? null : index);
//   };


//   const faqs = [
//     {
//       question: "Is the application fee refundable?",
//       answer: "No, the application fee is non-refundable under any circumstances. Please ensure all details are correct before payment."
//     },
//     {
//       question: "Can I edit my application after submission?",
//       answer: "Yes, You can save your application as a draft and edit multiple times. However, once submitted and payment is made, changes cannot be made."
//     },
//     {
//       question: "How will I know if my application is accepted?",
//       answer: "Admission decisions will be communicated via email. You can also check your application status on the admission portal."
//     },
//     {
//       question: "How to Download Hall Ticket?",
//       answer: "You can download your hall ticket through the application portal after allocation. The Hall ticket is mandatory for the entrance exam."
//     }
//   ];


//   return (
//     <>
//       <Toaster position="top-right" />


//       {/* ADMISSION MODAL */}
//       <ApplicationModal
//         isOpen={showModal}
//         onClose={handleCloseModal}
//         showLogin={showLogin}
//         setShowLogin={setShowLogin}
//       />


//       {/* CTA SECTION - WITH AUTO SCALE IMAGE */}
//       <section className="w-full py-20">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] group">
//             {/* BACKGROUND IMAGE WITH AUTO SCALE */}
//             <img
//               src="./assets/loyola.png"
//               alt="University campus"
//               className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110"
//             />


//             {/* DARK OVERLAY */}
//             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>


//             {/* CONTENT - CENTERED */}
//             <div className="relative z-10 h-full flex items-center justify-center">
//               <div className="text-center max-w-3xl px-6">
//                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
//                   Ready to Apply?
//                 </h2>


//                 <p className="text-white/90 text-xl mb-10 leading-relaxed">
//                   Start your application today and join our community of excellence.
//                 </p>


//                 {/* CTA BUTTONS */}
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
//                   <button
//                     onClick={handleContactClick}
//                     className="border-2 border-white bg-transparent text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300"
//                   >
//                     Apply Now
//                   </button>
//                 </div>


//                 {/* CONTACT INFO */}
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80 text-sm">
//                   <a
//                     href="mailto:admissions@college.edu"
//                     className="hover:text-white transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Mail className="w-4 h-4" />
//                     <span>loyolacollegetvm@gmail.com</span>
//                   </a>
//                   <a
//                     href="tel:+91XXXXXXXXXX"
//                     className="hover:text-white transition-colors flex items-center justify-center gap-2"
//                   >
//                     <Phone className="w-4 h-4" />
//                     <span>+91-471-2592059, 2591018</span>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>


//       {/* FAQ PREVIEW SECTION WITH ACCORDION ANIMATION */}
//       <section className="w-full bg-green-50 py-20">
//         <div className="max-w-4xl mx-auto px-6">
//           <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
//             Have Questions?
//           </h2>
//           <p className="text-center text-gray-600 mb-12">
//             Find quick answers to common admission queries
//           </p>


//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <div
//                 key={index}
//                 className="bg-primary/5 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-transparent hover:border-primary/20"
//               >
//                 <button
//                   onClick={() => toggleFaq(index)}
//                   className="w-full p-6 text-left flex items-center justify-between group"
//                 >
//                   <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors duration-200">
//                     {faq.question}
//                   </h3>
//                   <ChevronDown
//                     className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
//                       expandedFaq === index ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 <div
//                   className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                     expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//                   }`}
//                 >
//                   <p className="text-gray-600 px-6 pb-6 leading-relaxed">
//                     {faq.answer}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>


//           <div className="text-center mt-10">
//             {/* <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2 group">
//               View All FAQs
//               <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//             </button> */}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }











"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Mail, Phone, ChevronDown } from "lucide-react";
import { Toaster } from "react-hot-toast";
import ApplicationModal from "./ApplicationModal";

export default function StartApplication() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [containerScale, setContainerScale] = useState<number>(0.85);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleApplyNowClick = () => {
    setShowModal(true);
    setShowLogin(false);
  };

  const handleContactClick = () => {
    window.location.href = "/";
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowLogin(false);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Scroll-based zoom effect for container
  useEffect(() => {
    const handleScroll = () => {
      if (!imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is visible
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // When element enters viewport from bottom
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Calculate progress (0 to 1) as element comes into view
        const scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)));
        
        // Scale from 0.85 to 1 as user scrolls
        const scale = 0.85 + (scrollProgress * 0.15);
        setContainerScale(scale);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const faqs = [
    {
      question: "Is the application fee refundable?",
      answer: "No, the application fee is non-refundable under any circumstances. Please ensure all details are correct before payment."
    },
    {
      question: "Can I edit my application after submission?",
      answer: "Yes, You can save your application as a draft and edit multiple times. However, once submitted and payment is made, changes cannot be made."
    },
    {
      question: "How will I know if my application is accepted?",
      answer: "Admission decisions will be communicated via email. You can also check your application status on the admission portal."
    },
    {
      question: "How to Download Hall Ticket?",
      answer: "You can download your hall ticket through the application portal after allocation. The Hall ticket is mandatory for the entrance exam."
    }
  ];

  return (
    <>
      <Toaster position="top-right" />

      {/* ADMISSION MODAL */}
      <ApplicationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
      />

      {/* CTA SECTION - WITH SCROLL-BASED ZOOM ON CONTAINER */}
      <section className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div 
            ref={imageContainerRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] transition-transform duration-500 ease-out origin-center"
            style={{ transform: `scale(${containerScale})` }}
          >
            {/* BACKGROUND IMAGE */}
            <img
              src="./assets/loyola.png"
              alt="University campus"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50"></div>

            {/* CONTENT - CENTERED */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center max-w-3xl px-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Ready to Apply?
                </h2>

                <p className="text-white/90 text-xl mb-10 leading-relaxed">
                  Start your application today and join our community of excellence.
                </p>

                {/* CTA BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button
                    onClick={handleContactClick}
                    className="border-2 border-white bg-transparent text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Apply Now
                  </button>
                </div>

                {/* CONTACT INFO */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80 text-sm">
                  <a
                    href="mailto:loyolacollegetvm@gmail.com"
                    className="hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>loyolacollegetvm@gmail.com</span>
                  </a>
                  <a
                    href="tel:+91 471 2592059"
                    className="hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91-471-2592059, 2591018</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW SECTION WITH ACCORDION ANIMATION */}
      <section className="w-full bg-green-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Find quick answers to common admission queries
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border-2 border-primary/10 hover:border-primary/20"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between group"
                >
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors duration-200">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 px-6 pb-6 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            {/* <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2 group">
              View All FAQs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>
        </div>
      </section>
    </>
  );
}
