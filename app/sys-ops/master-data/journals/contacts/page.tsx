"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, Mail, Clock } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journals/contact")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setContacts(data); setLoading(false); })
      .catch(() => { toast.error("Failed to load"); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/sys-ops/master-data/journals")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 text-sm">{contacts.length} submission{contacts.length !== 1 ? "s" : ""} received</p>
        </div>
      </div>

      {/* Messages */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-1">Messages from the journal contact form will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map(c => (
            <div key={c.id} className="bg-white rounded-xl border p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <span className="text-xs text-gray-400">•</span>
                    <a href={`mailto:${c.email}`} className="text-sm text-primary hover:underline">{c.email}</a>
                    {c.phone && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{c.phone}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{c.message}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
