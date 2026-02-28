"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface Committee {
  id: number;
  name: string;
  description: string | null;
  type: string | null;
  sort_order: number;
}

interface CommitteeMember {
  id: number;
  committee_id: number;
  name: string;
  designation: string | null;
  image: string | null;
  sort_order: number;
}

export default function Committees() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [committeesRes, membersRes] = await Promise.all([
          fetch("/api/academics/committees"),
          fetch("/api/academics/committee-members"),
        ]);
        if (committeesRes.ok) {
          const data = await committeesRes.json();
          setCommittees(data);
          if (data.length > 0) setExpandedId(data[0].id);
        }
        if (membersRes.ok) setMembers(await membersRes.json());
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getMembersForCommittee = (committeeId: number) =>
    members.filter((m) => m.committee_id === committeeId);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (committees.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No committees found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Committees
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Dedicated committees working together to ensure academic excellence,
            student welfare, and institutional governance.
          </p>
        </div>

        {/* Committees accordion */}
        <div className="space-y-4">
          {committees.map((committee) => {
            const committeeMembers = getMembersForCommittee(committee.id);
            const isExpanded = expandedId === committee.id;

            return (
              <div
                key={committee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
              >
                {/* Committee header */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : committee.id)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {committee.name}
                      </h3>
                      {committee.type && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {committee.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {committeeMembers.length} member
                      {committeeMembers.length !== 1 ? "s" : ""}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6">
                    {committee.description && (
                      <p className="text-gray-600 mb-6">
                        {committee.description}
                      </p>
                    )}

                    {committeeMembers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {committeeMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  member.image || "/assets/defaultprofile.png"
                                }
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {member.name}
                              </p>
                              {member.designation && (
                                <p className="text-xs text-gray-500 truncate">
                                  {member.designation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No members added yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
