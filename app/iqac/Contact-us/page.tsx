import ContactUsHero from "./components/ContactUsHero";
import ContactCard from "./components/ContactCard";

export const metadata = {
    title: "Contact Us | IQAC | Loyola College of Social Sciences",
    description:
        "Contact the Internal Quality Assurance Cell at Loyola College of Social Sciences, Kerala.",
};

export default function ContactUsPage() {
    return (
        <div>
            <ContactUsHero />
            <ContactCard />
        </div>
    );
}
