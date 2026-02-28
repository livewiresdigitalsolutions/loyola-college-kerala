import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function IqacHero() {
    return (
        <>
            {/* HERO SECTION WITH IMAGE AND GREEN OVERLAY */}
            <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                {/* BACKGROUND IMAGE */}
                <div className="absolute inset-0 z-0">

                    {/* GREEN GRADIENT OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
                    {/* ADDITIONAL DARK OVERLAY FOR TEXT READABILITY */}
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* HERO CONTENT */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-6 w-full">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider leading-tight">
                            Internal Quality Assurance Cell (IQAC)
                        </h1>
                    </div>
                </div>
            </section>
            {/* BREADCRUMB NAV */}
            <div className="bg-gray-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-2.5">
                    <nav className="flex items-center gap-1.5 text-xs text-gray-600 flex-wrap">
                        <Link href="/iqac/Home" className="hover:text-primary transition-colors font-medium">
                            Home
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/NAAC-Accreditation" className="hover:text-primary transition-colors">
                            NAAC Accreditation
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/SRR" className="hover:text-primary transition-colors">
                            SRR
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/AQARs" className="hover:text-primary transition-colors">
                            AQARs
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/AQARs-Formats" className="hover:text-primary transition-colors">
                            Formats
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/Activities" className="hover:text-primary transition-colors">
                            Activities
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/Feedback" className="hover:text-primary transition-colors">
                            Feedback
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/Documents" className="hover:text-primary transition-colors">
                            Documents
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/Contact-Us" className="hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <Link href="/iqac/Autonomy" className="hover:text-primary transition-colors">
                            Autonomy
                        </Link>
                    </nav>
                </div>
            </div>
            {/* IQAC BANNER IMAGE ;*/}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                <div className="w-1:1"></div>
                <div className="w-3:1"></div>
                <Image
                    src="/iqac/iqac-banner.png"
                    alt="Internal Quality Assurance Cell"
                    width={1600}
                    height={300}
                    className="w-3:4 h-auto object-cover"
                    priority
                />
                <div className="w-1:1"></div>
                <div className="w-1:1"></div>
            </div>
        </>
    );
}
