'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';

export default function EventReportsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const initialForm = {
    category: 'Cultural',
    date: '',
    month_year: '',
    title: '',
    description: '',
    image: '/assets/loyola-building.png',
    lead_text: '',
    body: [] as string[],
    gallery: [] as string[],
    sort_order: 0
  };
  
  const [formData, setFormData] = useState(initialForm);
  const [bodyText, setBodyText] = useState(''); // Textarea for paragraphs
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  const uniqueCategories = Array.from(new Set([
    "Cultural", "Academic", "Campus Life", "Seminars & Workshops", "Announcements",
    ...data.map(item => item.category)
  ])).filter(Boolean);

  // Helper functions for dates
  const formatYYYYMMToMonthYear = (yyyy_mm: string) => {
    if (!yyyy_mm) return '';
    const parts = yyyy_mm.split('-');
    if (parts.length !== 2) return yyyy_mm; 
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' }); 
  };

  const parseMonthYearToYYYYMM = (month_year: string) => {
    if (!month_year) return '';
    try {
      const parts = month_year.split(' ');
      if (parts.length < 2) return '';
      const monthStr = parts[0];
      const year = parts[parts.length - 1]; 
      const fullDate = new Date(`${monthStr} 1, 2000`);
      if (isNaN(fullDate.getTime())) return '';
      const monthIndex = fullDate.getMonth() + 1;
      return `${year}-${monthIndex.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const formatYYYYMMDDToReadable = (yyyy_mm_dd: string) => {
    if (!yyyy_mm_dd) return '';
    const parts = yyyy_mm_dd.split('-');
    if (parts.length !== 3) return yyyy_mm_dd;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' }); 
  };

  const parseReadableToYYYYMMDD = (readable: string) => {
    if (!readable) return '';
    try {
      const parsedDate = new Date(readable);
      if (isNaN(parsedDate.getTime())) return '';
      const yyyy = parsedDate.getFullYear();
      const mm = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
      const dd = parsedDate.getDate().toString().padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return '';
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  useEffect(() => {
    const urls = galleryFiles.map(file => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);
  
  const handleAddGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Auto-fill Grouping Month/Year when Date changes
  useEffect(() => {
    if (formData.date) {
      try {
        // Date is stored as "Month DD, YYYY"
        const dateObj = new Date(formData.date);
        if (!isNaN(dateObj.getTime())) {
          const autoMonthYear = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
          if (formData.month_year !== autoMonthYear && autoMonthYear !== 'Invalid Date') {
            setFormData(prev => ({ ...prev, month_year: autoMonthYear }));
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }, [formData.date]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sys-ops/event-reports');
      if (res.ok) {
        const json = await res.json();
        setData(json.reports || []);
      }
    } catch (error) {
      console.error('Error fetching event reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setCurrentId(item.id);
    const itemBody = typeof item.body === 'string' ? JSON.parse(item.body) : item.body || [];
    const itemGallery = typeof item.gallery === 'string' ? JSON.parse(item.gallery) : item.gallery || [];
    
    setFormData({
      ...item,
      body: itemBody,
      gallery: itemGallery
    });
    setBodyText(Array.isArray(itemBody) ? itemBody.join('\n\n') : '');
    setImageFile(null);
    setGalleryFiles([]);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event report?')) return;
    
    try {
      const res = await fetch(`/api/sys-ops/event-reports/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting event report:', error);
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
        
        const uploadRes = await fetch('/api/sys-ops/event-reports/upload', {
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

      const uploadedGalleryUrls: string[] = [];

      for (const file of galleryFiles) {
        const uploadData = new FormData();
        uploadData.append("file", file);
        
        const uploadRes = await fetch('/api/sys-ops/event-reports/upload', {
          method: 'POST',
          body: uploadData
        });
        
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          if (result.success) {
            uploadedGalleryUrls.push(result.url);
          }
        }
      }

      const combinedGalleryArray = [...(formData.gallery || []), ...uploadedGalleryUrls];
      
      // Convert textareas to arrays
      const bodyArray = bodyText.split('\n\n').map(p => p.trim()).filter(p => p !== '');
      
      const submissionData = { ...formData, body: bodyArray, gallery: combinedGalleryArray, image: finalImageUrl };

      const url = currentId ? `/api/sys-ops/event-reports/${currentId}` : '/api/sys-ops/event-reports';
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
        setGalleryFiles([]);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving event report:', error);
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
          Event Reports Management
        </h1>
        {!isEditing && (
          <button
            onClick={() => {
              setFormData(initialForm);
              setBodyText('');
              setImageFile(null);
              setGalleryFiles([]);
              setIsCustomCategory(false);
              setIsEditing(true);
              setCurrentId(null);
            }}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Event Report
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold">{currentId ? 'Edit Event Report' : 'Add Event Report'}</h2>
            <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              {isCustomCategory ? (
                <div className="flex gap-2">
                  <input autoFocus required type="text" placeholder="Enter new category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <button type="button" onClick={() => { setIsCustomCategory(false); setFormData({...formData, category: 'Cultural'}); }} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm hover:bg-gray-200">Cancel</button>
                </div>
              ) : (
                <select required value={uniqueCategories.includes(formData.category) ? formData.category : ''} onChange={e => {
                  if (e.target.value === '__NEW__') {
                    setIsCustomCategory(true);
                    setFormData({...formData, category: ''});
                  } else {
                    setFormData({...formData, category: e.target.value});
                  }
                }} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  {uniqueCategories.map(cat => <option key={cat as string} value={cat as string}>{cat as string}</option>)}
                  <option value="__NEW__" className="font-semibold text-primary">+ Add New Category</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input required type="date" value={parseReadableToYYYYMMDD(formData.date)} onChange={e => setFormData({...formData, date: formatYYYYMMDDToReadable(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Description</label>
            <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modal Lead Text</label>
            <textarea rows={2} value={formData.lead_text} onChange={e => setFormData({...formData, lead_text: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image Upload {currentId && formData.image && <span className="text-xs text-blue-600">(Current: {formData.image.split("/").pop()})</span>}
            </label>
            <input type="file" accept="image/*" onChange={e => {
              if (e.target.files) setImageFile(e.target.files[0]);
            }} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-xs text-green-600 mb-1">Preview:</p>
                <img src={imagePreview} alt="Preview" className="h-32 w-auto object-cover rounded-md border" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body Paragraphs (Separate paragraphs with double enter)</label>
            <textarea rows={6} value={bodyText} onChange={e => setBodyText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Images Upload
            </label>
            {currentId && formData.gallery && formData.gallery.length > 0 && (
              <div className="mb-4 space-y-2">
                <span className="text-sm font-semibold text-gray-700 block">Existing Gallery Images:</span>
                <div className="flex flex-wrap gap-3">
                  {formData.gallery.map((url: string, index: number) => (
                    <div key={index} className="relative w-24 h-24 group">
                      <img src={url} alt={`Existing ${index+1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newGallery = [...formData.gallery];
                          newGallery.splice(index, 1);
                          setFormData({...formData, gallery: newGallery});
                        }} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-700 block">New Images to Upload:</span>
              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((src, i) => (
                  <div key={i} className="relative w-24 h-24 group">
                    <img src={src} alt={`Preview ${i+1}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryFile(i)} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors bg-white">
                  <Plus className="w-8 h-8 mb-1" />
                  <span className="text-xs font-medium">Add Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handleAddGalleryFiles} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" disabled={isUploading}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2" disabled={isUploading}>
              {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isUploading ? 'Saving...' : 'Save Event Report'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grouping</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No event reports found</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month_year && item.month_year.includes('-') 
                        ? formatYYYYMMToMonthYear(item.month_year) 
                        : item.month_year}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{item.category}</span></td>
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
