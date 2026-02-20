// app/sys-ops/master-data/institutional-governance/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Users, Pencil, X, Check } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface IGMember {
    id: number;
    name: string;
    role: string;
    image_url: string;
    category: string;
    display_order: number;
    is_active: boolean;
}

const CATEGORIES = [
    { value: "administration", label: "Administration" },
    { value: "governing_body", label: "Governing Body" },
    { value: "academic_council", label: "Academic Council" },
];

export default function InstitutionalGovernancePage() {
    const [members, setMembers] = useState<IGMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("administration");
    const [showAddForm, setShowAddForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: "", role: "", category: "", display_order: 0 });
    const [newMember, setNewMember] = useState({
        name: "",
        role: "",
        category: "administration",
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchMembers();
    }, [activeTab]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/about/institutional-governance?category=${activeTab}&all=true`
            );
            const data = await response.json();
            if (data.success) {
                setMembers(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
            toast.error("Failed to load members");
        } finally {
            setIsLoading(false);
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
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleUploadMember = async () => {
        if (!selectedFile || !newMember.name) {
            toast.error("Please select an image and provide a name");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("name", newMember.name);
            formData.append("role", newMember.role);
            formData.append("category", newMember.category);
            formData.append("display_order", newMember.display_order.toString());
            formData.append("is_active", newMember.is_active.toString());

            const response = await fetch(
                "/api/about/institutional-governance/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Member added successfully");
                setShowAddForm(false);
                setSelectedFile(null);
                setPreviewUrl("");
                setNewMember({
                    name: "",
                    role: "",
                    category: activeTab,
                    display_order: 0,
                    is_active: true,
                });
                fetchMembers();
            } else {
                toast.error(data.error || "Failed to add member");
            }
        } catch (error) {
            console.error("Error adding member:", error);
            toast.error("Failed to add member");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteMember = async (id: number) => {
        if (!confirm("Are you sure you want to delete this member?")) return;

        try {
            const response = await fetch(
                `/api/about/institutional-governance?id=${id}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (data.success) {
                toast.success("Member deleted successfully");
                fetchMembers();
            } else {
                toast.error(data.error || "Failed to delete member");
            }
        } catch (error) {
            console.error("Error deleting member:", error);
            toast.error("Failed to delete member");
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch("/api/about/institutional-governance", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_active: !currentStatus }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Member status updated");
                fetchMembers();
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleStartEdit = (member: IGMember) => {
        setEditingId(member.id);
        setEditForm({
            name: member.name,
            role: member.role || "",
            category: member.category,
            display_order: member.display_order,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        try {
            const response = await fetch("/api/about/institutional-governance", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, ...editForm }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Member updated successfully");
                setEditingId(null);
                fetchMembers();
            } else {
                toast.error(data.error || "Failed to update member");
            }
        } catch (error) {
            console.error("Error updating member:", error);
            toast.error("Failed to update member");
        }
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Institutional Governance
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage administration, governing body and academic council members
                    </p>
                </div>
                <button
                    onClick={() => {
                        setNewMember({ ...newMember, category: activeTab });
                        setShowAddForm(true);
                    }}
                    className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveTab(cat.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === cat.value
                            ? "bg-[#342D87] text-white shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Add Member Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Add New Member</h2>
                    <div className="space-y-4">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Member Image *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="member-image-upload"
                                />
                                <label
                                    htmlFor="member-image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        Click to upload member image
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        Supported: JPG, PNG, WebP
                                    </span>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="mt-3 text-sm text-gray-600">
                                    Selected: {selectedFile.name} (
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview
                                </label>
                                <div className="relative h-48 w-36 bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                className="w-full rounded border border-gray-300 p-2"
                                value={newMember.category}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, category: e.target.value })
                                }
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="e.g. Fr. Sunny Kunnappallil, SJ"
                                value={newMember.name}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, name: e.target.value })
                                }
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role / Designation
                            </label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="e.g. Rector & Manager"
                                value={newMember.role}
                                onChange={(e) =>
                                    setNewMember({ ...newMember, role: e.target.value })
                                }
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                className="w-full rounded border border-gray-300 p-2"
                                value={newMember.display_order}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        display_order: parseInt(e.target.value || ""),
                                    })
                                }
                            />
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={newMember.is_active}
                                onChange={(e) =>
                                    setNewMember({
                                        ...newMember,
                                        is_active: e.target.checked,
                                    })
                                }
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">
                                Active (Display on public page)
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleUploadMember}
                                disabled={uploading || !selectedFile}
                                className="bg-[#342D87] text-white px-6 py-2 rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? "Uploading..." : "Add Member"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setSelectedFile(null);
                                    setPreviewUrl("");
                                }}
                                disabled={uploading}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Members Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-gray-600">Loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.length === 0 ? (
                        <div className="col-span-full text-center py-16">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">
                                No members found in this category. Add your first member.
                            </p>
                        </div>
                    ) : (
                        members.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative aspect-[3/4] bg-gray-100">
                                    <img
                                        src={member.image_url}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-4">
                                    {editingId === member.id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="w-full rounded border border-gray-300 p-1.5 text-sm"
                                                placeholder="Name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="w-full rounded border border-gray-300 p-1.5 text-sm"
                                                placeholder="Role / Designation"
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            />
                                            <select
                                                className="w-full rounded border border-gray-300 p-1.5 text-sm"
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                className="w-full rounded border border-gray-300 p-1.5 text-sm"
                                                placeholder="Display Order"
                                                value={editForm.display_order}
                                                onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value || "0") })}
                                            />
                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    onClick={handleSaveEdit}
                                                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
                                                >
                                                    <X className="w-3.5 h-3.5" /> Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                            {member.role && (
                                                <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    Order: {member.display_order}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleStartEdit(member)}
                                                        className="text-blue-600 hover:text-blue-800 p-2"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleToggleActive(member.id, member.is_active)
                                                        }
                                                        className={`text-xs px-3 py-1 rounded ${member.is_active
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                            }`}
                                                    >
                                                        {member.is_active ? "Active" : "Inactive"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMember(member.id)}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
