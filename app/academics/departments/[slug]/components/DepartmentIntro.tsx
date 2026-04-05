"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionEntry {
  title: string;
  content: string;
}

interface DepartmentIntroProps {
  introduction: {
    title: string;
    description: string | string[];
    highlights: string[];
  };
  goals: {
    // New dynamic format
    accordions?: AccordionEntry[];
    // Legacy fixed fields (backwards-compatible)
    history?: string;
    vision?: string;
    mission?: string | string[];
    objectives?: string | string[];
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-6 text-gray-700 leading-relaxed border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

function renderStringOrArray(value: string | string[]) {
  if (typeof value === "string") {
    return <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: value }} />;
  }
  return (
    <ul className="space-y-2">
      {value.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-primary mt-1 font-bold">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DepartmentIntro({ introduction, goals }: DepartmentIntroProps) {
  if (!introduction || !goals) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Build unified accordion list: prefer new dynamic `accordions` array,
  // fall back to legacy fixed fields for backwards-compatibility
  const accordionItems: AccordionEntry[] = [];

  if (goals.accordions && goals.accordions.length > 0) {
    // New dynamic format
    goals.accordions.forEach((acc) => {
      if (acc.title && acc.content) {
        accordionItems.push(acc);
      }
    });
  } else {
    // Legacy format
    if (goals.history) accordionItems.push({ title: "History", content: goals.history });
    if (goals.vision) accordionItems.push({ title: "Vision", content: goals.vision });
    if (goals.mission) {
      const val = typeof goals.mission === "string" ? goals.mission : goals.mission.join("<br/>");
      if (val) accordionItems.push({ title: "Mission", content: val });
    }
    if (goals.objectives) {
      const val = typeof goals.objectives === "string" ? goals.objectives : goals.objectives.join("<br/>");
      if (val) accordionItems.push({ title: "Goal", content: val });
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Overview Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Overview
        </h2>

        <div className="space-y-4 mb-8">
          {typeof introduction.description === "string" ? (
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: introduction.description }} />
          ) : (
            (introduction.description || []).map((para, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {para}
              </p>
            ))
          )}
        </div>

        {(introduction.highlights || []).length > 0 && (
          <ul className="space-y-3 mb-8">
            {(introduction.highlights || []).map((highlight, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0"></span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-b border-gray-200 mt-4 mb-12"></div>

        {/* Dynamic Accordion Section */}
        {accordionItems.length > 0 && (
          <div className="space-y-4">
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={index}
                title={item.title}
                isOpen={openIndex === index}
                onToggle={() => toggleItem(index)}
              >
                <div
                  className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </AccordionItem>
            ))}
          </div>
        )}

        <div className="border-b border-gray-200 mt-12"></div>
      </div>
    </section>
  );
}
