import HeroSection from "./components/HeroSection";
import CurrentOpeningsSection from "./components/CurrentOpeningsSection";

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-white text-gray-900">
            <HeroSection />
            <CurrentOpeningsSection />
        </main>
    );
}
