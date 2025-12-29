// app/sys-ops/master-data/exam-centers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExamCenter {
  id: number;
  centre_name: string;
  location?: string;
}

export default function ExamCentersPage() {
  const router = useRouter();
  const [examCenters, setExamCenters] = useState<ExamCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    centre_name: "",
    location: "",
  });

  useEffect(() => {
    fetchExamCenters();
  }, []);

  const fetchExamCenters = async () => {
    try {
      const response = await fetch("/api/exam-centers");
      if (response.ok) {
        const data = await response.json();
        setExamCenters(data);
      }
    } catch (error) {
      toast.error("Failed to load exam centers");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.centre_name.trim()) {
      toast.error("Please enter a center name");
      return;
    }

    try {
      const response = await fetch("/api/exam-centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Exam center added successfully");
        setFormData({ centre_name: "", location: "" });
        setIsAdding(false);
        fetchExamCenters();
      } else {
        toast.error("Failed to add exam center");
      }
    } catch (error) {
      toast.error("Error adding exam center");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.centre_name.trim()) {
      toast.error("Please enter a center name");
      return;
    }

    try {
      const response = await fetch(`/api/exam-centers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Exam center updated successfully");
        setEditingId(null);
        setFormData({ centre_name: "", location: "" });
        fetchExamCenters();
      } else {
        toast.error("Failed to update exam center");
      }
    } catch (error) {
      toast.error("Error updating exam center");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam center?")) return;

    try {
      const response = await fetch(`/api/exam-centers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Exam center deleted successfully");
        fetchExamCenters();
      } else {
        toast.error("Failed to delete exam center");
      }
    } catch (error) {
      toast.error("Error deleting exam center");
    }
  };

  const startEdit = (center: ExamCenter) => {
    setEditingId(center.id);
    setFormData({
      centre_name: center.centre_name,
      location: center.location || "",
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ centre_name: "", location: "" });
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
              <h1 className="text-3xl font-bold text-gray-900">Exam Centers</h1>
              <p className="text-gray-600 mt-1">Manage exam center locations</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ centre_name: "", location: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exam Center
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Exam Center
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Center name (e.g., Chennai Main Campus)"
                  value={formData.centre_name}
                  onChange={(e) =>
                    setFormData({ ...formData, centre_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                />
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
          ) : examCenters.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No exam centers found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {examCenters.map((center) => (
                <div
                  key={center.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingId === center.id ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <input
                        type="text"
                        value={formData.centre_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            centre_name: e.target.value,
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            location: e.target.value,
                          })
                        }
                        placeholder="Location (optional)"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(center.id)}
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
                      <div>
                        <p className="font-semibold text-gray-900">
                          {center.centre_name}
                        </p>
                        {/* ✅ ADDED: Display location if it exists */}
                        {center.location && (
                          <p className="text-sm text-gray-500 mt-1">
                            {center.location}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(center)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(center.id)}
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
