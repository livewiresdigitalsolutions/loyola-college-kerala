'use client';

import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, User, Calendar } from 'lucide-react';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sys-ops/contact-submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Contact Form Submissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View messages sent continuously from the website's public contact form.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {submissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No contact submissions found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {submissions.map((sub) => (
              <div 
                key={sub.id} 
                onClick={() => setSelectedSubmission(sub)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <User className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                      {sub.first_name} {sub.last_name}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sub.inquiry_type || 'General'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(sub.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-gray-600 text-sm line-clamp-2 pr-8">
                  {sub.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedSubmission(null)}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSubmission.first_name} {selectedSubmission.last_name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm font-medium text-gray-600">
                  <a href={`mailto:${selectedSubmission.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Mail className="w-4 h-4" /> {selectedSubmission.email}
                  </a>
                  {selectedSubmission.phone && (
                    <a href={`tel:${selectedSubmission.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Phone className="w-4 h-4" /> {selectedSubmission.phone}
                    </a>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500 pb-4 border-b border-gray-100">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Inquiry: {selectedSubmission.inquiry_type || 'General'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedSubmission.created_at).toLocaleString()}
                </span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Message Content:</h4>
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-gray-800 text-base leading-relaxed whitespace-pre-wrap min-h-[150px]">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
