"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Eye, ChevronUp, ChevronDown } from "lucide-react";

interface Department {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  category: string;
  image: string;
  introduction: any;
  goals: any;
  eligibility: any;
  programmes: any;
  syllabus: any;
  faculty_list: any;
  sort_order: number;
}

const defaultForm = {
  name: "",
  short_description: "",
  category: "",
  image: "/departmentsCoverImage/default.png",
};

export default function DepartmentsManagement() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/academics/departments");
      if (res.ok) setDepartments(await res.json());
    } catch {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique categories from existing departments
  const existingCategories = Array.from(
    new Set(departments.map((d) => d.category).filter(Boolean))
  ) as string[];

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= departments.length) return;
    const current = departments[index];
    const swap = departments[swapIndex];
    const updates = [
      { id: current.id, sort_order: swap.sort_order },
      { id: swap.id, sort_order: current.sort_order },
    ];
    if (current.sort_order === swap.sort_order) {
      updates[0].sort_order = swapIndex;
      updates[1].sort_order = index;
    }
    try {
      const res = await fetch("/api/academics/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "departments", items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/academics/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "__add_new__") {
      setShowNewCategory(true);
      setNewCategory("");
    } else {
      setForm({ ...form, category: value });
      setShowNewCategory(false);
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setForm({ ...form, category: newCategory.trim() });
      setShowNewCategory(false);
      setNewCategory("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = generateSlug(form.name);

      // Build payload — preserve existing JSON data when editing
      const payload: any = {
        name: form.name,
        slug,
        short_description: form.short_description || null,
        category: form.category || null,
        image: form.image,
        sort_order: 0,
      };

      // When editing, keep the existing complex data untouched
      if (editing) {
        payload.introduction = editing.introduction;
        payload.goals = editing.goals;
        payload.eligibility = editing.eligibility;
        payload.programmes = editing.programmes;
        payload.syllabus = editing.syllabus;
        payload.faculty_list = editing.faculty_list;
      }

      const url = editing
        ? `/api/academics/departments/${editing.id}`
        : "/api/academics/departments";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Department updated" : "Department added");
      setShowForm(false);
      setEditing(null);
      setForm(defaultForm);
      setShowNewCategory(false);
      fetchData();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this department?")) return;
    try {
      const res = await fetch(`/api/academics/departments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openEdit = (d: Department) => {
    setEditing(d);
    setForm({
      name: d.name,
      short_description: d.short_description || "",
      category: d.category || "",
      image: d.image || "/departmentsCoverImage/default.png",
    });
    setShowForm(true);
    setShowNewCategory(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/sys-ops/master-data/academics")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600 text-sm">
              Manage academic departments ({departments.length} total)
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm(defaultForm);
            setShowForm(true);
            setShowNewCategory(false);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editing ? "Edit" : "Add"} Department
            </h3>
            <button onClick={() => setShowForm(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="e.g. Department of Computer Science"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                placeholder="Brief description of the department..."
                value={form.short_description}
                onChange={(e) =>
                  setForm({ ...form, short_description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              {!showNewCategory ? (
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__add_new__">+ Add New Category</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    placeholder="Enter new category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border bg-gray-50">
                  <Image
                    src={form.image}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm transition-colors">
                  <Upload className="w-4 h-4" /> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                {editing ? "Update Department" : "Add Department"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d, i) => (
          <div
            key={d.id}
            className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-36 bg-gray-100">
              <Image
                src={d.image || "/departmentsCoverImage/default.png"}
                alt={d.name}
                fill
                className="object-cover"
              />
              {d.category && (
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full text-primary">
                  {d.category}
                </span>
              )}
              {/* Reorder arrows */}
              <div className="absolute top-2 right-2 flex flex-col gap-0.5">
                <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-1 rounded bg-white/90 backdrop-blur-sm ${i === 0 ? "text-gray-300" : "text-gray-600 hover:bg-white"}`}><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => handleReorder(i, "down")} disabled={i === departments.length - 1} className={`p-1 rounded bg-white/90 backdrop-blur-sm ${i === departments.length - 1 ? "text-gray-300" : "text-gray-600 hover:bg-white"}`}><ChevronDown className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{d.name}</h3>
              {d.short_description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {d.short_description}
                </p>
              )}
              <div className="flex gap-3">
                <a
                  href={`/academics/departments/${d.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </a>
                <button
                  onClick={() => openEdit(d)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            No departments yet. Click &quot;Add Department&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
