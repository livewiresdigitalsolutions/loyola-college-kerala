import FeedbackHero from "./components/FeedbackHero";
import FeedbackContent from "./components/FeedbackContent";

export const metadata = {
    title: "Feedback | IQAC | Loyola College of Social Sciences",
    description:
        "Download IQAC feedback forms and access action taken reports – Loyola College of Social Sciences, Kerala.",
};

export default function FeedbackPage() {
    return (
        <div>
            <FeedbackHero />
            <FeedbackContent />
        </div>
    );
}
