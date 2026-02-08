import AnnouncementMarquee from "@/app/Home/components/Announcements";
import PgAdmissionsHero from "./components/Hero";
import LoyolaAtAGlance from "@/app/Home/components/Glance";
import AcademicProgrammes from "@/app/Home/components/AcademicPrograms";
import StartApplication from "../components/StartApplication";
import PGProgrammesList from "./components/PgProgrammeslist";
import AdmissionProcess from "./components/AdmissionProcess";


export default function PgAdmissions() {
    return(
        <>
           <PgAdmissionsHero/>
           <AnnouncementMarquee/>
           <PGProgrammesList/>
           {/* <LoyolaAtAGlance/> */}
           {/* <AcademicProgrammes/> */}
           <AdmissionProcess/>
           {/* <StartApplication/> */}
        </>
    );
}