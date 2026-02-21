"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Send, FileText, MessageSquare } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useJournalAuth } from "../AuthContext";

export default function ContactSubmission() {
  const { isAuthenticated } = useJournalAuth();
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

  // Logged-in users see a simplified CTA with two action buttons
  if (isAuthenticated) {
    return (
      <section className="w-full bg-primary py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Contribute?
          </h2>
          <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
            Submit your research articles for publication or get in touch with our editorial team for any queries.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <Link
              href="/journals/article-submission"
              className="flex items-center gap-3 bg-secondary text-primary font-bold px-8 py-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <FileText size={20} />
              Submit an Article
            </Link>
            <Link
              href="/journals/contact"
              className="flex items-center gap-3 bg-white/10 text-white border border-white/30 font-bold px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <MessageSquare size={20} />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Guest users see the full Get in Touch form + Article Submission card
  return (
    <section className="w-full bg-primary py-16 px-4 md:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left Column: Get in Touch Form */}
        <div className="flex flex-col gap-6 text-white">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-white/80 text-sm">
              Have questions about submission or subscription? Send us a
              message.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>

            <textarea
              rows={5}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors resize-none"
            ></textarea>

            <div className="flex justify-end items-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => setForm({ name: "", email: "", phone: "", message: "" })}
                className="px-6 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors border border-white/20 hover:border-white/50 rounded-md"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2 text-sm font-bold text-primary bg-secondary hover:bg-secondary/90 transition-colors rounded-md shadow-lg disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Article Submission Card */}
        <div className="bg-white rounded-lg p-8 md:p-10 shadow-xl">
          <h3 className="text-2xl font-bold text-primary mb-6">
            Article Submission
          </h3>

          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Articles of theoretical and empirical nature are welcomed in the
              areas of Social Science. To submit an article, please register to
              the website and submit the article online.
            </p>

            <div className="flex gap-4">
              <button className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-md hover:bg-primary/90 transition-colors shadow-sm">
                Register
              </button>
              <button className="flex-1 bg-background text-foreground border border-border font-bold py-3 rounded-md hover:bg-muted transition-colors shadow-sm">
                Login
              </button>
            </div>

            <div className="h-px bg-border my-2"></div>

            <a
              href="#"
              className="flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline"
            >
              <Download size={16} />
              Download Author Guidelines
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
