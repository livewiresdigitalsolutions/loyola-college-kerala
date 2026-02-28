import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import Objectives from "./components/Objectives";
import Activities from "./components/Activities";
import SelectionProcess from "./components/SelectionProcess";
import Topics from "./components/Topics";
import Gallery from "./components/Gallery";

export const metadata = {
  title: "Loyola Initiative for Language Advancement (LILA) | Loyola College Kerala",
  description:
    "LILA - Loyola Initiative for Language Advancement - a comprehensive English language proficiency enhancement course focusing on listening, speaking, reading and writing.",
};

export default function LilaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <Objectives />
      <Activities />
      <SelectionProcess />
      <Topics />
      <Gallery />
    </main>
  );
}
