// app/sys-ops/master-data/programs/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Program {
  id: number;
  discipline: string;
}

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ discipline: "" });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/programs");
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.discipline.trim()) {
      toast.error("Please enter a program name");
      return;
    }

    try {
      const response = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Program added successfully");
        setFormData({ discipline: "" });
        setIsAdding(false);
        fetchPrograms();
      } else {
        toast.error("Failed to add program");
      }
    } catch (error) {
      toast.error("Error adding program");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.discipline.trim()) {
      toast.error("Please enter a program name");
      return;
    }

    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Program updated successfully");
        setEditingId(null);
        setFormData({ discipline: "" });
        fetchPrograms();
      } else {
        toast.error("Failed to update program");
      }
    } catch (error) {
      toast.error("Error updating program");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Program deleted successfully");
        fetchPrograms();
      } else {
        toast.error("Failed to delete program");
      }
    } catch (error) {
      toast.error("Error deleting program");
    }
  };

  const startEdit = (program: Program) => {
    setEditingId(program.id);
    setFormData({ discipline: program.discipline });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ discipline: "" });
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
              <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
              <p className="text-gray-600 mt-1">Manage program levels</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ discipline: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Program
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Program
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Program name (e.g., Undergraduate)"
                  value={formData.discipline}
                  onChange={(e) =>
                    setFormData({ discipline: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                />
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
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#342D87]"></div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No programs found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingId === program.id ? (
                    <>
                      <input
                        type="text"
                        value={formData.discipline}
                        onChange={(e) =>
                          setFormData({ discipline: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      />
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleUpdate(program.id)}
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
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {program.discipline}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(program)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
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
