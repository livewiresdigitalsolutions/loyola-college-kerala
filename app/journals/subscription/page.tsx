import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import { BookOpen } from "lucide-react";

export default function OnlineSubscriptionPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Online Subscription" },
  ];

  return (
    <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="flex flex-col gap-4">
          <div className="w-12 h-1 bg-primary rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Online Subscription
          </h1>
          <p className="text-muted-foreground text-lg">
            Subscribe to get full access to our journal archives and print
            editions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                New Subscription Registration
              </h2>

              <form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Name of Person/Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone No
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter Phone No"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Password"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter Confirm Password"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Country"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Enter State"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Enter City"
                      className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter Address"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-[#0F392B] text-white px-8 py-3 rounded-md font-medium hover:bg-[#0F392B]/90 transition-colors"
                  >
                    Register Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="flex flex-col gap-8">
            {/* Login Card */}
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#0F392B] mb-2">
                Already a member?
              </h2>
              <h2 className="text-xl font-bold text-[#0F392B] mb-6">
                Login here.
              </h2>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-md border border-input bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-[#f8f9fa] border border-border text-[#0F392B] font-bold py-3 rounded-md hover:bg-muted transition-colors mt-2"
                >
                  Login
                </button>
              </form>
            </div>

            {/* Instructions Card */}
            <div className="bg-[#0F392B] rounded-lg p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-6 text-white">
                <BookOpen size={20} className="text-[#F2C94C]" />
                <h2 className="text-lg font-bold">Instructions</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[#F2C94C] text-xs font-bold uppercase tracking-wider mb-2">
                    DELIVERY
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Subscription includes print copy delivered by post and
                    e-version.
                  </p>
                </div>

                <div className="w-full h-px bg-white/10"></div>

                <div>
                  <h3 className="text-[#F2C94C] text-xs font-bold uppercase tracking-wider mb-2">
                    PAYMENT METHODS
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    Payment can be made by demand draft in favour of the Chief
                    Editor;
                  </p>

                  <div className="bg-white/10 p-4 rounded text-xs text-white/90 leading-relaxed">
                    Loyola Journal of Social Sciences,
                    <br />
                    Sreekariyam PO,
                    <br />
                    Thiruvananthapuram-695 017,
                    <br />
                    Kerala, India
                  </div>

                  <p className="text-sm text-white/80 mt-4">
                    ...or through online mode.
                  </p>
                  <p className="text-xs text-white/80 mt-2 italic">
                    * Cheques are not acceptable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
