import React from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

interface BoardMemberProps {
  name: string;
  role: string;
  designation: string;
  affiliation: string;
  email: string;
  imageSrc?: string;
}

export default function BoardMemberCard({
  name,
  role,
  designation,
  affiliation,
  email,
  imageSrc,
}: BoardMemberProps) {
  return (
    <div className="flex flex-col gap-4 group">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-muted/20">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
      </div>

      {/* Green Separator */}
      <div className="w-8 h-1 bg-primary rounded-full"></div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-foreground">{name}</h3>
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
          {role}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{designation}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {affiliation}
        </p>

        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
        >
          <Mail size={12} />
          {email}
        </a>
      </div>
    </div>
  );
}
