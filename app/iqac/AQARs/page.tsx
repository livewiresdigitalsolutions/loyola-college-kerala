import React from "react";
import AqarHero from "./components/AqarHero";
import AqarDocuments from "./components/AqarDocuments";

export const metadata = {
    title: "Annual Quality Assurance Reports (AQAR) | IQAC | Loyola College of Social Sciences",
    description:
        "Annual Quality Assurance Reports submitted to NAAC for accreditation cycles – Loyola College of Social Sciences, Kerala.",
};

export default function AqarPage() {
    return (
        <div>
            <AqarHero />
            <AqarDocuments />
        </div>
    );
}
