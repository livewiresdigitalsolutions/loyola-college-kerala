import AnnouncementMarquee from "@/app/home/components/Announcements";
import PgAdmissionsHero from "./components/Hero";
import LoyolaAtAGlance from "@/app/home/components/Glance";
import AcademicProgrammes from "@/app/home/components/AcademicPrograms";
import StartApplication from "../components/StartApplication";
import PGProgrammesList from "./components/PgProgrammeslist";
import AdmissionProcess from "./components/AdmissionProcess";


export default function PgAdmissions() {
    return(
        <>
           <PgAdmissionsHero/>
           <AdmissionProcess/>
           {/* <AnnouncementMarquee/> */}
           <PGProgrammesList/>
           {/* <LoyolaAtAGlance/> */}
           {/* <AcademicProgrammes/> */}
           
           {/* <StartApplication/> */}
        </>
    );
}