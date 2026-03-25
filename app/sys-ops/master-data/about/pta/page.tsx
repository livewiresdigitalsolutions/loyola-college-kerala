// app/sys-ops/master-data/about/pta/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Trash2, Plus, Upload, Users, Pencil, X, Check,
  ChevronDown, ChevronUp, Save, LayoutList, Image as ImageIcon,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

// Strip digits – accordion titles must be text only
const stripNonText = (val: string) => val.replace(/[0-9]/g, "");

// ─── Types ────────────────────────────────────────────────────────────────────

interface PtaLeader {
  id: number;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface AccordionSection {
  id: number;
  section_key: string;
  title: string;
  content: string;
  section_type: "text" | "members";
  sort_order: number;
}

interface MemberEntry {
  name: string;
  role: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PtaAdminPage() {
  const [activeTab, setActiveTab] = useState<"leadership" | "accordion">("leadership");

  // ── Leaders state ──────────────────────────────────────────────────────────
  const [leaders, setLeaders] = useState<PtaLeader[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [newLeader, setNewLeader] = useState({
    name: "",
    role: "",
    display_order: 0,
    is_active: true,
  });
  const [editingLeaderId, setEditingLeaderId] = useState<number | null>(null);
  const [editLeaderForm, setEditLeaderForm] = useState({
    name: "",
    role: "",
    display_order: 0,
  });

  // ── Accordion state ────────────────────────────────────────────────────────
  const [sections, setSections] = useState<AccordionSection[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editSectionForm, setEditSectionForm] = useState({
    title: "",
    content: "",
  });
  const [memberList, setMemberList] = useState<MemberEntry[]>([]);
  const [openSections, setOpenSections] = useState<number[]>([]);

  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchLeaders();
    fetchSections();
  }, []);

  // ── Leaders ────────────────────────────────────────────────────────────────

