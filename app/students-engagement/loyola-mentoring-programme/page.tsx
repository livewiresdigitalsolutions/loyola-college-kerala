import Hero from "./components/Hero";
import About from "./components/About";
import OrganizingTeam from "./components/OrganizingTeam";
import MentoringSessions from "./components/MentoringSessions";

export const metadata = {
  title: "Loyola Mentoring Programme (LMP) | Loyola College Kerala",
  description:
    "The Loyola Mentoring Programme (LMP) is designed to support students' personal wellbeing and professional advancement through caring mentor-mentee relationships.",
};

export default function LoyolaMentoringProgrammePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
      <OrganizingTeam />
      <MentoringSessions />
    </main>
  );
}
