import { FileText } from "lucide-react";
import { AssociationData } from "../_data/associations";

interface ActivitiesProps {
  data: AssociationData;
}

export default function Activities({ data }: ActivitiesProps) {
  return (
    <section
      id="activities"
      className="scroll-mt-32 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-10 h-[3px] bg-[#F0B129] rounded-full" />
          <span className="text-sm font-bold tracking-widest text-[var(--primary)] uppercase">
            Activities &amp; Archives
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Current Activities — left column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Current Activities
            </h3>
            <div className="space-y-3">
              {data.activities.map((activity, idx) => (
                <div
                  key={activity.id || idx}
                  className="bg-white rounded-lg border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {activity.title}
                    </p>
                    {activity.date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.date}
                        {activity.location ? ` · ${activity.location}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {data.activities.length === 0 && (
                <p className="text-sm text-gray-400 italic py-4">
                  No activities listed yet.
                </p>
              )}
            </div>
          </div>

          {/* Archives — right column */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Archives</h3>
            <div className="space-y-3">
              {/* Placeholder: archives can be added later via admin */}
              <p className="text-sm text-gray-400 italic py-4">
                No archives available yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
