"use client";

import { SubjectMark } from "@/types/admission";
import { toast } from "react-hot-toast";

interface AcademicRecordsTabProps {
  form: any;
  programLevelId: string;
  isFormLocked: boolean;
  twelfthSubjects: SubjectMark[];
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubjectChange: (
    index: number,
    field: keyof SubjectMark,
    value: any
  ) => void;
  addSubject: () => void;
  removeSubject: (index: number) => void;
}

export default function AcademicRecordsTab({
  form,
  programLevelId,
  isFormLocked,
  twelfthSubjects,
  handleChange,
  handleSubjectChange,
  addSubject,
  removeSubject,
}: AcademicRecordsTabProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 10th Standard */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          10th Standard Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Register Number
            </label>
            <input
              type="text"
              name="tenth_register_number"
              value={form.tenth_register_number || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Board *
            </label>
            <input
              type="text"
              name="tenth_board"
              value={form.tenth_board || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., CBSE, State Board"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              School Name *
            </label>
            <input
              type="text"
              name="tenth_school"
              value={form.tenth_school || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Year of Passing *
            </label>
            <input
              type="text"
              name="tenth_year"
              value={form.tenth_year || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Percentage *
            </label>
            <input
              type="text"
              name="tenth_percentage"
              value={form.tenth_percentage || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., 85.5"
            />
          </div>
        </div>
      </div>

      {/* 12th Standard */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          12th Standard Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Register Number
            </label>
            <input
              type="text"
              name="twelfth_register_number"
              value={form.twelfth_register_number || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Board *
            </label>
            <input
              type="text"
              name="twelfth_board"
              value={form.twelfth_board || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., CBSE, State Board"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              School Name *
            </label>
            <input
              type="text"
              name="twelfth_school"
              value={form.twelfth_school || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Stream *
            </label>
            <input
              type="text"
              name="twelfth_stream"
              value={form.twelfth_stream || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., Science, Commerce, Arts"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Year of Passing *
            </label>
            <input
              type="text"
              name="twelfth_year"
              value={form.twelfth_year || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              maxLength={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Percentage *
            </label>
            <input
              type="text"
              name="twelfth_percentage"
              value={form.twelfth_percentage || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="e.g., 85.5"
            />
          </div>
        </div>

        {/* Subject-wise Marks */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-700">Subject-wise Marks</h4>
            {!isFormLocked && (
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                + Add Subject
              </button>
            )}
          </div>

          <div className="space-y-4">
            {twelfthSubjects.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={subject.subject_name}
                    onChange={(e) =>
                      handleSubjectChange(index, "subject_name", e.target.value)
                    }
                    disabled={isFormLocked}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., Physics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    value={subject.marks_obtained || ""}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "marks_obtained",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    disabled={isFormLocked}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., 85"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    value={subject.max_marks || ""}
                    onChange={(e) =>
                      handleSubjectChange(
                        index,
                        "max_marks",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    disabled={isFormLocked}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="flex items-end">
                  {subject.percentage && (
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Percentage
                      </label>
                      <div className="px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm font-semibold text-blue-600">
                        {typeof subject.percentage === "number"
                          ? subject.percentage.toFixed(2)
                          : parseFloat(String(subject.percentage)).toFixed(2)}
                        %
                      </div>
                    </div>
                  )}

                  {!isFormLocked && twelfthSubjects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UG Details - Only for PG and PhD */}
      {(programLevelId === "2" || programLevelId === "3") && (
        <div>
          <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
            Undergraduate (UG) Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                University *
              </label>
              <input
                type="text"
                name="ug_university"
                value={form.ug_university || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                College Name *
              </label>
              <input
                type="text"
                name="ug_college"
                value={form.ug_college || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Degree *
              </label>
              <input
                type="text"
                name="ug_degree"
                value={form.ug_degree || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., B.Sc Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Year of Passing *
              </label>
              <input
                type="text"
                name="ug_year"
                value={form.ug_year || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Percentage/CGPA *
              </label>
              <input
                type="text"
                name="ug_percentage"
                value={form.ug_percentage || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., 85.5 or 8.5"
              />
            </div>
          </div>
        </div>
      )}

      {/* PG Details - Only for PhD */}
      {programLevelId === "3" && (
        <div>
          <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
            Postgraduate (PG) Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                University *
              </label>
              <input
                type="text"
                name="pg_university"
                value={form.pg_university || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                College Name *
              </label>
              <input
                type="text"
                name="pg_college"
                value={form.pg_college || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Degree *
              </label>
              <input
                type="text"
                name="pg_degree"
                value={form.pg_degree || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., M.Sc Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Year of Passing *
              </label>
              <input
                type="text"
                name="pg_year"
                value={form.pg_year || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                maxLength={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="YYYY"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Percentage/CGPA *
              </label>
              <input
                type="text"
                name="pg_percentage"
                value={form.pg_percentage || ""}
                onChange={handleChange}
                disabled={isFormLocked}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="e.g., 85.5 or 8.5"
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div>
        <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-blue-200">
          Additional Information (Optional)
        </h3>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Previous Education Gap (if any)
            </label>
            <textarea
              name="previous_gap"
              value={form.previous_gap || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Explain any gap in your education"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Extracurricular Activities
            </label>
            <textarea
              name="extracurricular"
              value={form.extracurricular || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Sports, clubs, volunteering, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Achievements & Awards
            </label>
            <textarea
              name="achievements"
              value={form.achievements || ""}
              onChange={handleChange}
              disabled={isFormLocked}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Academic awards, competitions, certifications, etc."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
