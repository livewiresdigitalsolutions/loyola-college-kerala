import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import UnionReports from "./components/UnionReports";
import Activities from "./components/Activities";
import Arts from "./components/Arts";
import Gallery from "./components/Gallery";

export const metadata = {
  title: "College Union | Loyola College Kerala",
  description:
    "The Loyola College students union - responsibly promoting and developing the talents of all students through educative, creative and cultural programmes.",
};

export default function CollegeUnionPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <UnionReports />
      <Activities />
      <Arts />
      <Gallery />
    </main>
  );
}
