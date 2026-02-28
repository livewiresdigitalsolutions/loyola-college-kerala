import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import Objectives from "./components/Objectives";
import Activities from "./components/Activities";
import Achievements from "./components/Achievements";
import Gallery from "./components/Gallery";

export const metadata = {
  title: "Loyola Academy for Career Enhancement (LACE) | Loyola College Kerala",
  description:
    "LACE - Loyola Academy for Career Enhancement - a complementary academic programme to equip students for competitive exams and emerging career opportunities.",
};

export default function LacePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <Objectives />
      <Activities />
      <Achievements />
      <Gallery />
    </main>
  );
}
