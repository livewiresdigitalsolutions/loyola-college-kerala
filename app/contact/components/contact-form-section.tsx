'use client';

import { Clock, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react';

export default function ContactFormSection() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loadingHours, setLoadingHours] = useState(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    inquiry_type: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const res = await fetch('/api/sys-ops/contact');
        if (res.ok) {
          const data = await res.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoadingHours(false);
      }
    }
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/sys-ops/contact-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          inquiry_type: '',
          message: ''
        });
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const weekdays = contactInfo?.office_hours_weekdays || 'Not set';
  const saturday = contactInfo?.office_hours_saturday || 'Not set';
  const sunday = contactInfo?.office_hours_sunday || 'Not set';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left Column: Campus Timings */}
        <div className="flex flex-col justify-center max-w-lg">
          <span className="inline-block bg-[#F4F7F2] text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full w-max mb-6">
            WORKING HOURS
          </span>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-[#1B4235] mb-6 leading-tight tracking-tight">
            Campus Timings
          </h2>
          <p className="text-[#7D9183] text-[15px] mb-12 leading-relaxed max-w-sm">
            Our administrative offices are open during regular college hours. We recommend scheduling an appointment prior to your visit.
          </p>

          <div className="flex flex-col gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E8F0EA] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[#1B4235] font-bold text-[15px] mb-1">Monday - Friday</h4>
                <p className="text-[#7D9183] text-sm">
                  {loadingHours ? <span className="animate-pulse bg-gray-200 h-4 w-32 rounded inline-block"></span> : weekdays}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E8F0EA] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[#1B4235] font-bold text-[15px] mb-1">Saturday</h4>
                <p className="text-[#7D9183] text-sm whitespace-pre-line">
                  {loadingHours ? <span className="animate-pulse bg-gray-200 h-4 w-32 rounded inline-block"></span> : saturday}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FCE8E8] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#E55A5A]" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-[#1B4235] font-bold text-[15px] mb-1">Sunday & Public Holidays</h4>
                <p className="text-[#7D9183] text-sm">
                  {loadingHours ? <span className="animate-pulse bg-gray-200 h-4 w-32 rounded inline-block"></span> : sunday}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-[#F4F7F2] p-8 sm:p-12 relative overflow-hidden h-max">
          {/* Decorative shapes behind form */}
          <div className="absolute top-[-40%] right-[-40%] w-[500px] h-[500px] bg-[#EBEFDF] rounded-full  pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Send us a Message
            </h2>
            <p className="text-[#7D9183] text-sm mb-10 leading-relaxed max-w-sm">
              Fill out the form below and our administrative team will get back to you within 24-48 business hours.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md flex items-start gap-3 border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                  <p className="text-sm mt-1">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                {submitError}
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-primary text-xs font-bold mb-2">First Name</label>
                  <input required name="first_name" value={formData.first_name} onChange={handleChange} type="text" placeholder="John" className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-gray-400 text-sm text-gray-700" />
                </div>
                <div>
                  <label className="block text-primary text-xs font-bold mb-2">Last Name</label>
                  <input required name="last_name" value={formData.last_name} onChange={handleChange} type="text" placeholder="Doe" className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-gray-400 text-sm text-gray-700" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-primary text-xs font-bold mb-2">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-gray-400 text-sm text-gray-700" />
                </div>
                <div>
                  <label className="block text-primary text-xs font-bold mb-2">Phone Number (Optional)</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 XXX XXX XXXX" className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-gray-400 text-sm text-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-primary text-xs font-bold mb-2">Inquiry Type</label>
                <select required name="inquiry_type" value={formData.inquiry_type} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none text-sm text-gray-700 appearance-none">
                  <option value="" disabled className="text-gray-400">Select an option</option>
                  <option value="Admissions">Admissions</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Alumni Relations">Alumni Relations</option>
                  <option value="Careers">Careers</option>
                </select>
              </div>

              <div>
                <label className="block text-primary text-xs font-bold mb-2">Message</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="How can we help you?" className="w-full px-4 py-3.5 bg-white border border-transparent rounded-[4px] focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-gray-400 text-sm text-gray-700 resize-none"></textarea>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-white font-bold text-[15px] py-4 rounded-[4px] mt-4 flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <><Loader2 className="w-[18px] h-[18px] animate-spin" /> Sending...</>
                ) : (
                  <>Send Message <Send className="w-[18px] h-[18px]" strokeWidth={2.5} /></>
                )}
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  )
}
