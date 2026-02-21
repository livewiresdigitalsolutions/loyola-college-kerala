"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Loader2, Save, ArrowLeft, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const TiptapEditor = dynamic(() => import("../../../../_components/TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl bg-gray-50 h-64 flex items-center justify-center text-gray-400">
      Loading editor...
    </div>
  ),
});

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    keywords: "",
    category: "",
    content: "",
    cover_image: "",
  });

  useEffect(() => {
    fetch(`/api/journals/articles/${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
          router.push("/journals/dashboard/articles");
          return;
        }
        setForm({
          title: data.title || "",
          abstract: data.abstract || "",
          keywords: data.keywords || "",
          category: data.category || "",
          content: data.content || "",
          cover_image: data.cover_image || "",
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load article");
        setLoading(false);
      });
  }, [articleId, router]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/journals/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, cover_image: data.url }));
        toast.success("Cover image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/journals/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Article updated!");
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 text-sm";

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div>
          <Link
            href="/journals/dashboard/articles"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
          {/* Cover Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Cover Image
            </label>
            {form.cover_image ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={form.cover_image}
                  alt="Cover"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, cover_image: "" })}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                {uploadingCover ? (
                  <Loader2 size={28} className="text-primary animate-spin" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={22} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Click to upload cover image</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — Max 5MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass + " text-lg font-medium"}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Abstract</label>
            <textarea
              rows={4}
              value={form.abstract}
              onChange={(e) => setForm({ ...form, abstract: e.target.value })}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Keywords</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                <option value="">Select category</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Economics">Economics</option>
                <option value="Sociology">Sociology</option>
                <option value="Psychology">Psychology</option>
                <option value="Political Science">Political Science</option>
                <option value="History">History</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Content</label>
            {form.content && (
              <TiptapEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
