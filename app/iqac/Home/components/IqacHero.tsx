import React from "react";
import Image from "next/image";
import IqacSubNavbar from "../../components/IqacSubNavbar";

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
            <IqacSubNavbar />
        </>
    );
}
