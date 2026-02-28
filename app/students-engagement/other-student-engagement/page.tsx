import Hero from "./components/hero";
import Situp from "./components/Situp";

export const metadata = {
  title: "Other Student Engagement | Loyola College Kerala",
  description:
    "SITUP - Student IT Upgradation Program and other student engagement initiatives at Loyola College.",
};

export default function OtherStudentEngagementPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Situp />
      {/* Add more engagement accordions here as needed */}
    </main>
  );
}
