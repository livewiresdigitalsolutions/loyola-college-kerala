"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJournalAuth } from "./AuthContext";
import {
  X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle,
  UserPlus, LogIn, BookOpen, ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana", "Haiti",
  "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Liberia", "Libya", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine",
  "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];



interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const { login } = useJournalAuth();

  const [activeTab, setActiveTab] = useState<"register" | "login">(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Result modal
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ show: false, type: "success", title: "", message: "" });

  // Registration form
  const [regForm, setRegForm] = useState({
    salutation: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    designation: "",
    affiliation: "",
    country: "",
    city: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, defaultTab]);

  const validateRegForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!regForm.first_name.trim()) errors.first_name = "First name is required";
    if (!regForm.last_name.trim()) errors.last_name = "Last name is required";
    if (!regForm.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email)) errors.email = "Invalid email format";
    if (!regForm.password) errors.password = "Password is required";
    else if (regForm.password.length < 8) errors.password = "Minimum 8 characters";
    if (regForm.password !== regForm.confirmPassword) errors.confirmPassword = "Passwords don't match";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!loginForm.email.trim()) errors.email = "Email is required";
    if (!loginForm.password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const showResult = (type: "success" | "error", title: string, message: string) => {
    setResultModal({ show: true, type, title, message });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegForm()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/journals/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salutation: regForm.salutation,
          first_name: regForm.first_name,
          middle_name: regForm.middle_name,
          last_name: regForm.last_name,
          designation: regForm.designation,
          affiliation: regForm.affiliation,
          country: regForm.country,
          city: regForm.city,
          email: regForm.email,
          phone: regForm.phone,
          address: regForm.address,
          password: regForm.password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showResult("success", "Account Created!", "Your account has been created successfully. Please login to continue.");
        setTimeout(() => {
          setResultModal({ show: false, type: "success", title: "", message: "" });
          setActiveTab("login");
          setLoginForm({ email: regForm.email, password: "" });
        }, 2000);
      } else {
        showResult("error", "Registration Failed", data.error || "Something went wrong. Please try again.");
      }
    } catch {
      showResult("error", "Connection Error", "Unable to connect to the server. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    setIsSubmitting(true);

    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result.success) {
        showResult("success", "Welcome Back!", "Login successful. Redirecting to your dashboard...");
        setTimeout(() => {
          onClose();
          router.push("/journals/dashboard");
        }, 1500);
      } else {
        showResult("error", "Login Failed", result.error || "Invalid email or password. Please try again.");
      }
    } catch {
      showResult("error", "Connection Error", "Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = (fieldName: string) =>
    `w-full px-4 py-2.5 rounded-lg border ${
      fieldErrors[fieldName] ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-white"
    } focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 text-sm`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Loyola Journal</h2>
                <p className="text-[11px] text-muted-foreground">Article Submission Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setActiveTab("login"); setFieldErrors({}); }}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "login"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab("register"); setFieldErrors({}); }}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                activeTab === "register"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <UserPlus size={15} />
              Create Account
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-5">
            {/* LOGIN FORM */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto py-4">
                <div className="text-center mb-2">
                  <h3 className="text-xl font-bold text-foreground">Welcome Back</h3>
                  <p className="text-xs text-muted-foreground mt-1">Sign in to manage your articles</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setFieldErrors({}); }}
                    placeholder="your@email.com"
                    className={inputClass("email")}
                  />
                  {fieldErrors.email && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.email}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setFieldErrors({}); }}
                      placeholder="Enter password"
                      className={inputClass("password") + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.password}</span>}
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/journals/forgot-password"
                    onClick={onClose}
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("register"); setFieldErrors({}); }} className="text-primary font-semibold hover:underline">
                    Create one
                  </button>
                </p>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <div className="text-center mb-1">
                  <h3 className="text-xl font-bold text-foreground">Create Account</h3>
                  <p className="text-xs text-muted-foreground mt-1">Register to submit research articles</p>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Title</label>
                    <select
                      value={regForm.salutation}
                      onChange={(e) => setRegForm({ ...regForm, salutation: e.target.value })}
                      className={inputClass("salutation")}
                    >
                      <option value="">—</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>
                  <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">First Name *</label>
                    <input
                      type="text"
                      value={regForm.first_name}
                      onChange={(e) => { setRegForm({ ...regForm, first_name: e.target.value }); if(fieldErrors.first_name) setFieldErrors({...fieldErrors, first_name: ""}); }}
                      placeholder="First name"
                      className={inputClass("first_name")}
                    />
                    {fieldErrors.first_name && <span className="text-[10px] text-red-500">{fieldErrors.first_name}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Middle Name</label>
                    <input type="text" value={regForm.middle_name} onChange={(e) => setRegForm({ ...regForm, middle_name: e.target.value })} placeholder="Middle name" className={inputClass("")} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Last Name *</label>
                    <input
                      type="text"
                      value={regForm.last_name}
                      onChange={(e) => { setRegForm({ ...regForm, last_name: e.target.value }); if(fieldErrors.last_name) setFieldErrors({...fieldErrors, last_name: ""}); }}
                      placeholder="Last name"
                      className={inputClass("last_name")}
                    />
                    {fieldErrors.last_name && <span className="text-[10px] text-red-500">{fieldErrors.last_name}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Designation</label>
                    <input type="text" value={regForm.designation} onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })} placeholder="e.g. Asst. Prof." className={inputClass("")} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Affiliation</label>
                    <input type="text" value={regForm.affiliation} onChange={(e) => setRegForm({ ...regForm, affiliation: e.target.value })} placeholder="University / Institution" className={inputClass("")} />
                  </div>
                </div>



                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Country</label>
                  <select
                    value={regForm.country}
                    onChange={(e) => setRegForm({ ...regForm, country: e.target.value })}
                    className={inputClass("country")}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Email *</label>
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => { setRegForm({ ...regForm, email: e.target.value }); if(fieldErrors.email) setFieldErrors({...fieldErrors, email: ""}); }}
                      placeholder="your@email.com"
                      className={inputClass("email")}
                    />
                    {fieldErrors.email && <span className="text-[10px] text-red-500">{fieldErrors.email}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Phone</label>
                    <input type="tel" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputClass("")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={regForm.password}
                        onChange={(e) => { setRegForm({ ...regForm, password: e.target.value }); if(fieldErrors.password) setFieldErrors({...fieldErrors, password: ""}); }}
                        placeholder="Min 8 characters"
                        className={inputClass("password") + " pr-9"}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="text-[10px] text-red-500">{fieldErrors.password}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={regForm.confirmPassword}
                        onChange={(e) => { setRegForm({ ...regForm, confirmPassword: e.target.value }); if(fieldErrors.confirmPassword) setFieldErrors({...fieldErrors, confirmPassword: ""}); }}
                        placeholder="Re-enter password"
                        className={inputClass("confirmPassword") + " pr-9"}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <span className="text-[10px] text-red-500">{fieldErrors.confirmPassword}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm mt-2"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : "Create Account"}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setActiveTab("login"); setFieldErrors({}); }} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Result Modal (Success / Error popup) */}
      {resultModal.show && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[110]" />
          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                resultModal.type === "success" ? "bg-green-50" : "bg-red-50"
              }`}>
                {resultModal.type === "success" ? (
                  <CheckCircle2 size={32} className="text-green-500" />
                ) : (
                  <AlertCircle size={32} className="text-red-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{resultModal.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{resultModal.message}</p>
              <button
                onClick={() => setResultModal({ ...resultModal, show: false })}
                className={`w-full py-2.5 rounded-xl font-semibold text-white transition-colors ${
                  resultModal.type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {resultModal.type === "success" ? "Continue" : "Try Again"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
