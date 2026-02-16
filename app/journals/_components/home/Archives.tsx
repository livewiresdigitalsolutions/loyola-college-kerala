"use client";

import React, { useEffect, useState } from "react";
import JournalCard from "./JournalCard";

interface JournalIssue {
  id: number;
  volume: string;
  issue: string;
  year: string;
  pdf_url?: string;
  cover_image?: string;
}

export default function Archives() {
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journals/issues")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setIssues(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-background py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="w-8 h-1 bg-primary rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Archives
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No journal issues available yet.
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-4">
              {issues.map((issue) => (
                <JournalCard
                  key={issue.id}
                  volume={issue.volume}
                  issue={issue.issue}
                  year={issue.year}
                  pdfUrl={issue.pdf_url}
                  coverImage={issue.cover_image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
