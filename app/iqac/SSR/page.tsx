import React from "react";
import SsrHero from "./components/SsrHero";
import SsrDocuments from "./components/SsrDocuments";

export const metadata = {
    title: "Self Study Report (SSR) | IQAC | Loyola College of Social Sciences",
    description:
        "Self Study Reports submitted to NAAC for accreditation – Loyola College of Social Sciences, Kerala.",
};

export default function SsrPage() {
    return (
        <div>
            <SsrHero />
            <SsrDocuments />
        </div>
    );
}
