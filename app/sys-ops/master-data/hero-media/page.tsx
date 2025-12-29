// app/sys-ops/master-data/hero-media/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Trash2, Plus, Upload } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface HeroMedia {
  id: number;
  type: "image" | "video";
  url: string;
  title: string;
  display_order: number;
  is_active: boolean;
}

export default function HeroMediaPage() {
  const [mediaList, setMediaList] = useState<HeroMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [newMedia, setNewMedia] = useState({
    type: "image" as "image" | "video",
    title: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchMediaList();
  }, []);

  const fetchMediaList = async () => {
    try {
      const response = await fetch("/api/hero-media");
      const data = await response.json();
      if (data.success) {
        setMediaList(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select an image or video file");
      return;
    }

    setSelectedFile(file);
    setNewMedia({ ...newMedia, type: isVideo ? "video" : "image" });

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUploadMedia = async () => {
    if (!selectedFile || !newMedia.title) {
      toast.error("Please select a file and provide a title");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", newMedia.type);
      formData.append("title", newMedia.title);
      formData.append("display_order", newMedia.display_order.toString());
      formData.append("is_active", newMedia.is_active.toString());

      const response = await fetch("/api/hero-media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Media uploaded successfully");
        setShowAddForm(false);
        setSelectedFile(null);
        setPreviewUrl("");
        setNewMedia({
          type: "image",
          title: "",
          display_order: 0,
          is_active: true,
        });
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      toast.error("Failed to upload media");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`/api/hero-media?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Media deleted successfully");
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to delete media");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Failed to delete media");
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/hero-media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Media status updated");
        fetchMediaList();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
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
            Hero Media Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload and manage images/videos for the hero section
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-[#342D87] text-white px-4 py-2 rounded-lg hover:bg-[#2a2470] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      {/* Upload Media Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upload New Media</h2>
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#342D87] transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload image or video
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Supported: JPG, PNG, MP4, WebM
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-3 text-sm text-gray-600">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            {/* Preview */}
            {previewUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {newMedia.type === "video" ? (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Campus Overview Video"
                value={newMedia.title}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full rounded border border-gray-300 p-2"
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
                checked={newMedia.is_active}
                onChange={(e) =>
                  setNewMedia({ ...newMedia, is_active: e.target.checked })
                }
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Active (Display on hero section)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUploadMedia}
                disabled={uploading || !selectedFile}
                className="bg-[#342D87] text-white px-6 py-2 rounded-lg hover:bg-[#2a2470] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Media"}
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

      {/* Media List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center py-12">
            No media found. Upload your first media item.
          </p>
        ) : (
          mediaList.map((media) => (
            <div
              key={media.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                {media.type === "video" ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={media.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                  {media.type === "video" ? (
                    <Video className="w-4 h-4 text-[#342D87]" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-[#342D87]" />
                  )}
                  {media.type}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{media.title}</h3>
                <p className="text-sm text-gray-600 mb-3 truncate">
                  {media.url}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Order: {media.display_order}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleToggleActive(media.id, media.is_active)
                      }
                      className={`text-xs px-3 py-1 rounded ${
                        media.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {media.is_active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(media.id)}
                      className="text-red-600 hover:text-red-800 p-2"
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
