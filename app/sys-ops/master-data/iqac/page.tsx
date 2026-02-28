// app/sys-ops/master-data/iqac/page.tsx
import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

const sections = [
    {
        href: "/sys-ops/master-data/iqac/NAAC-Accreditation",
        icon: BookOpen,
        title: "NAAC Accreditation",
        description: "Manage accreditation history, certificates, peer team visits, and newspaper clippings.",
        color: "indigo",
    },
    {
        href: "/sys-ops/master-data/iqac/SSR",
        icon: FileText,
        title: "Self Study Report (SSR)",
        description: "Upload and manage SSR documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/AQARs",
        icon: FileText,
        title: "Annual Quality Assurance Report (AQAR)",
        description: "Upload and manage AQAR documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/AQARs-Format",
        icon: FileText,
        title: "Format of AQARs",
        description: "Upload and manage Formats of AQAR documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/Activities",
        icon: FileText,
        title: "Activities",
        description: "Upload and manage Activities of IQAC.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/Contact-us",
        icon: FileText,
        title: "Contact Us",
        description: "Upload and manage Contact Us details of IQAC.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/Feedback",
        icon: FileText,
        title: "Feedback",
        description: "Upload and manage Feedback documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/Documents",
        icon: FileText,
        title: "Documents",
        description: "Upload and manage Documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
    {
        href: "/sys-ops/master-data/iqac/Autonomy",
        icon: FileText,
        title: "Autonomy",
        description: "Manage Autonomy documents submitted to NAAC for each accreditation cycle.",
        color: "green",
    },
];

export default function IqacMasterDataIndex() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">IQAC Master Data</h1>
                <p className="text-gray-600 mt-1">Select a section below to manage its content.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sections.map(({ href, icon: Icon, title, description, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-indigo-300 transition-all"
                    >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${color === "green" ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"}`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{title}</h2>
                            <p className="text-sm text-gray-500 mt-1">{description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
