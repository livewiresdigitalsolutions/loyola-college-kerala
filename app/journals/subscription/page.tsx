import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import { BookOpen, Clock, Bell } from "lucide-react";

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

        {/* Coming Soon Card */}
        <div className="flex flex-col items-center justify-center py-16 md:py-24">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Clock size={40} className="text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Bell size={16} className="text-amber-600" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-center">
            Coming Soon
          </h2>
          <p className="text-muted-foreground text-center max-w-lg text-lg leading-relaxed mb-8">
            We&apos;re working on building our online subscription portal. 
            Stay tuned for a seamless way to subscribe to the Loyola Journal of Social Sciences.
          </p>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 max-w-md w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <BookOpen size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground text-sm">
                Subscribe Offline
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              In the meantime, you can subscribe via demand draft in favour of the Chief Editor:
            </p>
            <div className="bg-white rounded-lg p-4 text-sm text-foreground/80 leading-relaxed border border-border">
              Loyola Journal of Social Sciences,<br />
              Sreekariyam PO,<br />
              Thiruvananthapuram-695 017,<br />
              Kerala, India
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              * Cheques are not acceptable.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
