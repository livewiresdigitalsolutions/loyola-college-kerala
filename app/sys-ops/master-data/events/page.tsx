'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function EventsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const initialForm = {
    month: '',
    day: '',
    title: '',
    time: '',
    venue: '',
    sort_order: 0
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sys-ops/events');
      if (res.ok) {
        const json = await res.json();
        setData(json.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setCurrentId(item.id);
    setFormData(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`/api/sys-ops/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/sys-ops/events/${currentId}` : '/api/sys-ops/events';
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsEditing(false);
        setFormData(initialForm);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving event:', error);
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Upcoming Events Management
        </h1>
        {!isEditing && (
          <button
            onClick={() => {
              setFormData(initialForm);
              setIsEditing(true);
              setCurrentId(null);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold">{currentId ? 'Edit Event' : 'Add Event'}</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="National Conference on Sustainability" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month (e.g. OCT)</label>
              <input required type="text" maxLength={3} value={formData.month} onChange={e => setFormData({...formData, month: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="OCT" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date/Day (e.g. 15)</label>
              <input required type="text" maxLength={2} value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="15" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="09:00 AM - 04:30 PM" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
              <input required type="text" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Main Auditorium" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">Save Event</button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time & Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No events found</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-center bg-gray-50 rounded px-2 py-1 w-fit">
                        <span className="text-[10px] font-bold text-yellow-600">{item.month}</span>
                        <span className="text-lg font-bold text-gray-900">{item.day}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{item.time}</div>
                      <div className="text-xs text-gray-400">{item.venue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
