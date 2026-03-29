import React from "react";
import Image from "next/image";

export default function PtaHero() {
  return (
    <>
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/loyola-building.png"
            alt="PTA"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider leading-tight">
              Parent Teacher Association
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
