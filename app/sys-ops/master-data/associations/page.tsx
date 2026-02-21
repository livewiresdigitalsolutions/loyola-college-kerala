"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Building2,
  Upload,
} from "lucide-react";

/* ─────── Types ─────── */
interface Association {
  id: number;
  slug: string;
  name: string;
  full_name: string;
  category: string;
  department: string;
  motto: string;
  description: string;
  about_paragraphs: string[];
  contact_email: string;
  contact_phone: string;
  address: string;
  bg_image: string;
  is_active: boolean;
  sort_order: number;
}

interface TeamMember {
  id?: number;
  association_id: number;
  name: string;
  role: string;
  department: string;
  image: string;
  sort_order: number;
}

interface Activity {
  id?: number;
  association_id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  type: string;
  sort_order: number;
}

/* ─────── Blank objects ─────── */
const blankAssociation: Omit<Association, "id" | "slug"> = {
  name: "",
  full_name: "",
  category: "",
  department: "",
  motto: "",
  description: "",
  about_paragraphs: [],
  contact_email: "",
  contact_phone: "",
  address: "",
  bg_image: "",
  is_active: true,
  sort_order: 0,
};

const blankTeamMember: Omit<TeamMember, "id"> = {
  association_id: 0,
  name: "",
  role: "",
  department: "",
  image: "",
  sort_order: 0,
};

const blankActivity: Omit<Activity, "id"> = {
  association_id: 0,
  title: "",
  date: "",
  location: "",
  description: "",
  type: "",
  sort_order: 0,
};

