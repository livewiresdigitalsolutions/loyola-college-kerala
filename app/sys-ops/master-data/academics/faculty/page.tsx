"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, ChevronUp, ChevronDown, Eye } from "lucide-react";
import TiptapEditor from "@/app/journals/_components/TiptapEditor";

// Available tab icons
const TAB_ICONS = [
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "BookOpen",      label: "Book Open" },
  { value: "Award",         label: "Award" },
  { value: "Presentation",  label: "Presentation" },
  { value: "Briefcase",     label: "Briefcase" },
  { value: "Users",         label: "Users" },
];

interface ProfileTab {
  id: string;
  label: string;
  icon: string;
  content: string;
}

interface FacultyMember {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone: string;
  image: string;
  department: string;
  category: string;
  pen: string;
  date_of_joining: string;
  profile_data: {
    tabs?: ProfileTab[];
    academic_qualifications?: string[];
    domain_expertise?: string[];
  } | null;
  sort_order: number;
}

const defaultForm = {
  name: "", designation: "", qualification: "", specialization: "",
  email: "", phone: "", image: "/assets/defaultprofile.png",
  department: "", category: "Teaching",
  pen: "", date_of_joining: "",
  profile_data: {
    tabs: [] as ProfileTab[],
    academic_qualifications: [] as string[],
    domain_expertise: [] as string[],
  },
};

