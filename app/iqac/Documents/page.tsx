import DocumentsHero from "./components/DocumentsHero";
import DocumentsContent from "./components/DocumentsContent";

export const metadata = {
    title: "Documents | IQAC | Loyola College of Social Sciences",
    description:
        "Official IQAC documents, policies, and reports – Loyola College of Social Sciences, Kerala.",
};

export default function DocumentsPage() {
    return (
        <div>
            <DocumentsHero />
            <DocumentsContent />
        </div>
    );
}
