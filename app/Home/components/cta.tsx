import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

// ── CTA config — update here to change the section text ──────────────────────
const ctaConfig = {
  label: "ADMISSIONS OPEN FOR 2026-27",
  heading: "Shape Your Future with Purpose",
  description:
    "For over six decades, Loyola College of Social Sciences has cultivated leaders who combine academic excellence with social responsibility. Begin your transformative educational journey at Kerala's premier institution for social sciences.",
  deadline: "June 15, 2026",
  academicYear: "2026-27",
  primaryButton: {
    label: "View Application Requirements",
    href: "/admission",
  },
  secondaryButton: {
    label: "Request Information",
    href: "/contact",
  },
  phone: {
    display: "+91 484 276 5634",
    href: "tel:+914842765634",
  },
  email: {
    display: "info@loyolacollege.edu",
    href: "mailto:info@loyolacollege.edu",
  },
  image: "/assets/loyola-building.png",
};

export default function Cta() {
  return (
    <section className="w-full bg-[#F6F6EE] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* MAIN CTA CARD */}
        <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT CONTENT SECTION */}
            <div className="p-12 lg:p-16 text-white flex flex-col justify-between">
              {/* TOP CONTENT */}
              <div className="space-y-6">
                {/* LABEL */}
                <p className="text-sm font-bold tracking-wider uppercase text-white/80">
                  {ctaConfig.label}
                </p>

                {/* MAIN HEADING */}
                <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                  {ctaConfig.heading}
                </h2>

                {/* DESCRIPTION */}
                <p className="text-lg text-white/90 leading-relaxed max-w-xl">
                  {ctaConfig.description}
                </p>

                {/* DIVIDER */}
                <div className="w-full h-[1px] bg-white/30 my-8" />

                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-white/70 mb-1">
                      Application Deadline
                    </p>
                    <p className="text-xl font-bold">{ctaConfig.deadline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Academic Year</p>
                    <p className="text-xl font-bold">{ctaConfig.academicYear}</p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Link
                    href={ctaConfig.primaryButton.href}
                    className="inline-flex items-center text-center justify-center px-8 py-4 bg-white text-primary font-bold hover:bg-white/90 transition-all duration-300 shadow-lg rounded-sm"
                  >
                    {ctaConfig.primaryButton.label}
                  </Link>
                  <Link
                    href={ctaConfig.secondaryButton.href}
                    className="inline-flex items-center text-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold hover:bg-white/10 transition-all duration-300 rounded-sm"
                  >
                    {ctaConfig.secondaryButton.label}
                  </Link>
                </div>
              </div>

              {/* BOTTOM CONTACT INFO */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 text-sm text-white/90">
                <a
                  href={ctaConfig.phone.href}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {ctaConfig.phone.display}
                </a>

                <div className="hidden sm:block w-[1px] h-5 bg-white/30" />

                <a
                  href={ctaConfig.email.href}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {ctaConfig.email.display}
                </a>
              </div>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="relative h-[400px] lg:h-auto">
              <Image
                src={ctaConfig.image}
                alt="Loyola College Building"
                fill
                className="object-cover"
              />
              {/* GREEN GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
