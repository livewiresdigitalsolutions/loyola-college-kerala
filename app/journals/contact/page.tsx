"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function JournalContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/journals/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-36 pb-20 px-4 md:px-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Have questions about the journal, submissions, or subscriptions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setForm({ name: "", email: "", phone: "", message: "" })}
                    className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-foreground/30 rounded-lg"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2.5 text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors rounded-lg shadow-sm disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-primary rounded-xl p-8 text-white shadow-sm">
              <h3 className="text-lg font-bold mb-6">Contact Information</h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Email</p>
                    <a href="mailto:loyolajournal1987@gmail.com" className="text-sm text-white/80 hover:text-white transition-colors">
                      loyolajournal1987@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Phone</p>
                    <a href="tel:+914712591018" className="text-sm text-white/80 hover:text-white transition-colors">
                      +91 471 2591018
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-0.5">Address</p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      Loyola College of Social Sciences,<br />
                      Sreekariyam, Thiruvananthapuram,<br />
                      Kerala 695017, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-3">Office Hours</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-foreground">9:00 AM – 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-foreground">9:00 AM – 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-foreground">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
