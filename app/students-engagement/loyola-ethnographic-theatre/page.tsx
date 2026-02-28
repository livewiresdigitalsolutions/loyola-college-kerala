import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import SuggestedThemes from "./components/SuggestedThemes";
import Activities from "./components/Activities";
import Gallery from "./components/Gallery";

export const metadata = {
  title: "Loyola Ethnographic Theatre (LET) | Loyola College Kerala",
  description:
    "LET - Loyola Ethnographic Theatre - an alternative means of presenting scholarly results through visual ethnography, short films, and social awareness.",
};

export default function LetPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <SuggestedThemes />
      <Activities />
      <Gallery />
    </main>
  );
}
