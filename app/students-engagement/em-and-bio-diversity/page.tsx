import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import BioDiversity from "./components/BioDiversity";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";

export const metadata = {
  title: "EM and Bio Diversity | Loyola College Kerala",
  description:
    "Environment Management and Bio Diversity initiatives at Loyola College - maintaining eco-friendly campus with bio-diversity parks and sustainability programmes.",
};

export default function EmBioDiversityPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <BioDiversity />
      <Gallery />
      <Contact />
    </main>
  );
}
