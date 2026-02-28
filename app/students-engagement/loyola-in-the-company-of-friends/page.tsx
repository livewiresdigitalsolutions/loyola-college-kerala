import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import Activities from "./components/Activities";
import Achievements from "./components/Achievements";
import Events from "./components/Events";
import Gallery from "./components/Gallery";

export const metadata = {
  title: "Loyola in the Company of Friends (LITCOF) | Loyola College Kerala",
  description:
    "LITCOF - Loyola In The Company Of Friends - an interdepartmental collaboration of five departments of Loyola College of Social Sciences providing multidimensional skills for students.",
};

export default function LitcofPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <Activities />
      <Achievements />
      <Events />
      <Gallery />
    </main>
  );
}
