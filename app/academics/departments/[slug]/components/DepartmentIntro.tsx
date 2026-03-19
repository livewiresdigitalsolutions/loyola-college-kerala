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
    history?: string;
    vision?: string;
    mission?: string[];
    objectives?: string[];
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
    <div className="border border-gray-200 rounded-sm overflow-hidden bg-white mb-4">
      <button
        onClick={onToggle}
        style={{ backgroundColor: "#F6F6EE" }}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
      >
        <span className="text-lg font-bold text-primary">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-6 text-gray-700 leading-relaxed border-t border-gray-100">
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
          {typeof introduction.description === 'string' ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: introduction.description }} />
          ) : (
            introduction.description.map((para, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {para}
              </p>
            ))
          )}
        </div>

        {introduction.highlights.length > 0 && (
          <ul className="space-y-3 mb-8">
            {introduction.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-b border-gray-200 mt-4 mb-12"></div>

        {/* History & Accordion Section */}
        <div className="space-y-4">
          {goals?.history && (
            <AccordionItem
              title="History"
              isOpen={openIndex === 0}
              onToggle={() => toggleItem(0)}
            >
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: goals.history }} />
            </AccordionItem>
          )}

          {goals?.vision && (
            <AccordionItem
              title="Vision"
              isOpen={openIndex === 1}
              onToggle={() => toggleItem(1)}
            >
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: goals.vision }} />
            </AccordionItem>
          )}

          {goals?.mission && (goals.mission.length > 0 || typeof goals.mission === 'string') && (
            <AccordionItem
              title="Mission"
              isOpen={openIndex === 2}
              onToggle={() => toggleItem(2)}
            >
              {typeof goals.mission === 'string' ? (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: goals.mission }} />
              ) : (
                  <ul className="space-y-2">
                    {goals.mission.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
              )}
            </AccordionItem>
          )}

          {goals?.objectives && (goals.objectives.length > 0 || typeof goals.objectives === 'string') && (
            <AccordionItem
              title="Goal"
              isOpen={openIndex === 3}
              onToggle={() => toggleItem(3)}
            >
              {typeof goals.objectives === 'string' ? (
                  <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: goals.objectives }} />
              ) : (
                  <ul className="space-y-2">
                    {goals.objectives.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
              )}
            </AccordionItem>
          )}
        </div>

        <div className="border-b border-gray-200 mt-12"></div>
      </div>
    </section>
  );
}
