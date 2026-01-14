
"use client";
import React from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function StartApplication() {
  return (
    <>
      {/* CTA SECTION - MINIMAL CENTERED */}
      <section className="w-full  py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px]">
            {/* BACKGROUND IMAGE - UNSPLASH */}
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
                  <button className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 group shadow-2xl">
                    Apply Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="border-2 border-white bg-transparent text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black  transition-all duration-300">
                    Contact Us
                  </button>
                </div>

                {/* CONTACT INFO */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80 text-sm">
                  <a href="mailto:admissions@college.edu" className="hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>admissions@college.edu</span>
                  </a>
                  <a href="tel:+91XXXXXXXXXX" className="hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91-XXXXXXXXXX</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW SECTION */}
      <section className="w-full bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Have Questions?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Find quick answers to common admission queries
          </p>

          <div className="space-y-4">
            <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Is the application fee refundable?
              </h3>
              <p className="text-gray-600">
                No, the application fee is non-refundable under any circumstances. Please ensure all details are correct before payment.
              </p>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Can I edit my application after submission?
              </h3>
              <p className="text-gray-600">
                You can save your application as a draft and edit multiple times. However, once submitted and payment is made, changes cannot be made.
              </p>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                How will I know if my application is accepted?
              </h3>
              <p className="text-gray-600">
                Admission decisions will be communicated via email and SMS. You can also check your application status on the admission portal.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button className="text-primary font-semibold hover:underline inline-flex items-center gap-2 group">
              View All FAQs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}