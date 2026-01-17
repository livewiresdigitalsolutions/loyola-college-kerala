import React from "react";
import { CheckCircle } from "lucide-react";

interface DepartmentIntroProps {
  introduction: {
    title: string;
    description: string[];
    highlights: string[];
  };
}

export default function DepartmentIntro({ introduction }: DepartmentIntroProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          {introduction.title}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Description */}
          <div className="space-y-6">
            {introduction.description.map((para, index) => (
              <p key={index} className="text-gray-700 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>
          
          {/* Highlights */}
          <div className="bg-primary/5 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-primary mb-6">
              Key Highlights
            </h3>
            <ul className="space-y-4">
              {introduction.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
