import React from "react";
import IqacHero from "./components/IqacHero";
import IqacAbout from "./components/IqacAbout";
import IqacMembers from "./components/IqacMembers";

export const metadata = {
    title: "IQAC | Loyola College of Social Sciences",
    description:
        "Internal Quality Assurance Cell – committed to continuous quality improvement and academic excellence at Loyola College of Social Sciences, Kerala.",
};

export default function IqacHomePage() {
    return (
        <div>
            <IqacHero />
            <IqacAbout />
            <IqacMembers />
        </div>
    );
}
