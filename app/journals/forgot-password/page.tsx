"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../_components/Breadcrumbs";
import { KeyRound, Mail, ShieldCheck, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email!");
        setStep("otp");
        setCooldown(60);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("New OTP sent!");
        setCooldown(60);
        setOtp("");
      } else {
        toast.error(data.error || "Failed to resend OTP");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("OTP verified!");
        setResetToken(data.resetToken);
        setStep("reset");
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/journals/article-submission"), 1500);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Article Submission", href: "/journals/article-submission" },
    { label: "Forgot Password" },
  ];

  const inputClass =
    "w-full px-4 py-3.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 text-sm";

  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-36 pb-16 px-4 md:px-8">
        <div className="max-w-lg mx-auto flex flex-col gap-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Step indicator */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-2">
                {[
                  { key: "email", icon: Mail, label: "Email" },
                  { key: "otp", icon: ShieldCheck, label: "OTP" },
                  { key: "reset", icon: Lock, label: "Reset" },
                ].map((s, i) => (
                  <React.Fragment key={s.key}>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        step === s.key
                          ? "bg-primary text-white"
                          : ["email", "otp", "reset"].indexOf(step) > i
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {["email", "otp", "reset"].indexOf(step) > i ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <s.icon size={14} />
                      )}
                      {s.label}
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-8 h-0.5 rounded ${
                          ["email", "otp", "reset"].indexOf(step) > i
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Step 1: Email */}
              {step === "email" && (
                <form onSubmit={handleSendOTP} className="flex flex-col gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <KeyRound size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Enter your registered email address. We&apos;ll send you a one-time password to verify your identity.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className={inputClass}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  <Link
                    href="/journals/article-submission"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </form>
              )}

              {/* Step 2: OTP Verification */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="flex flex-col gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Enter OTP</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                      We&apos;ve sent a 6-digit code to <strong className="text-foreground">{email}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className={inputClass + " text-center text-2xl tracking-[0.5em] font-mono"}
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || otp.length !== 6}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={cooldown > 0 || isSubmitting}
                      className="text-sm text-primary hover:text-primary/80 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Change Email
                  </button>
                </form>
              )}

              {/* Step 3: Reset Password */}
              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={28} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Set New Password</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className={inputClass}
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
