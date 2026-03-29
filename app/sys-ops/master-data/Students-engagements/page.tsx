"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { ArrowLeft, Users, Image as ImageIcon, Calendar, Award, Crown, UserCog, Mail, Globe, GraduationCap, Leaf, Shield, ShieldCheck } from "lucide-react";

const StudentsEngagementsCards = [
    { id: "students-progression", title: "Students Progression", description: "Manage rank holders, qualifiers, placements & initiatives", href: "/sys-ops/master-data/Students-engagements/students-progression", icon: <Users className="w-6 h-6" />, color: "bg-emerald-600" },
    { id: "college-union", title: "College Union", description: "Manage College Union team, reports, activities, arts & gallery", href: "/sys-ops/master-data/Students-engagements/college-union", icon: <GraduationCap className="w-6 h-6" />, color: "bg-green-700" },
    { id: "em-bio-diversity", title: "EM & Bio Diversity", description: "Manage organizing committee, gallery & contact details", href: "/sys-ops/master-data/Students-engagements/em-and-bio-diversity", icon: <Leaf className="w-6 h-6" />, color: "bg-teal-600" },
    { id: "loyola-nss-unit", title: "Loyola NSS Unit", description: "Manage NSS committee, activities, blood connect, special camp, gallery & contact", href: "/sys-ops/master-data/Students-engagements/loyola-nss-unit", icon: <Shield className="w-6 h-6" />, color: "bg-orange-600" },
    { id: "womens-cell", title: "Women's Cell", description: "Manage committee, admin structure, reports, news, activities, events, gallery & contact", href: "/sys-ops/master-data/Students-engagements/womens-cell", icon: <ShieldCheck className="w-6 h-6" />, color: "bg-pink-600" },
    { id: "loyola-mentoring-programme", title: "Loyola Mentoring Programme", description: "Manage LMP organizing team and mentoring session records", href: "/sys-ops/master-data/Students-engagements/loyola-mentoring-programme", icon: <Globe className="w-6 h-6" />, color: "bg-blue-500" },
    { id: "litcof-management", title: "Loyola-in-the-company-of-friends", description: "Upload and manage LITCOF organizing team, activities, achievements, events & gallery", href: "/sys-ops/master-data/Students-engagements/loyola-in-the-company-of-friends", icon: <ImageIcon className="w-6 h-6" />, color: "bg-blue-600" },
    { id: "lace-management", title: "Loyola Academy for Career Enhancement", description: "Manage LACE organizing team and activities", href: "/sys-ops/master-data/Students-engagements/loyola-academy-for-career-enhancement", icon: <Calendar className="w-6 h-6" />, color: "bg-purple-600" },
    { id: "lila-management", title: "Loyola Initiative for Language Advancement", description: "Manage LILA organizing team and activities", href: "/sys-ops/master-data/Students-engagements/loyola-initiative-for-language-advancement", icon: <Award className="w-6 h-6" />, color: "bg-amber-500" },
    { id: "let-management", title: "Loyola Ethnic Theatre", description: "Manage Loyola Ethnic Theatre organizing team and activities", href: "/sys-ops/master-data/Students-engagements/loyola-ethnographic-theatre", icon: <Crown className="w-6 h-6" />, color: "bg-rose-600" },
=======
import { ArrowLeft, Users, Image as ImageIcon, Calendar, Award, Crown, UserCog, Mail, Globe, Building2 } from "lucide-react";

const StudentsEngagementsCards = [
    { id: "students-associations", title: "Students Associations", description: "Manage student associations, team members, and activities", href: "/sys-ops/master-data/associations", icon: <Building2 className="w-6 h-6" />, color: "bg-teal-600" },
    { id: "students-progression", title: "Students Progression", description: "Manage rank holders, qualifiers, placements & initiatives", href: "/sys-ops/master-data/students-engagements/students-progression", icon: <Users className="w-6 h-6" />, color: "bg-emerald-600" },
    { id: "loyola-mentoring-programme", title: "Loyola Mentoring Programme", description: "Manage LMP organizing team and mentoring session records", href: "/sys-ops/master-data/students-engagements/loyola-mentoring-programme", icon: <Globe className="w-6 h-6" />, color: "bg-blue-500" },
    { id: "litcof-management", title: "Loyola-in-the-company-of-friends", description: "Upload and manage LITCOF organizing team, activities, achievements, events & gallery", href: "/sys-ops/master-data/students-engagements/loyola-in-the-company-of-friends", icon: <ImageIcon className="w-6 h-6" />, color: "bg-blue-600" },
    { id: "lace-management", title: "Loyola Academy for Career Enhancement", description: "Manage LACE organizing team and activities", href: "/sys-ops/master-data/students-engagements/loyola-academy-for-career-enhancement", icon: <Calendar className="w-6 h-6" />, color: "bg-purple-600" },
    { id: "lila-management", title: "Loyola Initiative for Language Advancement", description: "Manage LILA organizing team and activities", href: "/sys-ops/master-data/students-engagements/loyola-initiative-for-language-advancement", icon: <Award className="w-6 h-6" />, color: "bg-amber-500" },
    { id: "let-management", title: "Loyola Ethnic Theatre", description: "Manage Loyola Ethnic Theatre organizing team and activities", href: "/sys-ops/master-data/students-engagements/loyola-ethnographic-theatre", icon: <Crown className="w-6 h-6" />, color: "bg-rose-600" },
>>>>>>> f72620eb4e941589cab04e5d8cef7382e0a2b4ed
]

export default function StudentsEngagements() {
    const router = useRouter();
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push("/sys-ops/master-data")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student Engagement Management</h1>
                    <p className="text-gray-600 text-sm">Manage all student engagement website content and user accounts</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {StudentsEngagementsCards.map((card) => (
                    <Link key={card.id} href={card.href}>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group h-full">
                            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                            <p className="text-gray-500 text-sm">{card.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
