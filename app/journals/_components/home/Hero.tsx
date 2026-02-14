import React from "react";

export default function Hero() {
  return (
    <div className="w-full bg-background pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="flex flex-col items-start gap-6">
          <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide">
            ISSN 0971-4960
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Loyola Journal of <br />
            <span className="text-primary">Social Sciences</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl font-light">
            Published since 1987, Loyola Journal of Social Sciences is a
            multidisciplinary, peer-reviewed biannual published by Loyola
            College of Social Sciences, Thiruvananthapuram, Kerala, which is an
            accredited institution at the FIVE STAR level (2001), Re-accredited
            at 'A' Grade with CGPA of 3.70 out of 4.00 (2007) and again
            Re-accredited at 'A' Grade with CGPA of 3.72 out of 4.00 (2014) by
            the National Assessment and Accreditation Council (NAAC), India.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
              View Current Issue
            </button>
            <button className="bg-background text-foreground border border-border px-6 py-3 rounded text-sm font-semibold hover:bg-muted transition-colors shadow-sm">
              Submit Article
            </button>
          </div>
        </div>

        {/* Right Column: Journal Cover */}
        <div className="flex justify-center lg:justify-end py-10">
          <div className="relative w-[300px] md:w-[360px] aspect-[0.7] bg-[#ECEE55] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out border-l-4 border-white/40 overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-white/20 pointer-events-none z-10"></div>

            <div className="absolute inset-0 p-8 flex flex-col font-sans">
              <div className="text-[52px] md:text-[64px] leading-[0.85] tracking-tighter text-black uppercase font-bold wrap-break-word -ml-1">
                OYOLA
                <br />
                OURNAL
                <br />
                OF
                <br />
                OCIAL
                <br />
                CIENCES
              </div>

              <div className="mt-auto z-20">
                <div className="text-xs font-medium text-black/80">
                  Volume 17
                </div>
                <div className="text-xl font-bold text-white drop-shadow-md">
                  Issue 2 | 2026
                </div>
              </div>
            </div>

            {/* Gradient Overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black/80 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
