"use client";

import { useState, useEffect } from "react";
import { Mail, Phone } from "lucide-react";

interface ContactInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);

  useEffect(() => {
    fetch("/api/students/em-and-bio-diversity?type=contact")
      .then(r => r.json())
      .then(d => { if (d.success) setContacts(d.data || []); })
      .catch(() => {});
  }, []);

  if (contacts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
      <div className="shadow-sm rounded-lg overflow-hidden bg-[#F6F6EE] px-6 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#13432C] mb-6">Contact</h2>
        <div className="space-y-6">
          {contacts.map(contact => (
            <div key={contact.id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.name}</h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-[#13432C] hover:underline text-[15px]"
                  >
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2 text-[#13432C] hover:underline text-[15px]"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
