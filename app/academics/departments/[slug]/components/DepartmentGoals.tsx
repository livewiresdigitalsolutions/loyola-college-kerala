import React from "react";
import { Target, Eye, Lightbulb } from "lucide-react";

interface DepartmentGoalsProps {
  goals: {
    vision: string;
    mission: string[];
    objectives: string[];
  };
}

export default function DepartmentGoals({ goals }: DepartmentGoalsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Vision & Mission
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Vision */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
            <p className="text-gray-700 leading-relaxed">{goals.vision}</p>
          </div>
          
          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission</h3>
            <ul className="space-y-3">
              {goals.mission.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Objectives */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Objectives</h3>
            <ul className="space-y-3">
              {goals.objectives.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
