import React from "react";
import NaacHero from "./components/Naac-Hero";
import NaacHistory from "./components/NaacHistory";
import NaacCertificates from "./components/NaacCertificates";
import NaacPeerVisits from "./components/NaacPeerVisits";
import NaacNewspaperClippings from "./components/NaacNewspaperClippings";

export const metadata = {
    title: "NAAC Accreditation | IQAC | Loyola College of Social Sciences",
    description:
        "NAAC Accreditation history, certificates, peer team visits, and newspaper clippings – Loyola College of Social Sciences, Kerala.",
};

export default function NaacAccreditationPage() {
    return (
        <div>
            <NaacHero />
            {/* Breadcrumb */}
            <div className="bg-gray-100 border-b border-gray-200 py-2">
                <div className="max-w-7xl mx-auto px-6 text-xs text-gray-500">
                    <span>Home</span>
                    <span className="mx-1.5">›</span>
                    <span>NAAC Accreditation</span>
                </div>
            </div>

            <NaacHistory />
            <NaacCertificates />
            <NaacPeerVisits />
            <NaacNewspaperClippings />
        </div>
    );
}
