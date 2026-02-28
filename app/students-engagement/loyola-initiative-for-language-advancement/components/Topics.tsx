"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

const curriculum = [
  "Functional Structures include, Tense Structures, Sentence Structures, Clause Structures, Active and Passive Voices, Reported Speech, Yes or No Questions.",
  "Functional Components include Parts of Speech, List of Irregular Verbs, Grammatical Persons, Forms of Main Verbs, Tense- Usages, Pronouns, Uses of Articles, Prepositions, Question Tag, Subject-Verb agreement.",
  "Functional Skills include The Art of pronunciation, (Phonetic symbols, accent and intonation), The Art of Reading, The Art of Effective Listening, The Art of Public Speaking, Voice Culture (tongue twisters), and Memory Lesson, Polite Expressions, and Word power.",
];

export default function Topics() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors"
      >
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C]">Topics</h2>
        <ChevronUp
          className={`w-5 h-5 text-[#13432C] transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      <hr className="border-gray-200" />

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-8">
          <h3 className="text-lg font-bold text-gray-900 mb-5">LILA Curriculum</h3>
          <ul className="space-y-4">
            {curriculum.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                <span className="text-gray-700 text-[15px] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </section>
  );
}
