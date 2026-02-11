import React from "react";

const ShortInfo = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* Left Column - Heading */}
          <div>
            <div className="w-16 h-1 bg-primary mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Committed
              <br />
              to Academic
              <br />
              Excellence
            </h2>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6 text-gray-600 leading-relaxed font-light">
            <p>
              Our faculty comprises accomplished scholars and researchers who bring
              deep expertise, innovative teaching methodologies, and a genuine
              commitment to student success. With diverse academic backgrounds and
              extensive professional experience, they create a dynamic learning
              environment that challenges and inspires.
            </p>
            <p>
              Beyond teaching, our faculty are active researchers contributing to
              scholarly discourse through publications, conferences, and community
              engagement. They serve as mentors, guiding students through academic
              journeys and preparing them for meaningful careers in social sciences and
              allied fields.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShortInfo;