  const fetchLeaders = async () => {
    setLoadingLeaders(true);
    try {
      const res = await fetch("/api/about/pta?all=true");
      const data = await res.json();
      if (data.success) setLeaders(data.data || []);
    } catch {
      toast.error("Failed to load leaders");
    } finally {
      setLoadingLeaders(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddLeader = async () => {
    if (!selectedFile || !newLeader.name.trim()) {
      toast.error("Please select an image and enter a name");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", newLeader.name);
      formData.append("role", newLeader.role);
      formData.append("display_order", String(newLeader.display_order));
      formData.append("is_active", String(newLeader.is_active));

      const res = await fetch("/api/about/pta/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Leader added successfully");
        setShowAddForm(false);
        setSelectedFile(null);
        setPreviewUrl("");
        setNewLeader({ name: "", role: "", display_order: 0, is_active: true });
        fetchLeaders();
      } else {
        toast.error(data.error || "Failed to add leader");
      }
    } catch {
      toast.error("Failed to add leader");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLeader = async (id: number) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    try {
      const res = await fetch(`/api/about/pta?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Leader deleted");
        fetchLeaders();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete leader");
    }
  };

  const handleToggleLeaderActive = async (id: number, current: boolean) => {
    try {
      const res = await fetch("/api/about/pta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !current }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated");
        fetchLeaders();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleStartEditLeader = (leader: PtaLeader) => {
    setEditingLeaderId(leader.id);
    setEditLeaderForm({
      name: leader.name,
      role: leader.role,
      display_order: leader.display_order,
    });
  };

  const handleSaveLeaderEdit = async () => {
    if (!editingLeaderId) return;
    try {
      const res = await fetch("/api/about/pta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingLeaderId, ...editLeaderForm }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Leader updated");
        setEditingLeaderId(null);
        fetchLeaders();
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Failed to update leader");
    }
  };

  // ── Accordion ──────────────────────────────────────────────────────────────

  const fetchSections = async () => {
    setLoadingSections(true);
    try {
      const res = await fetch("/api/about/pta/accordion");
      const data = await res.json();
      if (data.success) setSections(data.data || []);
    } catch {
      toast.error("Failed to load accordion sections");
    } finally {
      setLoadingSections(false);
    }
  };

  const toggleSectionOpen = (id: number) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartEditSection = (section: AccordionSection) => {
    setEditingSectionId(section.id);
    setEditSectionForm({ title: section.title, content: section.content });
    if (section.section_type === "members") {
      try {
        setMemberList(JSON.parse(section.content));
      } catch {
        setMemberList([]);
      }
    }
    if (!openSections.includes(section.id)) {
      setOpenSections((prev) => [...prev, section.id]);
    }
  };

  const handleCancelSectionEdit = () => {
    setEditingSectionId(null);
    setMemberList([]);
  };

  const handleSaveSectionEdit = async (section: AccordionSection) => {
    if (/[0-9]/.test(editSectionForm.title)) {
      toast.error("Section title must not contain numbers");
      return;
    }
    const contentToSave =
      section.section_type === "members"
        ? JSON.stringify(memberList)
        : editSectionForm.content;

    try {
      const res = await fetch("/api/about/pta/accordion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: section.id,
          title: editSectionForm.title,
          content: contentToSave,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Section updated successfully");
        setEditingSectionId(null);
        setMemberList([]);
        fetchSections();
      } else {
        toast.error(data.error || "Failed to update section");
      }
    } catch {
      toast.error("Failed to update section");
    }
  };

  const addMember = () => setMemberList((prev) => [...prev, { name: "", role: "" }]);
  const removeMember = (idx: number) =>
    setMemberList((prev) => prev.filter((_, i) => i !== idx));
  const updateMember = (idx: number, field: "name" | "role", value: string) => {
    setMemberList((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">PTA Management</h1>
        <p className="text-gray-600 mt-1">
          Manage PTA leadership images and accordion content
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("leadership")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "leadership"
              ? "border-[#342D87] text-[#342D87]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Leadership Images
        </button>
        <button
          onClick={() => setActiveTab("accordion")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "accordion"
              ? "border-[#342D87] text-[#342D87]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Accordion Content
        </button>
      </div>

      {/* ── LEADERSHIP TAB ─────────────────────────────────────────────────── */}
      {activeTab === "leadership" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              {leaders.length} leader{leaders.length !== 1 ? "s" : ""} added
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Leader
            </button>
          </div>

          {/* Add Leader Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Add New PTA Leader</h2>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leader Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="leader-image-upload"
                    />
                    <label
                      htmlFor="leader-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload photo
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WebP supported
                      </span>
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div className="relative h-48 w-36 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 p-2"
                    placeholder="e.g. Dr. Sabu P. Thomas S.J"
                    value={newLeader.name}
                    onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 p-2"
                    placeholder="e.g. President"
                    value={newLeader.role}
                    onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    className="w-full rounded border border-gray-300 p-2"
                    value={newLeader.display_order}
                    onChange={(e) =>
                      setNewLeader({ ...newLeader, display_order: parseInt(e.target.value || "0") })
                    }
                  />
                </div>

                {/* Active */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="leader_is_active"
                    checked={newLeader.is_active}
                    onChange={(e) => setNewLeader({ ...newLeader, is_active: e.target.checked })}
                  />
                  <label htmlFor="leader_is_active" className="text-sm text-gray-700">
                    Active (show on PTA page)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddLeader}
                    disabled={uploading || !selectedFile}
                    className="bg-[#342D87] text-white px-6 py-2 rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading…" : "Add Leader"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}
                    disabled={uploading}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leaders Grid */}
          {loadingLeaders ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No leaders found. Add your first leader.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <img
                      src={leader.image_url}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    {editingLeaderId === leader.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="w-full rounded border border-gray-300 p-1.5 text-sm"
                          placeholder="Name"
                          value={editLeaderForm.name}
                          onChange={(e) =>
                            setEditLeaderForm({ ...editLeaderForm, name: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          className="w-full rounded border border-gray-300 p-1.5 text-sm"
                          placeholder="Role"
                          value={editLeaderForm.role}
                          onChange={(e) =>
                            setEditLeaderForm({ ...editLeaderForm, role: e.target.value })
                          }
                        />
                        <input
                          type="number"
                          className="w-full rounded border border-gray-300 p-1.5 text-sm"
                          placeholder="Display Order"
                          value={editLeaderForm.display_order}
                          onChange={(e) =>
                            setEditLeaderForm({
                              ...editLeaderForm,
                              display_order: parseInt(e.target.value || "0"),
                            })
                          }
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handleSaveLeaderEdit}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditingLeaderId(null)}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-base mb-0.5 leading-tight">{leader.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{leader.role}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Order: {leader.display_order}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleStartEditLeader(leader)}
                              className="text-blue-600 hover:text-blue-800 p-1.5"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleLeaderActive(leader.id, leader.is_active)}
                              className={`text-xs px-2 py-1 rounded ${
                                leader.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {leader.is_active ? "Active" : "Inactive"}
                            </button>
                            <button
                              onClick={() => handleDeleteLeader(leader.id)}
                              className="text-red-600 hover:text-red-800 p-1.5"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ACCORDION TAB ──────────────────────────────────────────────────── */}
      {activeTab === "accordion" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Edit the title and content of each PTA information section.
          </p>

          {loadingSections ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <LayoutList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                No accordion sections found. Make sure the{" "}
                <code className="bg-gray-100 px-1 rounded text-sm">pta_accordion</code> table is seeded.
              </p>
            </div>
          ) : (
            sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <button
                    onClick={() => toggleSectionOpen(section.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    {openSections.includes(section.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="font-semibold text-gray-800">{section.title}</span>
                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full capitalize">
                      {section.section_type}
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      editingSectionId === section.id
                        ? handleCancelSectionEdit()
                        : handleStartEditSection(section)
                    }
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md transition-colors ${
                      editingSectionId === section.id
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-[#342D87] text-white hover:bg-[#2a2470]"
                    }`}
                  >
                    {editingSectionId === section.id ? (
                      <><X className="w-3.5 h-3.5" /> Cancel</>
                    ) : (
                      <><Pencil className="w-3.5 h-3.5" /> Edit</>
                    )}
                  </button>
                </div>

                {/* Section Body */}
                {openSections.includes(section.id) && (
                  <div className="px-5 py-4">
                    {editingSectionId === section.id ? (
                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Section Title
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border border-gray-300 p-2 text-sm"
                            value={editSectionForm.title}
                            onChange={(e) =>
                              setEditSectionForm({ ...editSectionForm, title: stripNonText(e.target.value) })
                            }
                          />
                        </div>

                        {/* Content — text or members */}
                        {section.section_type === "text" ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content
                            </label>
                            <textarea
                              rows={8}
                              className="w-full rounded border border-gray-300 p-2 text-sm font-mono resize-y"
                              value={editSectionForm.content}
                              onChange={(e) =>
                                setEditSectionForm({
                                  ...editSectionForm,
                                  content: e.target.value,
                                })
                              }
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Use two blank lines to create paragraph breaks.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-medium text-gray-700">
                                Executive Committee Members
                              </label>
                              <button
                                onClick={addMember}
                                className="flex items-center gap-1 text-sm text-[#342D87] hover:underline"
                              >
                                <Plus className="w-4 h-4" /> Add Member
                              </button>
                            </div>
                            <div className="space-y-2">
                              {memberList.map((member, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    placeholder="Name"
                                    className="flex-1 rounded border border-gray-300 p-2 text-sm"
                                    value={member.name}
                                    onChange={(e) => updateMember(idx, "name", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Role"
                                    className="flex-1 rounded border border-gray-300 p-2 text-sm"
                                    value={member.role}
                                    onChange={(e) => updateMember(idx, "role", e.target.value)}
                                  />
                                  <button
                                    onClick={() => removeMember(idx)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              {memberList.length === 0 && (
                                <p className="text-sm text-gray-400 italic">
                                  No members yet. Click "Add Member".
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Save */}
                        <button
                          onClick={() => handleSaveSectionEdit(section)}
                          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" /> Save Changes
                        </button>
                      </div>
                    ) : (
                      /* Read-only preview */
                      <div className="text-sm text-gray-600">
                        {section.section_type === "members" ? (
                          (() => {
                            let members: MemberEntry[] = [];
                            try { members = JSON.parse(section.content); } catch { }
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {members.map((m, i) => (
                                  <div key={i} className="bg-gray-50 rounded p-2.5">
                                    <p className="font-medium text-gray-800">{m.name}</p>
                                    <p className="text-xs text-gray-500">{m.role}</p>
                                  </div>
                                ))}
                              </div>
                            );
                          })()
                        ) : (
                          <p className="whitespace-pre-wrap leading-relaxed line-clamp-4">
                            {section.content}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
