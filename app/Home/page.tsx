import AcademicProgrammes from "./components/AcademicPrograms";
import AnnouncementMarquee from "./components/Announcements";
import CampusLife from "./components/campuslife";
import Cta from "./components/cta";
import LoyolaAtAGlance from "./components/Glance";
import Hero from "./components/Hero";
import InstitutionalExcellence from "./components/InstitutionalExcellence";
import LatestNews from "./components/LatestNews";


export default function Homepage() {
    return(
        <>
        <Hero/>
        <AnnouncementMarquee/>
        <LoyolaAtAGlance/>
        <AcademicProgrammes/>
        <InstitutionalExcellence />
        <CampusLife />
        <LatestNews/>
        <Cta />
        </>
    );
}