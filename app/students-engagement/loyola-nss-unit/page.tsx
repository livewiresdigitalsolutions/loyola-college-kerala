import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import RegularActivities from "./components/RegularActivities";
import Activities from "./components/Activities";
import BloodConnect from "./components/BloodConnect";
import SpecialCamp from "./components/SpecialCamp";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";

export const metadata = {
  title: "Loyola NSS Unit | Loyola College Kerala",
  description:
    "The first NSS unit under the University of Kerala, functioning in Loyola College with all co-curricular, extra curricular, and field based activities as part of NSS activities.",
};

export default function NssPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <RegularActivities />
      <Activities />
      <BloodConnect />
      <SpecialCamp />
      <Gallery />
      <Contact />
    </main>
  );
}
