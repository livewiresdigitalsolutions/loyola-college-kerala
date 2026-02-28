"use client";

import { useState } from "react";
import { ChevronUp, Shield, AlertTriangle } from "lucide-react";

export default function RegisterComplaint() {
  const [isOpen, setIsOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Register a Complaint</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-8">
          {/* Confidentiality Notice */}
          <div className="bg-[#F6F6EE] border-l-4 border-[#13432C] px-5 py-4 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#13432C] mt-0.5 shrink-0" />
              <p className="text-gray-700 text-[15px] leading-relaxed">
                All complaints are treated with <strong>strict confidentiality</strong>. Your identity
                will be protected throughout the process. You may also choose to file anonymously.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complaint Submitted Successfully</h3>
              <p className="text-gray-600 text-[15px] mb-6">
                Your complaint has been received. The Women Cell coordinator will review it and get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#13432C] text-white rounded-lg text-sm font-medium hover:bg-[#0e3522] transition-colors"
              >
                Submit Another Complaint
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="complaint-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-gray-400 font-normal">(optional for anonymous)</span>
                  </label>
                  <input
                    type="text"
                    id="complaint-name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="complaint-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    id="complaint-email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Department & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="complaint-department" className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    id="complaint-department"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors bg-white"
                  >
                    <option value="">Select your department</option>
                    <option value="economics">Department of Economics</option>
                    <option value="english">Department of English</option>
                    <option value="social-work">Department of Social Work</option>
                    <option value="sociology">Department of Sociology</option>
                    <option value="political-science">Department of Political Science</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="complaint-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="complaint-phone"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors"
                  />
                </div>
              </div>

              {/* Complaint Type */}
              <div>
                <label htmlFor="complaint-type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type of Complaint <span className="text-red-500">*</span>
                </label>
                <select
                  id="complaint-type"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors bg-white"
                >
                  <option value="">Select complaint type</option>
                  <option value="harassment">Sexual Harassment</option>
                  <option value="discrimination">Gender Discrimination</option>
                  <option value="verbal-abuse">Verbal Abuse</option>
                  <option value="stalking">Stalking / Cyberstalking</option>
                  <option value="ragging">Ragging</option>
                  <option value="domestic-violence">Domestic Violence</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date of Incident */}
              <div>
                <label htmlFor="complaint-date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Incident <span className="text-gray-400 font-normal">(approximate)</span>
                </label>
                <input
                  type="date"
                  id="complaint-date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="complaint-description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description of Incident <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="complaint-description"
                  rows={5}
                  required
                  placeholder="Please describe the incident in detail. Include relevant information such as location, persons involved, and any witnesses."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#13432C]/20 focus:border-[#13432C] transition-colors resize-vertical"
                />
              </div>

              {/* Anonymous checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="complaint-anonymous"
                  className="mt-1 w-4 h-4 accent-[#13432C]"
                />
                <label htmlFor="complaint-anonymous" className="text-sm text-gray-700">
                  I wish to file this complaint <strong>anonymously</strong>. I understand that this may
                  limit the committee&apos;s ability to follow up.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#13432C] text-white rounded-lg text-sm font-medium hover:bg-[#0e3522] transition-colors"
              >
                Submit Complaint
              </button>
            </form>
          )}

          {/* Emergency Banner */}
          <div className="mt-8 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 leading-relaxed">
              In case of an emergency or if you feel unsafe, please contact the college authorities
              immediately or call the Women Helpline at <strong>181</strong>.
            </p>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
