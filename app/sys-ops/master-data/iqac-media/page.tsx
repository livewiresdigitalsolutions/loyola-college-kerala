// app/sys-ops/master-data/iqac-media/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FileText, Trash2, Plus, Upload } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface IQACMedia {
  id: number;
  title: string;
  description?: string;
  category: string;
  url: string;
  file_name: string;
  file_size: number;
  display_order: number;
  is_active: boolean;
}

export default function IQACMediaPage() {
  const [mediaList, setMediaList] = useState<IQACMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newMedia, setNewMedia] = useState({
    title: "",
    description: "",
    category: "general",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchMediaList();
  }, []);

  const fetchMediaList = async () => {
    try {
      const response = await fetch("/api/iqac-media?includeInactive=true");
      const data = await response.json();
      if (data.success) {
        setMediaList(data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF only
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file only");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadMedia = async () => {
    if (!selectedFile || !newMedia.title) {
      toast.error("Please select a PDF file and provide a title");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", newMedia.title);
      formData.append("description", newMedia.description);
      formData.append("category", newMedia.category);
      formData.append("display_order", newMedia.display_order.toString());
      formData.append("is_active", newMedia.is_active.toString());

      const response = await fetch("/api/iqac-media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("PDF uploaded successfully");
        setShowAddForm(false);
        setSelectedFile(null);
        setNewMedia({
          title: "",
          description: "",
          category: "general",
          display_order: 0,
          is_active: true,
        });
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to upload PDF");
      }
    } catch (error) {
      toast.error("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const response = await fetch(`/api/iqac-media?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Document deleted successfully");
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to delete document");
      }
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/iqac-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Document status updated");
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            IQAC Document Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and manage PDF documents for IQAC section
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#342D87] text-white px-6 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Upload PDF
        </button>
      </div>

      {/* Upload Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Upload New PDF Document</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                PDF File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#342D87] transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm text-gray-600 mb-1">
                    Click to upload PDF
                  </span>
                  <span className="text-xs text-gray-400">
                    Max 10MB - PDF only
                  </span>
                </label>
              </div>
              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                  placeholder="e.g., Annual Quality Report 2025"
                  value={newMedia.title}
                  onChange={(e) =>
                    setNewMedia({ ...newMedia, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                  value={newMedia.category}
                  onChange={(e) =>
                    setNewMedia({ ...newMedia, category: e.target.value })
                  }
                >
                  <option value="general">General</option>
                  <option value="reports">Reports</option>
                  <option value="policies">Policies</option>
                  <option value="minutes">Meeting Minutes</option>
                  <option value="guidelines">Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-[#342D87] focus:border-transparent"
                  rows={3}
                  placeholder="Brief description of the document..."
                  value={newMedia.description}
                  onChange={(e) =>
                    setNewMedia({ ...newMedia, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 p-3"
                value={newMedia.display_order}
                onChange={(e) =>
                  setNewMedia({
                    ...newMedia,
                    display_order: parseInt(e.target.value || "0"),
                  })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                className="rounded border-gray-300"
                checked={newMedia.is_active}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, is_active: e.target.checked })
                }
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Active (Display publicly)
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleUploadMedia}
              disabled={uploading || !selectedFile || !newMedia.title}
              className="bg-[#342D87] text-white px-8 py-3 rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedFile(null);
              }}
              disabled={uploading}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Media List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No documents found</p>
            <p className="text-gray-500">
              Upload your first IQAC document to get started
            </p>
          </div>
        ) : (
          mediaList.map((media) => (
            <div
              key={media.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6 text-center bg-linear-to-br from-red-50 to-pink-50">
                <FileText className="w-16 h-16 text-red-600 mx-auto mb-3" />
                <div className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full inline-block">
                  PDF Document
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg mb-3 truncate">{media.title}</h3>
                
                {media.description && (
                  <p className="text-sm text-gray-600 mb-4 truncate">{media.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Category:</span>
                    <span className="font-medium capitalize">{media.category}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>File:</span>
                    <span className="font-mono truncate">{media.file_name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Size:</span>
                    <span>{formatFileSize(media.file_size)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Order:</span>
                    <span>{media.display_order}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#342D87] hover:text-[#2a2470] text-sm font-medium underline"
                  >
                    View PDF →
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(media.id, media.is_active)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                        media.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {media.is_active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(media.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
