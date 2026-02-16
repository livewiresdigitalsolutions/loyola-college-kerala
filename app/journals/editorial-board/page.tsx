"use client";

import React, { useEffect, useState } from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import BoardMemberCard from "../_components/board/BoardMemberCard";

interface BoardMember {
  id: number;
  name: string;
  role: string;
  designation: string;
  affiliation: string;
  email: string;
  phone?: string;
  image?: string;
  category: string;
  sort_order: number;
}

export default function EditorialBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Editorial Board" },
  ];

  useEffect(() => {
    fetch("/api/journals/board-members")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const editorial = members.filter((m) => m.category === "editorial");
  const board = members.filter((m) => m.category === "board");

  return (
    <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-1 bg-primary rounded-full"></div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center">
            Editorial Board
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16">
              {editorial.map((member) => (
                <BoardMemberCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  designation={member.designation}
                  affiliation={member.affiliation}
                  email={member.email}
                  imageSrc={member.image}
                />
              ))}
            </div>

            {board.length > 0 && (
              <>
                <div className="flex flex-col items-center gap-4 mt-16 mb-8">
                  <div className="w-12 h-1 bg-primary rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                    Board Members
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-8 md:gap-y-12">
                  {board.map((member) => (
                    <BoardMemberCard
                      key={member.id}
                      name={member.name}
                      role={member.role}
                      designation={member.designation}
                      affiliation={member.affiliation}
                      email={member.email}
                      imageSrc={member.image}
                    />
                  ))}
                </div>
              </>
            )}

            {members.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No board members found. Add members from the admin panel.
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
