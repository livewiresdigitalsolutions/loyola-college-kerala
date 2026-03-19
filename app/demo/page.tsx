
import DepartmentsList from "../academics/departments/components/departmentsList";
import DepartmentsPage from "../academics/departments/page";
import AdmissionProcess from "../admission/components/AdmissionProcess";
import AdmissionsHero from "../admission/components/AdmissionsHero";
import StartApplication from "../admission/components/StartApplication";
import AcademicProgrammes from "../home/components/AcademicPrograms";
import AnnouncementMarquee from "../home/components/Announcements";
import LoyolaAtAGlance from "../home/components/Glance";


export default function Demopage() {
    return(
        <>
            <AdmissionsHero/>
            <AnnouncementMarquee/>
            <LoyolaAtAGlance/>
            <AdmissionProcess/>
            <AcademicProgrammes/>
            {/* <DepartmentsList/> */}
            <StartApplication/>
        </>
    );
}