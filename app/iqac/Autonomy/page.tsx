import AutonomyHero from "./components/AutonomyHero";
import AutonomyContent from "./components/AutonomyContent";

export const metadata = {
    title: "Autonomy | IQAC | Loyola College of Social Sciences",
    description:
        "Autonomy documents, committee minutes, and institutional policies – Loyola College of Social Sciences, Kerala.",
};

export default function AutonomyPage() {
    return (
        <div>
            <AutonomyHero />
            <AutonomyContent />
        </div>
    );
}
