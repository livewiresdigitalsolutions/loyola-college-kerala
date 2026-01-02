"use client";

import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface AcademicYears {
  id: number;
  year_start: number;
  year_end: number;
  label: string;
  is_current: boolean;
}

export default function AcademicYearsPage() {
  const router = useRouter();
  const [years, setYears] = useState<AcademicYears[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    year_start: "",
    year_end: "",
    label: "",
    is_current: false,
  });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/academic-years');
      if (response.ok) {
        const data = await response.json();
        setYears(data);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.year_start.trim() || !formData.year_end.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const yearStart = parseInt(formData.year_start);
    const yearEnd = parseInt(formData.year_end);

    if (yearStart >= yearEnd) {
      toast.error("Start year must be less than end year");
      return;
    }

    try {
      const response = await fetch('/api/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year_start: yearStart,
          year_end: yearEnd,
          label: formData.label || `${yearStart}-${yearEnd}`,
          is_current: formData.is_current,
        }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Academic year added successfully");
        setFormData({ year_start: "", year_end: "", label: "", is_current: false });
        setIsAdding(false);
        await fetchYears();
      } else {
        toast.error(result.error || "Failed to add academic year");
      }
    } catch (error) {
      console.error('Error adding academic year:', error);
      toast.error("Failed to add academic year");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.year_start.trim() || !formData.year_end.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    const yearStart = parseInt(formData.year_start);
    const yearEnd = parseInt(formData.year_end);

    if (yearStart >= yearEnd) {
      toast.error("Start year must be less than end year");
      return;
    }

    try {
      const response = await fetch(`/api/academic-years/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year_start: yearStart,
          year_end: yearEnd,
          label: formData.label || `${yearStart}-${yearEnd}`,
          is_current: formData.is_current,
        }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Academic year updated successfully");
        setEditingId(null);
        setFormData({ year_start: "", year_end: "", label: "", is_current: false });
        await fetchYears();
      } else {
        toast.error(result.error || "Failed to update academic year");
      }
    } catch (error) {
      console.error('Error updating academic year:', error);
      toast.error("Failed to update academic year");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this academic year?")) return;

    try {
      const response = await fetch(`/api/academic-years/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Academic year deleted successfully");
        await fetchYears();
      } else {
        toast.error(result.error || "Failed to delete academic year");
      }
    } catch (error) {
      console.error('Error deleting academic year:', error);
      toast.error("Failed to delete academic year");
    }
  };

  const startEdit = (year: AcademicYears) => {
    setEditingId(year.id);
    setFormData({
      year_start: year.year_start.toString(),
      year_end: year.year_end.toString(),
      label: year.label || "",
      is_current: year.is_current || false,
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ year_start: "", year_end: "", label: "", is_current: false });
  };

  const toggleCurrent = async (year: AcademicYears) => {
    try {
      const response = await fetch(`/api/academic-years/${year.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_current: !year.is_current,
        }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(
          year.is_current
            ? "Academic year unmarked as current"
            : "Academic year marked as current"
        );
        await fetchYears();
      } else {
        toast.error("Failed to update academic year");
      }
    } catch (error) {
      console.error('Error toggling current year:', error);
      toast.error("Failed to update academic year");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Academic Years</h1>
              <p className="text-gray-600 mt-1">
                Manage academic year configurations for the application
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ year_start: "", year_end: "", label: "", is_current: false });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Academic Year
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Academic Year
              </h3>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Start Year (e.g., 2024)"
                    value={formData.year_start}
                    onChange={(e) =>
                      setFormData({ ...formData, year_start: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  />
                  <input
                    type="number"
                    placeholder="End Year (e.g., 2025)"
                    value={formData.year_end}
                    onChange={(e) =>
                      setFormData({ ...formData, year_end: e.target.value })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Label (optional, e.g., 2024-2025)"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) =>
                      setFormData({ ...formData, is_current: e.target.checked })
                    }
                    className="w-4 h-4 text-[#342D87] focus:ring-[#342D87] rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Set as current academic year
                  </span>
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
            </div>
          ) : years.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No academic years found</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Add Academic Year" to create one
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {years.map((year) => (
                <div
                  key={year.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    year.is_current
                      ? "border-[#342D87] bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {editingId === year.id ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          value={formData.year_start}
                          onChange={(e) =>
                            setFormData({ ...formData, year_start: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                        />
                        <input
                          type="number"
                          value={formData.year_end}
                          onChange={(e) =>
                            setFormData({ ...formData, year_end: e.target.value })
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.label}
                        onChange={(e) =>
                          setFormData({ ...formData, label: e.target.value })
                        }
                        placeholder="Label (optional)"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_current}
                          onChange={(e) =>
                            setFormData({ ...formData, is_current: e.target.checked })
                          }
                          className="w-4 h-4 text-[#342D87] focus:ring-[#342D87] rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Set as current academic year
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(year.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        {year.is_current && (
                          <Star className="w-5 h-5 text-[#342D87] fill-[#342D87]" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">
                              {year.year_start} - {year.year_end}
                            </p>
                            {year.is_current && (
                              <span className="text-xs bg-[#342D87] text-white px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {year.label && (
                            <p className="text-sm text-gray-500">{year.label}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleCurrent(year)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                            year.is_current
                              ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                          }`}
                          title={
                            year.is_current
                              ? "Unmark as current"
                              : "Mark as current"
                          }
                        >
                          <Star className="w-4 h-4" />
                          {year.is_current ? "Unmark" : "Mark Current"}
                        </button>
                        <button
                          onClick={() => startEdit(year)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(year.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
