import React from "react";
import Hero from "./_components/home/Hero";
import Archives from "./_components/home/Archives";

export default function page() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Archives />
    </main>
  );
}
