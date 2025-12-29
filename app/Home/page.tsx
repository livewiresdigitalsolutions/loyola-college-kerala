import AcademicProgrammes from "./components/AcademicPrograms";
import AnnouncementMarquee from "./components/Announcements";
import LoyolaAtAGlance from "./components/Glance";
import Hero from "./components/Hero";
import LatestNews from "./components/LatestNews";


export default function Homepage() {
    return(
        <>
        <Hero/>
        <AnnouncementMarquee/>
        <LoyolaAtAGlance/>
        <AcademicProgrammes/>
        <LatestNews/>
        </>
    );
}