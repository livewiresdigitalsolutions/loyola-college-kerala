
import DepartmentsList from "../academics/departments/components/departmentsList";
import DepartmentsPage from "../academics/departments/page";
import AdmissionProcess from "../admission/components/AdmissionProcess";
import AdmissionsHero from "../admission/components/AdmissionsHero";
import StartApplication from "../admission/components/StartApplication";
import AcademicProgrammes from "../Home/components/AcademicPrograms";
import AnnouncementMarquee from "../Home/components/Announcements";
import LoyolaAtAGlance from "../Home/components/Glance";


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