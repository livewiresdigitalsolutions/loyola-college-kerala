import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { AssociationData } from "../_data/associations";

interface ContactProps {
  data: AssociationData;
}

export default function Contact({ data }: ContactProps) {
  const addressLines = data.address.split("\n");

  return (
    <section
      id="contact"
      className="scroll-mt-32 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-10 h-[3px] bg-[#F0B129] rounded-full" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            Contact
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-10 ml-[52px]">
          Get in touch with the {data.name} team for any queries or collaborations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Address</h4>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Email</h4>
                <p className="text-gray-500 text-sm mt-1">{data.contact_email}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Phone</h4>
                <p className="text-gray-500 text-sm mt-1">{data.contact_phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Office Hours</h4>
                <p className="text-gray-500 text-sm mt-1">
                  Monday – Friday: 9:00 AM – 4:30 PM
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-5">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
