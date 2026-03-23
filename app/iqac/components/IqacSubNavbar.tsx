"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/iqac/" },
    { label: "NAAC Accreditation", href: "/iqac/NAAC-Accreditation" },
    { label: "SSR", href: "/iqac/SSR" },
    { label: "AQARs", href: "/iqac/AQARs" },
    { label: "Formats", href: "/iqac/AQARs-Formats" },
    { label: "Activities", href: "/iqac/Activities" },
    { label: "Feedback", href: "/iqac/Feedback" },
    { label: "Documents", href: "/iqac/Documents" },
    { label: "Contact Us", href: "/iqac/Contact-us" },
    { label: "Autonomy", href: "/iqac/Autonomy" },
];

export default function IqacSubNavbar() {
    const pathname = usePathname();

    return (
        <div>   
            {/* Navigation Bar */}
            <div className="bg-[#F6F6EE] border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center">
                        {/* Navigation Links */}
                        <nav className="flex items-center gap-0 overflow-x-auto scrollbar-hide py-0">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors
                                            ${isActive
                                                ? "border-primary text-primary font-semibold"
                                                : "border-transparent text-gray-600 hover:text-primary hover:border-primary/50"
                                            }
                                        `}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
<div className = "mb-10"></div>
            {/* IQAC Banner Image */}
            <div className="mb-6 max-w-7xl mx-auto px-6">
                <Image
                    src="/iqac/iqac-banner.png"
                    alt="Internal Quality Assurance Cell"
                    width={1920}
                    height={500}
                    className="gap-6 lg:h-auto h-15 object-cover"
                    priority
                />
            </div>
        </div>
    );
}
