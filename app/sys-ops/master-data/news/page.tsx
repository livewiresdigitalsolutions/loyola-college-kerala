'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function NewsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const initialForm = {
    category: 'Academic News',
    date: '',
    title: '',
    excerpt: '',
    image: '/assets/loyola-building.png',
    lead_text: '',
    body: [] as string[],
    section_title: '',
    section_body: '',
    sort_order: 0
  };
  
  const [formData, setFormData] = useState(initialForm);
  const [bodyText, setBodyText] = useState(''); // Textarea for paragraphs
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sys-ops/news');
      if (res.ok) {
        const json = await res.json();
        setData(json.news || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setCurrentId(item.id);
    const itemBody = typeof item.body === 'string' ? JSON.parse(item.body) : item.body || [];
    setFormData({
      ...item,
      body: itemBody
    });
    setBodyText(Array.isArray(itemBody) ? itemBody.join('\n\n') : '');
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    
    try {
      const res = await fetch(`/api/sys-ops/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalImageUrl = formData.image;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        
        const uploadRes = await fetch('/api/sys-ops/news/upload', {
          method: 'POST',
          body: uploadData
        });
        
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          if (result.success) {
            finalImageUrl = result.url;
          }
        }
      }

      // Convert body text to array
      const bodyArray = bodyText.split('\n\n').filter(p => p.trim() !== '');
      const submissionData = { ...formData, body: bodyArray, image: finalImageUrl };

      const url = currentId ? `/api/sys-ops/news/${currentId}` : '/api/sys-ops/news';
      const method = currentId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        setIsEditing(false);
        setFormData(initialForm);
        setBodyText('');
        setImageFile(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving news:', error);
    } finally {
      setIsUploading(false);
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
          News Management
        </h1>
        {!isEditing && (
          <button
            onClick={() => {
              setFormData(initialForm);
              setBodyText('');
              setImageFile(null);
              setIsEditing(true);
              setCurrentId(null);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add News
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold">{currentId ? 'Edit News' : 'Add News'}</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="Academic News">Academic News</option>
                <option value="Campus Life">Campus Life</option>
                <option value="Seminars & Workshops">Seminars & Workshops</option>
                <option value="Announcements">Announcements</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date String (e.g. October 12, 2026)</label>
              <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Upload {currentId && formData.image && <span className="text-xs text-blue-600">(Current: {formData.image.split("/").pop()})</span>}</label>
              <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
              {imageFile && <p className="text-xs text-green-600 mt-1">Selected: {imageFile.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Excerpt (short desc)</label>
            <textarea required rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Lead Text</label>
            <textarea required rows={2} value={formData.lead_text} onChange={e => setFormData({...formData, lead_text: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body Paragraphs (Separate paragraphs with double enter)</label>
            <textarea required rows={6} value={bodyText} onChange={e => setBodyText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-md">
            <h3 className="md:col-span-2 font-medium">Optional Footer Section</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input type="text" value={formData.section_title} onChange={e => setFormData({...formData, section_title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. How to Apply" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Body</label>
              <textarea rows={2} value={formData.section_body} onChange={e => setFormData({...formData, section_body: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" disabled={isUploading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2" disabled={isUploading}>
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? 'Saving...' : 'Save News'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No news articles found</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{item.category}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
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
