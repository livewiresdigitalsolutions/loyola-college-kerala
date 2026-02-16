import React from "react";
import Link from "next/link";
import { Download } from "lucide-react";

interface JournalCardProps {
  volume: string;
  issue: string;
  year: string;
  pdfUrl?: string;
  coverImage?: string;
}

export default function JournalCard({ volume, issue, year, pdfUrl, coverImage }: JournalCardProps) {
  return (
    <div className="flex flex-col gap-4 group cursor-pointer">
      {/* Cover Card */}
      <div className="relative w-full aspect-[0.7] bg-[#ECEE55] shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden border border-transparent group-hover:border-primary/20">
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-black/5 to-white/20 pointer-events-none z-10"></div>

        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col font-sans">
          <div className="text-[32px] sm:text-[40px] leading-[0.85] tracking-tighter text-black uppercase font-bold wrap-break-word -ml-0.5">
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
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>

        {/* PDF Download Icon */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 z-20 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
            title="Download PDF"
          >
            <Download size={14} className="text-primary" />
          </a>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-foreground">
          Volume {volume}, Issue
        </h3>
        <p className="text-2xl font-bold text-foreground leading-none mt-1">
          {issue}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{year}</p>
      </div>
    </div>
  );
}
