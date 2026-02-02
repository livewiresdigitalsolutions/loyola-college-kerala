"use client";

import { Home } from "lucide-react";

const Back: React.FC = () => {
  return (
    <section>
      {/* Fixed Back to Home Button - Left Side */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999] group">
        <a
          href="https://loyolacollegekerala.edu.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center bg-primary px-3 py-4 text-white font-semibold shadow-lg rounded-r-lg hover:bg-yellow-600 transition-all duration-200"
        >
          <Home size={20} className="flex-shrink-0" />
          <span className="writing-mode-vertical text-sm tracking-wider opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[300px] group-hover:mt-2 transition-all duration-300 overflow-hidden whitespace-nowrap">
            BACK TO HOME
          </span>
        </a>
      </div>
      
      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
        }
      `}</style>
    </section>
  );
};

export default Back;
