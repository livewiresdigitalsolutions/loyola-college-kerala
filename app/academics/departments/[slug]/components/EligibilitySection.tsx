import React from "react";
import { CheckCircle, Award } from "lucide-react";

interface EligibilitySectionProps {
  eligibility: {
    criteria: string;
    indexCalculation: string;
    additionalInfo: string[];
    seats: number;
    weightage: {
      entrance: number;
      hsExam: number;
      interview: number;
    };
  };
}

export default function EligibilitySection({ eligibility }: EligibilitySectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Eligibility Criteria
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Seats & Weightage */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Basic Requirements
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {eligibility.criteria}
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                {eligibility.indexCalculation}
              </p>
            </div>

            {/* Selection Weightage */}
            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Selection Weightage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Entrance Examination</span>
                  <span className="text-xl font-bold text-primary">
                    {eligibility.weightage.entrance}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Higher Secondary Marks</span>
                  <span className="text-xl font-bold text-primary">
                    {eligibility.weightage.hsExam}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Interview</span>
                  <span className="text-xl font-bold text-primary">
                    {eligibility.weightage.interview}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Main Content */}
          <div className="space-y-6">
            {/* Seats Available */}
            <div className="bg-primary/5 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold text-primary">
                  {eligibility.seats}
                </span>
              </div>
              <p className="text-gray-700">Seats Available</p>
            </div>

            {/* Additional Requirements */}
            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Additional Requirements
              </h3>
              <ul className="space-y-4">
                {eligibility.additionalInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
