"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

interface Topic { id: number; content: string; display_order: number; is_active: boolean; }

const LG = "#13432C";

const fallback: Topic[] = [
  { id: -1, content: "Functional Structures include, Tense Structures, Sentence Structures, Clause Structures, Active and Passive Voices, Reported Speech, Yes or No Questions.", display_order: 0, is_active: true },
  { id: -2, content: "Functional Components include Parts of Speech, List of Irregular Verbs, Grammatical Persons, Forms of Main Verbs, Tense- Usages, Pronouns, Uses of Articles, Prepositions, Question Tag, Subject-Verb agreement.", display_order: 1, is_active: true },
  { id: -3, content: "Functional Skills include The Art of pronunciation, (Phonetic symbols, accent and intonation), The Art of Reading, The Art of Effective Listening, The Art of Public Speaking, Voice Culture (tongue twisters), and Memory Lesson, Polite Expressions, and Word power.", display_order: 2, is_active: true },
];

export default function Topics() {
  const [isOpen, setIsOpen] = useState(true);
  const [topics, setTopics] = useState<Topic[]>(fallback);

  useEffect(() => {
    fetch("/api/students/loyola-initiative-for-language-advancement?type=topics")
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setTopics(d.data); })
      .catch(() => { });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="shadow-sm rounded-lg overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-5 bg-[#F6F6EE] rounded-t-lg hover:bg-[#ededdf] transition-colors">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: LG }}>Topics</h2>
          <ChevronUp className="w-5 h-5 transition-transform duration-300" style={{ color: LG, transform: isOpen ? "rotate(0deg)" : "rotate(180deg)" }} />
        </button>
        <hr className="border-gray-200" />
        {isOpen && (
          <div className="px-6 py-8">
            <h3 className="text-lg font-bold text-gray-900 mb-5">LILA Curriculum</h3>
            <ul className="space-y-4">
              {topics.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                  <span className="text-gray-700 text-[15px] leading-relaxed">{item.content}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
