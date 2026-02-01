import AnnouncementMarquee from "@/app/Home/components/Announcements";
import PgAdmissionsHero from "./components/Hero";
import LoyolaAtAGlance from "@/app/Home/components/Glance";
import AcademicProgrammes from "@/app/Home/components/AcademicPrograms";
import StartApplication from "../components/StartApplication";
import PGProgrammesList from "./components/PgProgrammeslist";


export default function PgAdmissions() {
    return(
        <>
           <PgAdmissionsHero/>
           <AnnouncementMarquee/>
           <LoyolaAtAGlance/>
           <AcademicProgrammes/>
           <PGProgrammesList/>
           <StartApplication/>
        </>
    );
}