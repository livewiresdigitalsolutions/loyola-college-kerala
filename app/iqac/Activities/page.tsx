import ActivitiesHero from "./components/ActivitiesHero";
import MajorActivities from "./components/MajorActivities";
import IqacReports from "./components/IqacReports";
import IqacTimelines from "./components/IqacTimelines";
import IqacMinutes from "./components/IqacMinutes";

export const metadata = {
    title: "Activities | IQAC | Loyola College of Social Sciences",
    description:
        "IQAC activities, reports, timelines, and minutes at Loyola College of Social Sciences, Kerala.",
};

export default function ActivitiesPage() {
    return (
        <div>
            <ActivitiesHero />
            <MajorActivities />
            <IqacReports />
            <IqacTimelines />
            <IqacMinutes />
        </div>
    );
}
