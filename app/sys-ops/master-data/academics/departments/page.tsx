"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Plus, Pencil, Trash2, X, Upload, Eye, ChevronUp, ChevronDown } from "lucide-react";
import TiptapEditor from "@/app/journals/_components/TiptapEditor";

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
  syllabus_links: any;
  publications: any;
  sort_order: number;
}

const defaultForm = {
  name: "",
  short_description: "",
  category: "",
  image: "/departmentsCoverImage/default.png",
  introduction: { title: "", description: [""], highlights: [""] },
  goals: { history: "", vision: "", mission: [""], objectives: [""] },
  faculty_list: [] as { id: string; name: string; designation: string; image: string }[],
  programmes: {
    ug: [] as { id: string; name: string; duration: string; eligibility: string; seats?: string }[],
    pg: [] as { id: string; name: string; duration: string; eligibility: string; seats?: string }[],
    research: [] as { id: string; name: string; duration: string; eligibility: string; seats?: string }[]
  },
  syllabus_links: [] as { label: string; url: string }[],
  publications: [] as { title: string; image: string; items: string[]; viewAllLink?: string }[]
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
  const [activeTab, setActiveTab] = useState("basic");

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

  const existingCategories = Array.from(
    new Set(departments.map((d) => d.category).filter(Boolean))
  ) as string[];

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
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
      callback(url);
      toast.success("File uploaded");
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
    if (!form.name.trim()) {
        toast.error("Please provide a department name.");
        setActiveTab("basic");
        return;
    }
    try {
      const slug = generateSlug(form.name);

      const payload: any = {
        name: form.name,
        slug,
        short_description: form.short_description || null,
        category: form.category || null,
        image: form.image,
        introduction: form.introduction,
        goals: form.goals,
        faculty_list: form.faculty_list,
        programmes: form.programmes,
        syllabus_links: form.syllabus_links,
        publications: form.publications,
        sort_order: editing ? editing.sort_order : 0,
      };

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
    
    // Ensure nested objects gracefully fall back to defaults if missing
    setForm({
      name: d.name,
      short_description: d.short_description || "",
      category: d.category || "",
      image: d.image || "/departmentsCoverImage/default.png",
      introduction: d.introduction || defaultForm.introduction,
      goals: d.goals || defaultForm.goals,
      faculty_list: d.faculty_list || [],
      programmes: d.programmes || defaultForm.programmes,
      syllabus_links: d.syllabus_links || [],
      publications: d.publications || []
    });
    
    setShowForm(true);
    setShowNewCategory(false);
    setActiveTab("basic");
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
        {!showForm && (
            <button
            onClick={() => {
                setEditing(null);
                setForm(defaultForm);
                setShowForm(true);
                setShowNewCategory(false);
                setActiveTab("basic");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
            <Plus className="w-4 h-4" /> Add Department
            </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              {editing ? "Edit" : "Add"} Department
            </h3>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex border-b">
            {["basic", "overview", "faculty", "programmes", "syllabus"].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"}`}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            
            {/* BASIC INFO TAB */}
            <div className={activeTab === "basic" ? "block" : "hidden"}>
                <div className="space-y-4 max-w-2xl">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        placeholder="e.g. Department of Computer Science"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                    </label>
                    <textarea
                        placeholder="Brief description of the department..."
                        value={form.short_description}
                        onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none"
                        rows={3}
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    {!showNewCategory ? (
                        <select
                        value={form.category || ""}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none"
                        >
                        <option value="">Select Category</option>
                        {existingCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="__add_new__">+ Add New Category</option>
                        </select>
                    ) : (
                        <div className="flex gap-2">
                        <input
                            placeholder="Enter category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 outline-none"
                            autoFocus
                        />
                        <button type="button" onClick={handleAddNewCategory} className="px-4 py-2 bg-primary text-white rounded-lg">Add</button>
                        <button type="button" onClick={() => setShowNewCategory(false)} className="px-3 py-2 border rounded-lg">Cancel</button>
                        </div>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-40 h-24 rounded-lg overflow-hidden border bg-gray-50">
                        <Image src={form.image} alt="Cover" fill className="object-cover" />
                        </div>
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                        <Upload className="w-4 h-4" /> Upload Cover
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setForm({...form, image: url}))} className="hidden" />
                        </label>
                    </div>
                    </div>
                </div>
            </div>

            {/* OVERVIEW TAB */}
            <div className={activeTab === "overview" ? "block space-y-8" : "hidden"}>
                
                {/* Introduction Section */}
                <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-4">Introduction Details</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Description (Overview)</label>
                            <div className="bg-white">
                                <TiptapEditor 
                                    minimal={true}
                                    content={typeof form.introduction.description === 'string' ? form.introduction.description : (form.introduction.description || []).join('<p><br/></p>')}
                                    onChange={(html) => setForm({...form, introduction: {...form.introduction, description: html as any}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium">Highlights</label>
                                <button type="button" onClick={() => setForm({...form, introduction: {...form.introduction, highlights: [...(form.introduction.highlights || []), ""]}})} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Highlight</button>
                            </div>
                            <div className="space-y-2">
                                {(form.introduction.highlights || []).map((item, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input value={item} onChange={(e) => {
                                            const newArr = [...form.introduction.highlights]; newArr[i] = e.target.value; setForm({...form, introduction: {...form.introduction, highlights: newArr}});
                                        }} className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-primary/30" placeholder="Highlight text..." />
                                        <button type="button" onClick={() => {
                                            const newArr = form.introduction.highlights.filter((_, idx) => idx !== i); setForm({...form, introduction: {...form.introduction, highlights: newArr}});
                                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                {(form.introduction.highlights || []).length === 0 && <span className="text-xs text-gray-500">No highlights added.</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goals Accordion Section */}
                <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-4">Goals (Accordions)</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">History</label>
                            <div className="bg-white">
                                <TiptapEditor 
                                    minimal={true}
                                    content={form.goals.history || ""}
                                    onChange={(html) => setForm({...form, goals: {...form.goals, history: html}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Vision</label>
                            <div className="bg-white">
                                <TiptapEditor 
                                    minimal={true}
                                    content={form.goals.vision || ""}
                                    onChange={(html) => setForm({...form, goals: {...form.goals, vision: html}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Mission</label>
                            <div className="bg-white">
                                <TiptapEditor 
                                    minimal={true}
                                    content={typeof form.goals.mission === 'string' ? form.goals.mission : (form.goals.mission || []).join('<p><br/></p>')}
                                    onChange={(html) => setForm({...form, goals: {...form.goals, mission: html as any}})} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Goal / Objectives</label>
                            <div className="bg-white">
                                <TiptapEditor 
                                    minimal={true}
                                    content={typeof form.goals.objectives === 'string' ? form.goals.objectives : (form.goals.objectives || []).join('<p><br/></p>')}
                                    onChange={(html) => setForm({...form, goals: {...form.goals, objectives: html as any}})} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* FACULTY TAB */}
            <div className={activeTab === "faculty" ? "block" : "hidden"}>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">Faculty Members</h4>
                    <button type="button" onClick={() => setForm({...form, faculty_list: [...form.faculty_list, {id: Date.now().toString(), name: "", designation: "", image: ""}]})} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">+ Add Faculty</button>
                </div>
                <div className="space-y-4">
                    {form.faculty_list.map((faculty, fIdx) => (
                        <div key={faculty.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg border">
                            <div className="shrink-0 flex flex-col items-center gap-2">
                                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-white border border-gray-200">
                                    {faculty.image ? (
                                        <Image src={faculty.image} alt="Faculty" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-300 text-xs text-center px-2">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <label className="text-xs text-blue-600 cursor-pointer font-medium hover:underline">
                                    {faculty.image ? "Change Photo" : "Upload Photo"}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                                        const newList = [...form.faculty_list]; newList[fIdx] = { ...newList[fIdx], image: url }; setForm({...form, faculty_list: newList});
                                    })} />
                                </label>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                                    <input placeholder="e.g. Dr. John Doe" value={faculty.name} onChange={(e) => {
                                        const newList = [...form.faculty_list]; newList[fIdx] = { ...newList[fIdx], name: e.target.value }; setForm({...form, faculty_list: newList});
                                    }} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Designation</label>
                                    <input placeholder="e.g. Assistant Professor" value={faculty.designation} onChange={(e) => {
                                        const newList = [...form.faculty_list]; newList[fIdx] = { ...newList[fIdx], designation: e.target.value }; setForm({...form, faculty_list: newList});
                                    }} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            </div>
                            <button type="button" onClick={() => {
                                const newList = form.faculty_list.filter((_, i) => i !== fIdx); setForm({...form, faculty_list: newList});
                            }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    ))}
                    {form.faculty_list.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No faculty members added yet.</p>}
                </div>
            </div>

            {/* PROGRAMMES TAB */}
            <div className={activeTab === "programmes" ? "block space-y-8" : "hidden"}>
                {["ug", "pg", "research"].map((type) => (
                    <div key={type} className="bg-gray-50 p-5 rounded-lg border">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-900 uppercase">{type} Programmes</h4>
                            <button type="button" onClick={() => {
                                const newProgs = {...form.programmes};
                                (newProgs as any)[type].push({id: Date.now().toString(), name: "", duration: "", eligibility: "", seats: ""});
                                setForm({...form, programmes: newProgs});
                            }} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">+ Add {type.toUpperCase()} Programme</button>
                        </div>
                        <div className="space-y-3">
                            {(form.programmes as any)[type].map((prog: any, pIdx: number) => (
                                <div key={prog.id} className="flex gap-3 items-center bg-white p-3 rounded border">
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <input placeholder="Name" value={prog.name} onChange={(e) => {
                                            const newProgs = {...form.programmes}; (newProgs as any)[type][pIdx].name = e.target.value; setForm({...form, programmes: newProgs});
                                        }} className="px-2 py-1.5 border rounded text-sm w-full" />
                                        <input placeholder="Duration" value={prog.duration} onChange={(e) => {
                                            const newProgs = {...form.programmes}; (newProgs as any)[type][pIdx].duration = e.target.value; setForm({...form, programmes: newProgs});
                                        }} className="px-2 py-1.5 border rounded text-sm w-full" />
                                        <input placeholder="Eligibility" value={prog.eligibility} onChange={(e) => {
                                            const newProgs = {...form.programmes}; (newProgs as any)[type][pIdx].eligibility = e.target.value; setForm({...form, programmes: newProgs});
                                        }} className="px-2 py-1.5 border rounded text-sm w-full" />
                                        <input type="number" placeholder="Seats (Optional)" value={prog.seats || ""} onChange={(e) => {
                                            const newProgs = {...form.programmes}; (newProgs as any)[type][pIdx].seats = e.target.value; setForm({...form, programmes: newProgs});
                                        }} className="px-2 py-1.5 border rounded text-sm w-full" />
                                    </div>
                                    <button type="button" onClick={() => {
                                        const newProgs = {...form.programmes}; (newProgs as any)[type] = (newProgs as any)[type].filter((_: any, i: number) => i !== pIdx); setForm({...form, programmes: newProgs});
                                    }} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* SYLLABUS & PUBLICATIONS TAB */}
            <div className={activeTab === "syllabus" ? "block space-y-8" : "hidden"}>
                
                {/* Syllabus Links */}
                <div className="bg-gray-50 p-5 rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">Syllabus Links</h4>
                        <button type="button" onClick={() => setForm({...form, syllabus_links: [...form.syllabus_links, {label: "", url: ""}]})} className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg font-medium">+ Add Link</button>
                    </div>
                    <div className="space-y-3">
                        {form.syllabus_links.map((link, lIdx) => (
                            <div key={lIdx} className="flex gap-3">
                                <input placeholder="Button Label (e.g. MSW Syllabus)" value={link.label} onChange={(e) => {
                                    const newLinks = [...form.syllabus_links]; newLinks[lIdx].label = e.target.value; setForm({...form, syllabus_links: newLinks})
                                }} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                                <div className="flex-2 flex items-center gap-3 bg-white px-3 border rounded-lg">
                                  <label className="cursor-pointer py-1.5 text-sm font-medium shrink-0 flex items-center gap-2 text-primary hover:text-green-700 transition-colors">
                                    <Upload className="w-4 h-4" /> {link.url ? "Change PDF" : "Upload PDF"}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                                        const newLinks = [...form.syllabus_links]; newLinks[lIdx].url = url; setForm({...form, syllabus_links: newLinks})
                                    })} />
                                  </label>
                                  {link.url && <span className="text-xs text-green-600 font-medium truncate bg-green-50 px-2 py-0.5 rounded-full ml-auto">PDF attached</span>}
                                  {!link.url && <span className="text-xs text-red-500 italic ml-auto">File required</span>}
                                </div>
                                <button type="button" onClick={() => {
                                    const newLinks = form.syllabus_links.filter((_, i) => i !== lIdx); setForm({...form, syllabus_links: newLinks})
                                }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Publications */}
                <div className="bg-gray-50 p-5 rounded-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">Publications Sections</h4>
                        <button type="button" onClick={() => setForm({...form, publications: [...form.publications, {title: "", image: "", items: [""], viewAllLink: ""}]})} className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-lg font-medium">+ Add Section</button>
                    </div>
                    <div className="space-y-6">
                        {form.publications.map((pub, pIdx) => (
                            <div key={pIdx} className="bg-white p-4 rounded border">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-medium">Section {pIdx + 1}</span>
                                    <button type="button" onClick={() => {
                                        const newPubs = form.publications.filter((_, i) => i !== pIdx); setForm({...form, publications: newPubs})
                                    }} className="text-red-500 text-sm flex items-center gap-1 hover:underline"><Trash2 className="w-4 h-4" /> Remove Section</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <input placeholder="Title (e.g. Scholars)" value={pub.title} onChange={(e) => {
                                        const newPubs = [...form.publications]; newPubs[pIdx].title = e.target.value; setForm({...form, publications: newPubs})
                                    }} className="px-3 py-2 border rounded-lg text-sm" />
                                    <input placeholder="View All Link (Optional)" value={pub.viewAllLink || ""} onChange={(e) => {
                                        const newPubs = [...form.publications]; newPubs[pIdx].viewAllLink = e.target.value; setForm({...form, publications: newPubs})
                                    }} className="px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 w-24">
                                        <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden mb-2 border">
                                            {pub.image && <Image src={pub.image} alt="Icon" fill className="object-cover" />}
                                        </div>
                                        <label className="text-xs text-blue-600 cursor-pointer text-center block w-full hover:underline">
                                            Upload Image
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                                                const newPubs = [...form.publications]; newPubs[pIdx].image = url; setForm({...form, publications: newPubs})
                                            })} />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm text-gray-600">Publication Items</label>
                                            <button type="button" onClick={() => {
                                                const newPubs = [...form.publications]; newPubs[pIdx].items = [...(newPubs[pIdx].items || []), ""]; setForm({...form, publications: newPubs})
                                            }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add Item</button>
                                        </div>
                                        <div className="space-y-2">
                                            {(pub.items || []).map((item, i) => (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <input value={item} onChange={(e) => {
                                                        const newPubs = [...form.publications]; newPubs[pIdx].items[i] = e.target.value; setForm({...form, publications: newPubs});
                                                    }} className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-primary/30" placeholder="e.g. Indian Journal of Social Work" />
                                                    <button type="button" onClick={() => {
                                                        const newPubs = [...form.publications]; newPubs[pIdx].items = newPubs[pIdx].items.filter((_, idx) => idx !== i); setForm({...form, publications: newPubs});
                                                    }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                            ))}
                                            {(pub.items || []).length === 0 && <span className="text-xs text-gray-500">No items added.</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 flex gap-3 pt-6 border-t">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium border border-primary">
                {editing ? "Update Department" : "Save Department"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((d, i) => (
            <div key={d.id} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 bg-gray-100 group">
                <Image src={d.image || "/departmentsCoverImage/default.png"} alt={d.name} fill className="object-cover" />
                {d.category && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-md text-primary shadow-sm border border-black/5">
                    {d.category}
                    </span>
                )}
                <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleReorder(i, "up")} disabled={i === 0} className={`p-1.5 rounded bg-white/90 shadow-sm ${i === 0 ? "text-gray-300" : "text-gray-700 hover:bg-white hover:text-black"}`}><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorder(i, "down")} disabled={i === departments.length - 1} className={`p-1.5 rounded bg-white/90 shadow-sm ${i === departments.length - 1 ? "text-gray-300" : "text-gray-700 hover:bg-white hover:text-black"}`}><ChevronDown className="w-4 h-4" /></button>
                </div>
                </div>
                <div className="p-5">
                <h3 className="font-bold text-gray-900 mb-1 leading-tight text-lg">{d.name}</h3>
                {d.short_description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {d.short_description}
                    </p>
                )}
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <a href={`/academics/departments/${d.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    <Eye className="w-4 h-4" /> View
                    </a>
                    <button onClick={() => openEdit(d)} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 transition-colors ml-auto">
                    <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
                </div>
            </div>
            ))}
            {departments.length === 0 && (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-500">
                No departments found. Click &quot;Add Department&quot; to create one.
            </div>
            )}
        </div>
      )}
    </div>
  );
}
