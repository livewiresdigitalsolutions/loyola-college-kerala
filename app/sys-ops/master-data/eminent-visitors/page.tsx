// app/sys-ops/master-data/eminent-visitors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Users, Pencil, X, Check } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface EminentVisitor {
    id: number;
    name: string;
    title: string;
    image_url: string;
    display_order: number;
    is_active: boolean;
}

export default function EminentVisitorsPage() {
    const [visitors, setVisitors] = useState<EminentVisitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: "", title: "", display_order: 0 });
    const [newVisitor, setNewVisitor] = useState({
        name: "",
        title: "",
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await fetch("/api/about?all=true");
            const data = await response.json();
            if (data.success) {
                setVisitors(data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load visitors");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type - images only
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleUploadVisitor = async () => {
        if (!selectedFile || !newVisitor.name) {
            toast.error("Please select an image and provide a name");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("name", newVisitor.name);
            formData.append("title", newVisitor.title);
            formData.append("display_order", newVisitor.display_order.toString());
            formData.append("is_active", newVisitor.is_active.toString());

            const response = await fetch("/api/about/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Visitor added successfully");
                setShowAddForm(false);
                setSelectedFile(null);
                setPreviewUrl("");
                setNewVisitor({
                    name: "",
                    title: "",
                    display_order: 0,
                    is_active: true,
                });
                fetchVisitors();
            } else {
                toast.error(data.error || "Failed to add visitor");
            }
        } catch (error) {
            toast.error("Failed to add visitor");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteVisitor = async (id: number) => {
        if (!confirm("Are you sure you want to delete this visitor?")) return;

        try {
            const response = await fetch(`/api/about?id=${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Visitor deleted successfully");
                fetchVisitors();
            } else {
                toast.error(data.error || "Failed to delete visitor");
            }
        } catch (error) {
            toast.error("Failed to delete visitor");
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            const response = await fetch("/api/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_active: !currentStatus }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Visitor status updated");
                fetchVisitors();
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleStartEdit = (visitor: EminentVisitor) => {
        setEditingId(visitor.id);
        setEditForm({
            name: visitor.name,
            title: visitor.title || "",
            display_order: visitor.display_order,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;
        try {
            const response = await fetch("/api/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, ...editForm }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Visitor updated successfully");
                setEditingId(null);
                fetchVisitors();
            } else {
                toast.error(data.error || "Failed to update visitor");
            }
        } catch (error) {
            toast.error("Failed to update visitor");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Eminent Visitors Management
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Upload and manage images of eminent visitors
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Visitor
                </button>
            </div>

            {/* Add Visitor Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Add New Eminent Visitor</h2>
                    <div className="space-y-4">
                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visitor Image *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="visitor-image-upload"
                                />
                                <label
                                    htmlFor="visitor-image-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-600">
                                        Click to upload visitor image
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

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="e.g. Dr. A.P.J. Abdul Kalam"
                                value={newVisitor.name}
                                onChange={(e) =>
                                    setNewVisitor({ ...newVisitor, name: e.target.value })
                                }
                            />
                        </div>

                        {/* Title / Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title / Designation
                            </label>
                            <input
                                type="text"
                                className="w-full rounded border border-gray-300 p-2"
                                placeholder="e.g. Former President of India"
                                value={newVisitor.title}
                                onChange={(e) =>
                                    setNewVisitor({ ...newVisitor, title: e.target.value })
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
                                value={newVisitor.display_order}
                                onChange={(e) =>
                                    setNewVisitor({
                                        ...newVisitor,
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
                                checked={newVisitor.is_active}
                                onChange={(e) =>
                                    setNewVisitor({
                                        ...newVisitor,
                                        is_active: e.target.checked,
                                    })
                                }
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">
                                Active (Display on eminent visitors page)
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleUploadVisitor}
                                disabled={uploading || !selectedFile}
                                className="bg-[#342D87] text-white px-6 py-2 rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? "Uploading..." : "Add Visitor"}
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

            {/* Visitors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visitors.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">
                            No eminent visitors found. Add your first visitor.
                        </p>
                    </div>
                ) : (
                    visitors.map((visitor) => (
                        <div
                            key={visitor.id}
                            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative aspect-[3/4] bg-gray-100">
                                <img
                                    src={visitor.image_url}
                                    alt={visitor.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                {editingId === visitor.id ? (
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
                                            placeholder="Title / Designation"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        />
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
                                        <h3 className="font-bold text-lg mb-1">{visitor.name}</h3>
                                        {visitor.title && (
                                            <p className="text-sm text-gray-600 mb-3">{visitor.title}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">
                                                Order: {visitor.display_order}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStartEdit(visitor)}
                                                    className="text-blue-600 hover:text-blue-800 p-2"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(visitor.id, visitor.is_active)
                                                    }
                                                    className={`text-xs px-3 py-1 rounded ${visitor.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {visitor.is_active ? "Active" : "Inactive"}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVisitor(visitor.id)}
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
        </div>
    );
}
