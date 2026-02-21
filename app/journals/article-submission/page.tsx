"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJournalAuth } from "../_components/AuthContext";
import AuthModal from "../_components/AuthModal";
import Breadcrumbs from "../_components/Breadcrumbs";
import {
  BookOpen, CheckCircle2, AlertCircle, Send, FileText,
  Shield, Clock, Users, Loader2,
} from "lucide-react";

function ArticleSubmissionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useJournalAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("register");

  // Check for error params
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "login_required" || error === "session_expired") {
      setAuthTab("login");
      setShowAuthModal(true);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/journals/dashboard");
    }
  }, [isAuthenticated, router]);

  const openLogin = () => {
    setAuthTab("login");
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthTab("register");
    setShowAuthModal(true);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Article Submission" },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center pt-36">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={authTab} />

      <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <Breadcrumbs items={breadcrumbItems} />

          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/10 rounded-3xl border border-primary/10 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Send size={24} className="text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Submit Your Research
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mb-8">
                Share your academic work with the scholarly community. Register an account, write your
                article using our rich text editor, and submit it for peer review.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openRegister}
                  className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <FileText size={18} />
                  Get Started — Create Account
                </button>
                <button
                  onClick={openLogin}
                  className="bg-white text-foreground px-8 py-3.5 rounded-xl font-semibold border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  Already a member? Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Users size={22} />, step: "01", title: "Register", desc: "Create your author profile with academic details" },
              { icon: <FileText size={22} />, step: "02", title: "Write", desc: "Use the rich text editor to compose your article" },
              { icon: <Send size={22} />, step: "03", title: "Submit", desc: "Submit your polished article for editorial review" },
              { icon: <CheckCircle2 size={22} />, step: "04", title: "Publish", desc: "Approved articles are published in our journal" },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group">
                <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-3">Step {item.step}</div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Guidelines & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submission Guidelines */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen size={20} className="text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Submission Guidelines</h2>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Articles must be original and not published elsewhere",
                  "Abstract should be between 150-250 words",
                  "Use Univers 10pt font for main text",
                  "Tables must be numbered with exact location in text",
                  "Figures should be editable and titled outside the box",
                  "References: Follow APA 7th edition style",
                  "Maximum word count: 8,000 words including references",
                ].map((guideline, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                    <p>{guideline}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Process */}
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-amber-600" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Peer Review Process</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  All submitted articles undergo a rigorous double-blind peer review process.
                  Our editorial team evaluates each submission for originality, methodology,
                  significance, and clarity of presentation.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={14} className="text-amber-500" />
                  <span>Typical review period: 4-6 weeks</span>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={18} className="text-primary" />
                  <h3 className="font-semibold text-foreground text-sm">Need Help?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  For queries regarding article submission, contact us at{" "}
                  <a href="mailto:loyolajournal1987@gmail.com" className="text-primary font-medium hover:underline">
                    loyolajournal1987@gmail.com
                  </a>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Loyola College of Social Sciences, Thiruvananthapuram-695 017, Kerala, India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ArticleSubmissionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
      <ArticleSubmissionContent />
    </Suspense>
  );
}
