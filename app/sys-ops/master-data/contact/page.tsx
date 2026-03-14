'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';

export default function ContactAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    address: '',
    emails: { general: '', admissions: '', alumni: '' },
    phones: { reception: '', office: '', principal: '' },
    office_hours_weekdays: '',
    office_hours_saturday: '',
    office_hours_sunday: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sys-ops/contact');
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/sys-ops/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setMessage('Contact info updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update contact info.');
      }
    } catch (error) {
      setMessage('An error occurred.');
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-b border-gray-200 pb-4">
          Global Contact Information
        </h1>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Emails */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <h2 className="text-lg font-semibold text-gray-900 md:col-span-3">Email Addresses</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">General Info</label>
            <input
              type="email"
              name="emails.general"
              value={formData.emails?.general || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admissions</label>
            <input
              type="email"
              name="emails.admissions"
              value={formData.emails?.admissions || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alumni</label>
            <input
              type="email"
              name="emails.alumni"
              value={formData.emails?.alumni || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Phones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <h2 className="text-lg font-semibold text-gray-900 md:col-span-3">Phone Numbers</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reception</label>
            <input
              type="text"
              name="phones.reception"
              value={formData.phones?.reception || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
            <input
              type="text"
              name="phones.office"
              value={formData.phones?.office || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Principal</label>
            <input
              type="text"
              name="phones.principal"
              value={formData.phones?.principal || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Office Hours */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <h2 className="text-lg font-semibold text-gray-900 md:col-span-3">Office Hours</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monday - Friday</label>
            <input
              type="text"
              name="office_hours_weekdays"
              value={formData.office_hours_weekdays}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Saturday</label>
            <input
              type="text"
              name="office_hours_saturday"
              value={formData.office_hours_saturday}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunday & Holidays</label>
            <input
              type="text"
              name="office_hours_sunday"
              value={formData.office_hours_sunday}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
