import React from "react";
import Hero from "./_components/home/Hero";
import Archives from "./_components/home/Archives";
import TopArticles from "./_components/home/TopArticles";
import ContactSubmission from "./_components/home/ContactSubmission";

export default function page() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <TopArticles />
      <Archives />
      <ContactSubmission />
    </main>
  );
}
