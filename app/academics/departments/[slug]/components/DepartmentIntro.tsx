"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DepartmentIntroProps {
  introduction: {
    title: string;
    description: string[];
    highlights: string[];
  };
  goals: {
    vision: string;
    mission: string[];
    objectives: string[];
  };
}

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-lg font-bold text-primary">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6 text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DepartmentIntro({ introduction, goals }: DepartmentIntroProps) {
  if (!introduction || !goals) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Overview Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Overview
        </h2>

        <div className="space-y-4 mb-8">
          {introduction.description.map((para, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {introduction.highlights.length > 0 && (
          <ul className="space-y-3 mb-8">
            {introduction.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-b border-gray-200 mt-4 mb-12"></div>

        {/* History & Accordion Section */}
        <div className="space-y-4">
          <AccordionItem
            title="History"
            isOpen={openIndex === 0}
            onToggle={() => toggleItem(0)}
          >
            <p>{goals.vision}</p>
          </AccordionItem>

          <AccordionItem
            title="Vision"
            isOpen={openIndex === 1}
            onToggle={() => toggleItem(1)}
          >
            <p>{goals.vision}</p>
          </AccordionItem>

          <AccordionItem
            title="Mission"
            isOpen={openIndex === 2}
            onToggle={() => toggleItem(2)}
          >
            <ul className="space-y-2">
              {goals.mission.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem
            title="Goal"
            isOpen={openIndex === 3}
            onToggle={() => toggleItem(3)}
          >
            <ul className="space-y-2">
              {goals.objectives.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem
            title="Motto"
            isOpen={openIndex === 4}
            onToggle={() => toggleItem(4)}
          >
            <p className="italic">
              &ldquo;Excellence in Education, Service to Society&rdquo;
            </p>
          </AccordionItem>
        </div>

        <div className="border-b border-gray-200 mt-12"></div>
      </div>
    </section>
  );
}
