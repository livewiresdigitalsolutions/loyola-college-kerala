// app/about/page.tsx
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import LegacySection from './components/LegacySection';
import FacultySection from './components/FacultySection';
import WhyChooseSection from './components/WhyChooseSection';
import CareersSection from './components/CareersSection';

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      <HeroSection />
      <AboutSection />
      <LegacySection />
      {/* <FacultySection /> */}
      <WhyChooseSection />
      {/* <CareersSection /> */}
    </main>
  );
}
