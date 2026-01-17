import React from "react";
import { GraduationCap, BookOpen, FlaskConical } from "lucide-react";
import { Programme } from "../../data/types";

interface ProgrammesSectionProps {
  programmes: {
    ug: Programme[];
    pg: Programme[];
    research: Programme[];
  };
}

export default function ProgrammesSection({ programmes }: ProgrammesSectionProps) {
  const renderProgrammes = (progs: Programme[], icon: React.ReactNode, title: string) => {
    if (progs.length === 0) return null;
    
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {progs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border-2 border-gray-100 p-6 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300"
            >
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                {prog.name}
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Duration:</span> {prog.duration}
                </p>
                <p>
                  <span className="font-semibold">Eligibility:</span> {prog.eligibility}
                </p>
                {prog.seats && (
                  <p>
                    <span className="font-semibold">Seats:</span> {prog.seats}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Programmes Offered
        </h2>
        
        {renderProgrammes(
          programmes.ug,
          <GraduationCap className="w-8 h-8 text-primary" />,
          "Undergraduate Programmes"
        )}
        
        {renderProgrammes(
          programmes.pg,
          <BookOpen className="w-8 h-8 text-primary" />,
          "Postgraduate Programmes"
        )}
        
        {renderProgrammes(
          programmes.research,
          <FlaskConical className="w-8 h-8 text-primary" />,
          "Research Programmes"
        )}
      </div>
    </section>
  );
}
