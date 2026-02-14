"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Users,
  UserPlus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Committee {
  id: number;
  name: string;
  description: string;
  type: string;
  sort_order: number;
}

interface CommitteeMember {
  id: number;
  committee_id: number;
  name: string;
  designation: string;
  image: string;
  sort_order: number;
}

export default function CommitteesManagement() {
  const router = useRouter();
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [committeeForm, setCommitteeForm] = useState({ name: "", description: "", type: "" });

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [memberForm, setMemberForm] = useState({ committee_id: 0, name: "", designation: "", image: "/assets/defaultprofile.png" });

  const [activeTab, setActiveTab] = useState<"committees" | "members">("committees");

  const fetchData = async () => {
    try {
      const [cRes, mRes] = await Promise.all([
        fetch("/api/academics/committees"),
        fetch("/api/academics/committee-members"),
      ]);
      if (cRes.ok) setCommittees(await cRes.json());
      if (mRes.ok) setMembers(await mRes.json());
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ---- Reorder ----
  const handleReorder = async (tableName: string, items: any[], index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const current = items[index];
    const swap = items[swapIndex];
    const updates = [
      { id: current.id, sort_order: swap.sort_order },
      { id: swap.id, sort_order: current.sort_order },
    ];

    // If both have same sort_order, use index-based
    if (current.sort_order === swap.sort_order) {
      updates[0].sort_order = swapIndex;
      updates[1].sort_order = index;
    }

    try {
      const res = await fetch("/api/academics/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableName, items: updates }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch { toast.error("Failed to reorder"); }
  };

  // ---- Committee CRUD ----
  const handleCommitteeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCommittee ? `/api/academics/committees/${editingCommittee.id}` : "/api/academics/committees";
      const method = editingCommittee ? "PUT" : "POST";
      const payload = { ...committeeForm, sort_order: editingCommittee?.sort_order ?? committees.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editingCommittee ? "Committee updated" : "Committee added");
      setShowCommitteeForm(false); setEditingCommittee(null);
      setCommitteeForm({ name: "", description: "", type: "" });
      fetchData();
    } catch { toast.error("Failed to save committee"); }
  };

  const handleDeleteCommittee = async (id: number) => {
    if (!confirm("Delete this committee? All associated members will remain.")) return;
    try {
      const res = await fetch(`/api/academics/committees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Committee deleted"); fetchData();
    } catch { toast.error("Failed to delete committee"); }
  };

  const openEditCommittee = (c: Committee) => {
    setEditingCommittee(c);
    setCommitteeForm({ name: c.name, description: c.description || "", type: c.type || "" });
    setShowCommitteeForm(true);
  };

  // ---- Member CRUD ----
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/academics/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setMemberForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch { toast.error("Failed to upload image"); }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember ? `/api/academics/committee-members/${editingMember.id}` : "/api/academics/committee-members";
      const method = editingMember ? "PUT" : "POST";
      const payload = { ...memberForm, sort_order: editingMember?.sort_order ?? members.length };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(editingMember ? "Member updated" : "Member added");
      setShowMemberForm(false); setEditingMember(null);
      setMemberForm({ committee_id: committees[0]?.id || 0, name: "", designation: "", image: "/assets/defaultprofile.png" });
      fetchData();
    } catch { toast.error("Failed to save member"); }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Delete this member?")) return;
    try {
      const res = await fetch(`/api/academics/committee-members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Member deleted"); fetchData();
    } catch { toast.error("Failed to delete member"); }
  };

  const openEditMember = (m: CommitteeMember) => {
    setEditingMember(m);
    setMemberForm({ committee_id: m.committee_id, name: m.name, designation: m.designation || "", image: m.image || "/assets/defaultprofile.png" });
    setShowMemberForm(true);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/sys-ops/master-data/academics")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">College Committees</h1>
            <p className="text-gray-600 text-sm">Manage committees and their members</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button onClick={() => setActiveTab("committees")} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${activeTab === "committees" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}>
          <Users className="w-4 h-4 inline mr-2" />Committees ({committees.length})
        </button>
        <button onClick={() => setActiveTab("members")} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${activeTab === "members" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}>
          <UserPlus className="w-4 h-4 inline mr-2" />Members ({members.length})
        </button>
      </div>

      {/* Committees Tab */}
      {activeTab === "committees" && (
        <div>
          <button onClick={() => { setEditingCommittee(null); setCommitteeForm({ name: "", description: "", type: "" }); setShowCommitteeForm(true); }}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Committee
          </button>

          {showCommitteeForm && (
            <div className="bg-white p-6 rounded-xl border mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{editingCommittee ? "Edit" : "Add"} Committee</h3>
                <button onClick={() => setShowCommitteeForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCommitteeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Committee Name" value={committeeForm.name} onChange={(e) => setCommitteeForm({ ...committeeForm, name: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <input placeholder="Type (e.g., Academic, Administrative)" value={committeeForm.type} onChange={(e) => setCommitteeForm({ ...committeeForm, type: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <textarea placeholder="Description" value={committeeForm.description} onChange={(e) => setCommitteeForm({ ...committeeForm, description: e.target.value })} className="px-3 py-2 border rounded-lg md:col-span-2" rows={3} />
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingCommittee ? "Update" : "Add"}</button>
                  <button type="button" onClick={() => setShowCommitteeForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600 w-16">Order</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Members</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {committees.map((c, i) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => handleReorder("committees", committees, i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => handleReorder("committees", committees, i, "down")} disabled={i === committees.length - 1} className={`p-0.5 rounded ${i === committees.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4 text-sm text-gray-500">{c.type || "-"}</td>
                    <td className="p-4 text-sm">{members.filter((m) => m.committee_id === c.id).length}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditCommittee(c)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCommittee(c.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {committees.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-400">No committees yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div>
          <button onClick={() => { setEditingMember(null); setMemberForm({ committee_id: committees[0]?.id || 0, name: "", designation: "", image: "/assets/defaultprofile.png" }); setShowMemberForm(true); }}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Member
          </button>

          {showMemberForm && (
            <div className="bg-white p-6 rounded-xl border mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{editingMember ? "Edit" : "Add"} Member</h3>
                <button onClick={() => setShowMemberForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleMemberSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select required value={memberForm.committee_id} onChange={(e) => setMemberForm({ ...memberForm, committee_id: parseInt(e.target.value) })} className="px-3 py-2 border rounded-lg">
                  <option value={0}>Select Committee</option>
                  {committees.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input required placeholder="Member Name" value={memberForm.name} onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <input placeholder="Designation" value={memberForm.designation} onChange={(e) => setMemberForm({ ...memberForm, designation: e.target.value })} className="px-3 py-2 border rounded-lg" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                      <Image src={memberForm.image} alt="Preview" fill className="object-cover" />
                    </div>
                    <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                      <Upload className="w-4 h-4" /> Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">{editingMember ? "Update" : "Add"}</button>
                  <button type="button" onClick={() => setShowMemberForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-600 w-16">Order</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Image</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Committee</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Designation</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => (
                  <tr key={m.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-0.5">
                        <button onClick={() => handleReorder("committee-members", members, i, "up")} disabled={i === 0} className={`p-0.5 rounded ${i === 0 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => handleReorder("committee-members", members, i, "down")} disabled={i === members.length - 1} className={`p-0.5 rounded ${i === members.length - 1 ? "text-gray-300" : "text-gray-500 hover:bg-gray-200"}`}><ChevronDown className="w-4 h-4" /></button>
                      </div>
                    </td>
                    <td className="p-4"><div className="relative w-10 h-10 rounded-full overflow-hidden"><Image src={m.image || "/assets/defaultprofile.png"} alt={m.name} fill className="object-cover" /></div></td>
                    <td className="p-4 font-medium">{m.name}</td>
                    <td className="p-4 text-sm text-gray-500">{committees.find((c) => c.id === m.committee_id)?.name || "-"}</td>
                    <td className="p-4 text-sm text-gray-500">{m.designation || "-"}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditMember(m)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteMember(m.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No members yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