/* ═══════════════════════════════════════════════════════════ */
export default function AssociationsAdminPage() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  /* modal state */
  const [modalType, setModalType] = useState<
    "association" | "team" | "activity" | null
  >(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const bgImageRef = useRef<HTMLInputElement>(null);
  const memberImageRef = useRef<HTMLInputElement>(null);

  /* ─── Fetch helpers ─── */
  const fetchAssociations = useCallback(async () => {
    const res = await fetch("/api/sys-ops/associations");
    const data = await res.json();
    setAssociations(data);
  }, []);

  const fetchTeamMembers = useCallback(async (associationId: number) => {
    const res = await fetch(
      `/api/sys-ops/associations/team-members?association_id=${associationId}`
    );
    const data = await res.json();
    setTeamMembers(data);
  }, []);

  const fetchActivities = useCallback(async (associationId: number) => {
    const res = await fetch(
      `/api/sys-ops/associations/activities?association_id=${associationId}`
    );
    const data = await res.json();
    setActivities(data);
  }, []);

  useEffect(() => {
    fetchAssociations().finally(() => setLoading(false));
  }, [fetchAssociations]);

  useEffect(() => {
    if (expandedId !== null) {
      fetchTeamMembers(expandedId);
      fetchActivities(expandedId);
    }
  }, [expandedId, fetchTeamMembers, fetchActivities]);

  /* ─── Image upload ─── */
  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/associations/upload", { method: "POST", body: fd });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    const data = await res.json();
    return data.url;
  };

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setField("bg_image", url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMemberImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setField("image", url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* ─── CRUD helpers ─── */
  const saveItem = async () => {
    setSaving(true);
    try {
      let url = "";
      let method = "POST";

      if (modalType === "association") {
        if (editMode) {
          url = `/api/sys-ops/associations/${formData.id}`;
          method = "PUT";
        } else {
          url = "/api/sys-ops/associations";
        }
      } else if (modalType === "team") {
        if (editMode) {
          url = `/api/sys-ops/associations/team-members/${formData.id}`;
          method = "PUT";
        } else {
          url = "/api/sys-ops/associations/team-members";
        }
      } else if (modalType === "activity") {
        if (editMode) {
          url = `/api/sys-ops/associations/activities/${formData.id}`;
          method = "PUT";
        } else {
          url = "/api/sys-ops/associations/activities";
        }
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Failed to save");
        return;
      }

      // Refresh data
      await fetchAssociations();
      if (expandedId !== null) {
        await fetchTeamMembers(expandedId);
        await fetchActivities(expandedId);
      }

      setModalType(null);
    } catch (err) {
      alert("Error saving item");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (
    type: "association" | "team" | "activity",
    id: number
  ) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      if (type === "association") url = `/api/sys-ops/associations/${id}`;
      else if (type === "team")
        url = `/api/sys-ops/associations/team-members/${id}`;
      else url = `/api/sys-ops/associations/activities/${id}`;

      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      await fetchAssociations();
      if (expandedId !== null) {
        await fetchTeamMembers(expandedId);
        await fetchActivities(expandedId);
      }
    } catch (err) {
      alert("Error deleting item");
      console.error(err);
    }
  };

  /* ─── Modal openers ─── */
  const openAddAssociation = () => {
    setFormData({ ...blankAssociation });
    setEditMode(false);
    setModalType("association");
  };

  const openEditAssociation = (a: Association) => {
    setFormData({ ...a });
    setEditMode(true);
    setModalType("association");
  };

  const openAddTeamMember = (associationId: number) => {
    setFormData({ ...blankTeamMember, association_id: associationId });
    setEditMode(false);
    setModalType("team");
  };

  const openEditTeamMember = (m: TeamMember) => {
    setFormData({ ...m });
    setEditMode(true);
    setModalType("team");
  };

  const openAddActivity = (associationId: number) => {
    setFormData({ ...blankActivity, association_id: associationId });
    setEditMode(false);
    setModalType("activity");
  };

  const openEditActivity = (a: Activity) => {
    setFormData({ ...a });
    setEditMode(true);
    setModalType("activity");
  };

  /* ─── Field updater ─── */
  const setField = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-emerald-600" />
              Student Associations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage associations, team members, and activities.
            </p>
          </div>
          <button
            onClick={openAddAssociation}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Association
          </button>
        </div>

        {/* Associations List */}
        <div className="space-y-4">
          {associations.map((assoc) => {
            const isExpanded = expandedId === assoc.id;
            return (
              <div
                key={assoc.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Association Header Row */}
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {assoc.name.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {assoc.name}
                      <span className="text-gray-400 font-normal text-sm ml-2">
                        ({assoc.full_name})
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {assoc.category} · {assoc.department}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      assoc.is_active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {assoc.is_active ? "Active" : "Inactive"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditAssociation(assoc)}
                      className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem("association", assoc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : assoc.id)
                      }
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-8">
                    {/* Team Members */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600" />{" "}
                          Organizing Team
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1">
                            {teamMembers.length}
                          </span>
                        </h4>
                        <button
                          onClick={() => openAddTeamMember(assoc.id)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Member
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {teamMembers.map((m) => (
                          <div
                            key={m.id}
                            className="bg-white rounded-lg p-4 border border-gray-100 flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-sm shrink-0 overflow-hidden">
                              {m.image ? (
                                <Image
                                  src={m.image}
                                  alt={m.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                m.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {m.name}
                              </p>
                              <p className="text-xs text-emerald-600">
                                {m.role}
                              </p>
                              <p className="text-xs text-gray-400">
                                {m.department}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => openEditTeamMember(m)}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 rounded transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteItem("team", m.id!)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {teamMembers.length === 0 && (
                          <p className="text-sm text-gray-400 italic col-span-full">
                            No team members yet.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />{" "}
                          Activities
                          <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1">
                            {activities.length}
                          </span>
                        </h4>
                        <button
                          onClick={() => openAddActivity(assoc.id)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Activity
                        </button>
                      </div>
                      <div className="space-y-2">
                        {activities.map((a) => (
                          <div
                            key={a.id}
                            className="bg-white rounded-lg p-4 border border-gray-100 flex items-start gap-4"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-gray-900">
                                  {a.title}
                                </p>
                                {a.type && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                    {a.type}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {a.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {a.date} · {a.location}
                              </p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => openEditActivity(a)}
                                className="p-1.5 text-gray-400 hover:text-emerald-600 rounded transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteItem("activity", a.id!)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {activities.length === 0 && (
                          <p className="text-sm text-gray-400 italic">
                            No activities yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {associations.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No associations found</p>
              <p className="text-sm mt-1">
                Click &quot;Add Association&quot; to create one.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ Modal ═══════════ */}
      {modalType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-gray-900">
                {editMode ? "Edit" : "Add"}{" "}
                {modalType === "association"
                  ? "Association"
                  : modalType === "team"
                  ? "Team Member"
                  : "Activity"}
              </h2>
              <button
                onClick={() => setModalType(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* ── Association Form ── */}
              {modalType === "association" && (
                <>
                  <Field
                    label="Short Name"
                    value={formData.name}
                    onChange={(v: string) => setField("name", v)}
                    placeholder="e.g. LASIE"
                  />
                  <Field
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(v: string) => setField("full_name", v)}
                    placeholder="Full association name"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Category"
                      value={formData.category}
                      onChange={(v: string) => setField("category", v)}
                      placeholder="e.g. Sociology Department"
                    />
                    <Field
                      label="Department"
                      value={formData.department}
                      onChange={(v: string) => setField("department", v)}
                      placeholder="e.g. Department of Sociology"
                    />
                  </div>
                  <Field
                    label="Motto"
                    value={formData.motto}
                    onChange={(v: string) => setField("motto", v)}
                    placeholder="Association motto"
                  />
                  <TextareaField
                    label="Description"
                    value={formData.description}
                    onChange={(v: string) => setField("description", v)}
                  />
                  <TextareaField
                    label="About Paragraphs (one per line)"
                    value={
                      Array.isArray(formData.about_paragraphs)
                        ? formData.about_paragraphs.join("\n\n")
                        : ""
                    }
                    onChange={(v: string) =>
                      setField(
                        "about_paragraphs",
                        v.split("\n\n").filter(Boolean)
                      )
                    }
                    rows={6}
                  />

                  {/* Background Image Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Background Image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        ref={bgImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBgImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => bgImageRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading…" : "Upload Image"}
                      </button>
                      {formData.bg_image && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={formData.bg_image}
                              alt="Preview"
                              width={64}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setField("bg_image", "")}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Contact Email"
                      value={formData.contact_email}
                      onChange={(v: string) => setField("contact_email", v)}
                    />
                    <Field
                      label="Contact Phone"
                      value={formData.contact_phone}
                      onChange={(v: string) => setField("contact_phone", v)}
                    />
                  </div>
                  <TextareaField
                    label="Address"
                    value={formData.address}
                    onChange={(v: string) => setField("address", v)}
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Sort Order"
                      value={formData.sort_order}
                      onChange={(v: string) =>
                        setField("sort_order", parseInt(v) || 0)
                      }
                      type="number"
                    />
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Status
                      </label>
                      <select
                        value={formData.is_active ? "true" : "false"}
                        onChange={(e) =>
                          setField("is_active", e.target.value === "true")
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* ── Team Member Form ── */}
              {modalType === "team" && (
                <>
                  <Field
                    label="Name"
                    value={formData.name}
                    onChange={(v: string) => setField("name", v)}
                    placeholder="Full name"
                  />
                  <Field
                    label="Role"
                    value={formData.role}
                    onChange={(v: string) => setField("role", v)}
                    placeholder="e.g. Staff Advisor, Co-ordinator"
                  />
                  <Field
                    label="Department"
                    value={formData.department}
                    onChange={(v: string) => setField("department", v)}
                    placeholder="e.g. MA Sociology"
                  />

                  {/* Member Photo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        ref={memberImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleMemberImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => memberImageRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? "Uploading…" : "Upload Photo"}
                      </button>
                      {formData.image && (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                            <Image
                              src={formData.image}
                              alt="Preview"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setField("image", "")}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Field
                    label="Sort Order"
                    value={formData.sort_order}
                    onChange={(v: string) =>
                      setField("sort_order", parseInt(v) || 0)
                    }
                    type="number"
                  />
                </>
              )}

              {/* ── Activity Form ── */}
              {modalType === "activity" && (
                <>
                  <Field
                    label="Title"
                    value={formData.title}
                    onChange={(v: string) => setField("title", v)}
                    placeholder="Activity title"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Date"
                      value={formData.date}
                      onChange={(v: string) => setField("date", v)}
                      placeholder="e.g. March 2025"
                    />
                    <Field
                      label="Type"
                      value={formData.type}
                      onChange={(v: string) => setField("type", v)}
                      placeholder="e.g. Seminar"
                    />
                  </div>
                  <Field
                    label="Location"
                    value={formData.location}
                    onChange={(v: string) => setField("location", v)}
                    placeholder="Event location"
                  />
                  <TextareaField
                    label="Description"
                    value={formData.description}
                    onChange={(v: string) => setField("description", v)}
                  />
                  <Field
                    label="Sort Order"
                    value={formData.sort_order}
                    onChange={(v: string) =>
                      setField("sort_order", parseInt(v) || 0)
                    }
                    type="number"
                  />
                </>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────── Reusable Field Components ─────── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
      />
    </div>
  );
}
