import Hero from "./components/hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import AdminStructure from "./components/AdminStructure";
import Reports from "./components/Reports";
import News from "./components/News";
import Activities from "./components/Activities";
import Events from "./components/Events";
import RegisterComplaint from "./components/RegisterComplaint";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";

export const metadata = {
  title: "Women Cell | Loyola College Kerala",
  description:
    "Women Cell of Loyola College - initiated in 2018 to empower women through creative programmes, training, and social commitment.",
};

export default function WomensCellPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <AdminStructure />
      <Reports />
      <News />
      <Activities />
      <Events />
      <RegisterComplaint />
      <Gallery />
      <Contact />
    </main>
  );
}
