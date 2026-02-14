import React from "react";
import JournalCard from "./JournalCard";

const archivesData = [
  { volume: "17", issue: "1", year: "2025" },
  { volume: "16", issue: "2", year: "2025" },
  { volume: "16", issue: "1", year: "2024" },
  { volume: "15", issue: "2", year: "2024" },
];

export default function Archives() {
  return (
    <section className="w-full bg-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Archives
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4">
          {archivesData.map((archive, index) => (
            <JournalCard
              key={`${archive.volume}-${archive.issue}`}
              volume={archive.volume}
              issue={archive.issue}
              year={archive.year}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm">
            View All Archives
          </button>
        </div>
      </div>
    </section>
  );
}
