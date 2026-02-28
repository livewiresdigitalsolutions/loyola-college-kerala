import React from "react";
import AqarFormatsHero from "./components/AqarFormatsHero";
import AqarFormatDocuments from "./components/AqarFormatDocuments";

export const metadata = {
    title: "AQAR Formats | IQAC | Loyola College of Social Sciences",
    description:
        "Download AQAR format documents, forms, and templates for institutional documentation – Loyola College of Social Sciences, Kerala.",
};

export default function AqarFormatsPage() {
    return (
        <div>
            <AqarFormatsHero />
            <AqarFormatDocuments />
        </div>
    );
}
