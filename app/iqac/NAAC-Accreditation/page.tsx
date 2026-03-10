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
            <NaacHistory />
            <NaacCertificates />
            <NaacPeerVisits />
            <NaacNewspaperClippings />
        </div>
    );
}
