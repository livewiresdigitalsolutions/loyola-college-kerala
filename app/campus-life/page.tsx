import HeroSection from "./components/HeroSection";
import CampusLifeList from "./components/CampusLifeList";

export default function CampusLifePage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <HeroSection />
            <CampusLifeList />
        </main>
    );
}