export default function FacultyManagement() {
  const router = useRouter();
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filterDept, setFilterDept] = useState("All");
  const [showNewDept, setShowNewDept] = useState(false);
  const [newDeptValue, setNewDeptValue] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState("");
  const [allDepartments, setAllDepartments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [activeProfileTab, setActiveProfileTab] = useState<string>("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/academics/faculty");
      if (res.ok) setFaculty(await res.json());
    } catch { toast.error("Failed to load faculty"); }
    finally { setLoading(false); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/academics/departments");
      if (res.ok) {
        const data = await res.json();
        setAllDepartments(data.map((d: any) => d.name).filter(Boolean));
      }
    } catch {}
  };

  useEffect(() => { fetchData(); fetchDepartments(); }, []);

  const departments = ["All", ...Array.from(new Set(faculty.map((f) => f.department).filter(Boolean)))] as string[];
  const filtered = filterDept === "All" ? faculty : faculty.filter((f) => f.department === filterDept);

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= filtered.length) return;

    const current = filtered[index];
    const swap = filtered[swapIndex];
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
        body: JSON.stringify({ table: "faculty", items: updates }),
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
      const res = await fetch("/api/academics/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/academics/faculty/${editing.id}` : "/api/academics/faculty";
      const method = editing ? "PUT" : "POST";
      const payload = { ...form, sort_order: editing?.sort_order ?? faculty.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Faculty updated" : "Faculty added");
      setShowForm(false); setEditing(null); setForm(defaultForm);
      fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this faculty member?")) return;
    try {
      const res = await fetch(`/api/academics/faculty/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted"); fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (f: FacultyMember) => {
    setEditing(f);

    const profileData = f.profile_data || { tabs: [], academic_qualifications: [], domain_expertise: [] };

    setForm({
      name: f.name,
      designation: f.designation,
      qualification: f.qualification || "",
      specialization: f.specialization || "",
      email: f.email || "",
      phone: f.phone || "",
      image: f.image || "/assets/defaultprofile.png",
      department: f.department || "",
      category: f.category || "Teaching",
      pen: f.pen || "",
      date_of_joining: f.date_of_joining || "",
      profile_data: {
        tabs: profileData.tabs || [],
        academic_qualifications: profileData.academic_qualifications || [],
        domain_expertise: profileData.domain_expertise || [],
      },
    });

    const tabs = profileData.tabs || [];
    if (tabs.length > 0) setActiveProfileTab(tabs[0].id);

    setShowForm(true);
    setActiveTab("basic");
  };

  // ── Profile tab helpers ──────────────────────────────────
  const addProfileTab = () => {
    const newTab: ProfileTab = {
      id: `tab_${Date.now()}`,
      label: "New Tab",
      icon: "BookOpen",
      content: "",
    };
    const tabs = [...(form.profile_data.tabs || []), newTab];
    setForm({ ...form, profile_data: { ...form.profile_data, tabs } });
    setActiveProfileTab(newTab.id);
  };

  const removeProfileTab = (tabId: string) => {
    const tabs = (form.profile_data.tabs || []).filter(t => t.id !== tabId);
    setForm({ ...form, profile_data: { ...form.profile_data, tabs } });
    setActiveProfileTab(tabs.length > 0 ? tabs[0].id : "");
  };

  const updateProfileTab = (tabId: string, updates: Partial<ProfileTab>) => {
    const tabs = (form.profile_data.tabs || []).map(t => t.id === tabId ? { ...t, ...updates } : t);
    setForm({ ...form, profile_data: { ...form.profile_data, tabs } });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/academics")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div><h1 className="text-2xl font-bold text-gray-900">Faculty &amp; Staffs</h1><p className="text-gray-600 text-sm">Manage faculty members ({faculty.length} total)</p></div>
        </div>
      </div>

      {/* Filters + Add */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {departments.length > 2 && (
          <div className="flex gap-2 flex-wrap">
            {departments.map((d) => (
              <button key={d} onClick={() => setFilterDept(d)} className={`px-3 py-1.5 rounded-lg text-sm ${filterDept === d ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"}`}>{d}</button>
            ))}
          </div>
        )}
        <button onClick={() => { setEditing(null); setForm(defaultForm); setShowForm(true); setActiveTab("basic"); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Faculty
        </button>
      </div>

      {/* ── FORM ── */}
      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">{editing ? "Edit" : "Add"} Faculty Member</h3>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b overflow-x-auto">
            {["basic", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab === "basic" ? "Basic Info" : "Profile Details (Tabs)"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6">

            {/* ── BASIC INFO TAB ── */}
            <div className={activeTab === "basic" ? "block" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Dr. John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. Assistant Professor" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PEN Number</label>
                  <input placeholder="e.g. 745218" value={form.pen} onChange={(e) => setForm({ ...form, pen: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input placeholder="e.g. MA, PhD" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input placeholder="e.g. Cybersecurity" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                  <input placeholder="e.g. 23 February 2015" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input placeholder="e.g. name@college.edu" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input placeholder="e.g. 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  {!showNewDept ? (
                    <select value={form.department} onChange={(e) => { if (e.target.value === "__add_new__") { setShowNewDept(true); setNewDeptValue(""); } else setForm({ ...form, department: e.target.value }); }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none">
                      <option value="">Select Department</option>
                      {allDepartments.map((d) => (<option key={d} value={d}>{d}</option>))}
                      <option value="__add_new__">+ Add New Department</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input autoFocus placeholder="Department name" value={newDeptValue} onChange={(e) => setNewDeptValue(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                      <button type="button" onClick={() => { if (newDeptValue.trim()) { setForm({ ...form, department: newDeptValue.trim() }); setShowNewDept(false); } }} className="px-3 py-2 bg-primary text-white rounded-lg text-sm">Add</button>
                      <button type="button" onClick={() => setShowNewDept(false)} className="px-3 py-2 border rounded-lg text-sm">Cancel</button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  {!showNewCategory ? (
                    <select value={form.category} onChange={(e) => { if (e.target.value === "__add_new__") { setShowNewCategory(true); setNewCategoryValue(""); } else setForm({ ...form, category: e.target.value }); }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none">
                      <option value="Teaching">Teaching</option>
                      <option value="Non-Teaching">Non-Teaching</option>
                      {customCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                      <option value="__add_new__">+ Add New Category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input autoFocus placeholder="Category name" value={newCategoryValue} onChange={(e) => setNewCategoryValue(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                      <button type="button" onClick={() => { if (newCategoryValue.trim()) { setCustomCategories([...customCategories, newCategoryValue.trim()]); setForm({ ...form, category: newCategoryValue.trim() }); setShowNewCategory(false); } }} className="px-3 py-2 bg-primary text-white rounded-lg text-sm">Add</button>
                      <button type="button" onClick={() => setShowNewCategory(false)} className="px-3 py-2 border rounded-lg text-sm">Cancel</button>
                    </div>
                  )}
                </div>

                {/* Profile Image */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border shadow-sm"><Image src={form.image} alt="Preview" fill className="object-cover" /></div>
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">
                      <Upload className="w-4 h-4" /> {form.image && form.image !== "/assets/defaultprofile.png" ? "Change Photo" : "Upload Photo"}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Quick Qualifications List */}
                <div className="lg:col-span-3 border-t pt-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Qualifications */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Academic Qualifications (for profile cards)</label>
                        <button type="button" onClick={() => setForm({ ...form, profile_data: { ...form.profile_data, academic_qualifications: [...(form.profile_data.academic_qualifications || []), ""] } })} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add</button>
                      </div>
                      <div className="space-y-2">
                        {(form.profile_data.academic_qualifications || []).map((q, i) => (
                          <div key={i} className="flex gap-2">
                            <input value={q} onChange={(e) => { const arr = [...(form.profile_data.academic_qualifications || [])]; arr[i] = e.target.value; setForm({ ...form, profile_data: { ...form.profile_data, academic_qualifications: arr } }); }} placeholder="e.g. Post Doctoral in Sociology" className="flex-1 px-3 py-1.5 border rounded-lg text-sm" />
                            <button type="button" onClick={() => { const arr = (form.profile_data.academic_qualifications || []).filter((_, idx) => idx !== i); setForm({ ...form, profile_data: { ...form.profile_data, academic_qualifications: arr } }); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        {(form.profile_data.academic_qualifications || []).length === 0 && <p className="text-xs text-gray-400">No qualifications added. Will use the Qualification field above.</p>}
                      </div>
                    </div>

                    {/* Domain Expertise */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Domain Expertise</label>
                        <button type="button" onClick={() => setForm({ ...form, profile_data: { ...form.profile_data, domain_expertise: [...(form.profile_data.domain_expertise || []), ""] } })} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add</button>
                      </div>
                      <div className="space-y-2">
                        {(form.profile_data.domain_expertise || []).map((d, i) => (
                          <div key={i} className="flex gap-2">
                            <input value={d} onChange={(e) => { const arr = [...(form.profile_data.domain_expertise || [])]; arr[i] = e.target.value; setForm({ ...form, profile_data: { ...form.profile_data, domain_expertise: arr } }); }} placeholder="e.g. Medical Sociology" className="flex-1 px-3 py-1.5 border rounded-lg text-sm" />
                            <button type="button" onClick={() => { const arr = (form.profile_data.domain_expertise || []).filter((_, idx) => idx !== i); setForm({ ...form, profile_data: { ...form.profile_data, domain_expertise: arr } }); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ))}
                        {(form.profile_data.domain_expertise || []).length === 0 && <p className="text-xs text-gray-400">No expertise added. Will use the Specialization field above.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PROFILE DETAILS TAB ── */}
            <div className={activeTab === "profile" ? "block" : "hidden"}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900">Profile Page Tabs</h4>
                  <p className="text-xs text-gray-500 mt-0.5">These tabs appear on the faculty members public profile page</p>
                </div>
                <button
                  type="button"
                  onClick={addProfileTab}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Tab
                </button>
              </div>

              {(form.profile_data.tabs || []).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No profile tabs yet.</p>
                  <p className="text-gray-400 text-sm">Click "Add Tab" to add sections like Education, Publications, Awards, etc.</p>
                </div>
              ) : (
                <div className="flex gap-6">
                  {/* Tab list sidebar */}
                  <div className="w-52 shrink-0 space-y-1">
                    {(form.profile_data.tabs || []).map((tab, idx) => (
                      <div key={tab.id} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${activeProfileTab === tab.id ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                        onClick={() => setActiveProfileTab(tab.id)}>
                        <span className="flex-1 truncate">{tab.label || "Unnamed"}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeProfileTab(tab.id); }} className={`p-0.5 rounded ${activeProfileTab === tab.id ? "hover:bg-white/20 text-white" : "hover:bg-red-100 text-red-500"}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Tab editor */}
                  {activeProfileTab && (() => {
                    const tab = (form.profile_data.tabs || []).find(t => t.id === activeProfileTab);
                    if (!tab) return null;
                    return (
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tab Label</label>
                            <input value={tab.label} onChange={(e) => updateProfileTab(tab.id, { label: e.target.value })} placeholder="e.g. Publications" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/30 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                            <select value={tab.icon} onChange={(e) => updateProfileTab(tab.id, { icon: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/30 outline-none">
                              {TAB_ICONS.map(icon => (
                                <option key={icon.value} value={icon.value}>{icon.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                          <TiptapEditor
                            content={tab.content || ""}
                            onChange={(html) => updateProfileTab(tab.id, { content: html })}
                            minimal={false}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3 pt-6 border-t">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">
                {editing ? "Update Faculty" : "Save Faculty"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-600 w-16">Order</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Image</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Designation</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Department</th>
              <th className="text-left p-4 text-sm font-medium text-gray-600">Category</th>
              <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f, i) => (
              <tr key={f.id} className="border-t hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex flex-col items-center gap-0.5">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === filtered.length - 1} className={`p-0.5 rounded ${i === filtered.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                  </div>
                </td>
                <td className="p-4"><div className="relative w-10 h-10 rounded-full overflow-hidden"><Image src={f.image || "/assets/defaultprofile.png"} alt={f.name} fill className="object-cover" /></div></td>
                <td className="p-4">
                  <div className="font-medium">{f.name}</div>
                  <div className="text-xs text-gray-400">{f.qualification}</div>
                  {f.pen && <div className="text-xs text-amber-600 font-medium">PEN: {f.pen}</div>}
                </td>
                <td className="p-4 text-sm text-gray-600">{f.designation}</td>
                <td className="p-4 text-sm text-gray-500">{f.department || "-"}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${f.category === "Teaching" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>{f.category}</span></td>
                <td className="p-4 text-right">
                  <a href={`/academics/faculty-and-staffs/${f.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex p-1.5 hover:bg-gray-100 rounded text-gray-600 mr-1" title="View Profile"><Eye className="w-4 h-4" /></a>
                  <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(f.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-400">No faculty members found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
