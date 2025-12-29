// app/sys-ops/master-data/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  course_name: string;
  degree_id: number;
}

interface Degree {
  id: number;
  degree_name: string;
  program_level_id: number;
}

interface Program {
  id: number;
  discipline: string;
}

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    course_name: "",
    degree_id: "",
  });

  useEffect(() => {
    fetchCourses();
    fetchDegrees();
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
      console.error("Error fetching programs:", error);
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await fetch("/api/degrees");
      if (response.ok) {
        const data = await response.json();
        setDegrees(data);
      }
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.course_name.trim() || !formData.degree_id) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: formData.course_name,
          degree_id: parseInt(formData.degree_id),
        }),
      });

      if (response.ok) {
        toast.success("Course added successfully");
        setFormData({ course_name: "", degree_id: "" });
        setIsAdding(false);
        fetchCourses();
      } else {
        toast.error("Failed to add course");
      }
    } catch (error) {
      toast.error("Error adding course");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.course_name.trim() || !formData.degree_id) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_name: formData.course_name,
          degree_id: parseInt(formData.degree_id),
        }),
      });

      if (response.ok) {
        toast.success("Course updated successfully");
        setEditingId(null);
        setFormData({ course_name: "", degree_id: "" });
        fetchCourses();
      } else {
        toast.error("Failed to update course");
      }
    } catch (error) {
      toast.error("Error updating course");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Course deleted successfully");
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      toast.error("Error deleting course");
    }
  };

  const startEdit = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      course_name: course.course_name,
      degree_id: course.degree_id.toString(),
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ course_name: "", degree_id: "" });
  };

  const getDegreeName = (degreeId: number) => {
    return degrees.find((d) => d.id === degreeId)?.degree_name || "Unknown";
  };

  const getProgramName = (degreeId: number) => {
    const degree = degrees.find((d) => d.id === degreeId);
    if (!degree) return "Unknown";
    return (
      programs.find((p) => p.id === degree.program_level_id)?.discipline ||
      "Unknown"
    );
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
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600 mt-1">Manage course offerings</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormData({ course_name: "", degree_id: "" });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#342D87] text-white rounded-lg hover:bg-[#2a2470] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {isAdding && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Course
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Course name (e.g., Computer Science)"
                  value={formData.course_name}
                  onChange={(e) =>
                    setFormData({ ...formData, course_name: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                />
                <select
                  value={formData.degree_id}
                  onChange={(e) =>
                    setFormData({ ...formData, degree_id: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                >
                  <option value="">Select Degree</option>
                  {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.degree_name}
                    </option>
                  ))}
                </select>
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
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingId === course.id ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <input
                        type="text"
                        value={formData.course_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            course_name: e.target.value,
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      />
                      <select
                        value={formData.degree_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            degree_id: e.target.value,
                          })
                        }
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#342D87] focus:border-transparent outline-none"
                      >
                        <option value="">Select Degree</option>
                        {degrees.map((degree) => (
                          <option key={degree.id} value={degree.id}>
                            {degree.degree_name}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(course.id)}
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
                          {course.course_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Degree: {getDegreeName(course.degree_id)} 
                          {course.id}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(course)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
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
