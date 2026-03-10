"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AlumniMessagesAdmin() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/alumni/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch { setMessages([]) }
  }, []);

  useEffect(() => { fetchMessages().finally(() => setLoading(false)); }, [fetchMessages]);

  if (loading) return <div className="flex items-center justify-center min-h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/sys-ops/master-data/alumni")} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Mail className="w-6 h-6 text-gray-600" /> Contact Messages</h1>
          <p className="text-gray-500 text-sm">{messages.length} messages received</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Name","Email","Subject","Received","View"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map(msg => (
              <tr key={msg.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(msg)}>
                <td className="px-4 py-3 font-medium text-gray-900">{msg.name}</td>
                <td className="px-4 py-3 text-gray-600">{msg.email}</td>
                <td className="px-4 py-3 text-gray-500">{msg.subject || "—"}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(msg.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-emerald-600 text-xs font-semibold">View →</td>
              </tr>
            ))}
            {messages.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No messages received yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{selected.subject || "Message"}</h2>
            <p className="text-sm text-gray-500 mb-4">From <strong>{selected.name}</strong> ({selected.email}) · {new Date(selected.created_at).toLocaleString()}</p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">{selected.message || "(No message body)"}</div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
