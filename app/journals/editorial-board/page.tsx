import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import BoardMemberCard from "../_components/board/BoardMemberCard";

const boardMembers = [
  {
    name: "Dr. Saji P Jacob",
    role: "Editor In Chief",
    designation: "Principal",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India.",
    email: "sajipjacob@yahoo.com",
    imageSrc: "/assets/saji-jacob.jpg",
  },
  {
    name: "Dr. Prakash Pillai R",
    role: "Editor",
    designation: "Assistant Professor, PG Dept. of Personnel Management",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India.",
    email: "prakashpillair@gmail.com",
    imageSrc: "/assets/prakash-pillai.jpg",
  },
  {
    name: "Dr. Betty C Mubangizi",
    role: "Overseas Editor",
    designation: "Professor",
    affiliation: "University of KwaZulu-Natal, South Africa",
    email: "bettywni256@gmail.com",
    imageSrc: "/assets/betty-mubangizi.jpg",
  },
];

const otherBoardMembers = [
  {
    name: "Prof. Ann Denis",
    role: "Professor Emeritus",
    designation: "",
    affiliation: "University of Ottawa",
    email: "adenis@uottawa.ca",
    phone: "6135625800(1629)",
    imageSrc: "/assets/ann-denis.jpg",
  },
  {
    name: "Fr. M K George S. J",
    role: "Regional Assistant",
    designation: "",
    affiliation: "South Asian Jesuit Assistancy, Rome",
    email: "mkgqsj@yahoo.com",
    imageSrc: "/assets/mk-george.jpg",
  },
  {
    name: "Dr. Gurupreet Bal",
    role: "Faculty",
    designation: "Dept. of Sociology",
    affiliation: "Guru Nanak University",
    email: "bal.hudge@gmail.com",
    phone: "9872219902",
    imageSrc: "/assets/gurupreet-bal.jpg",
  },
  {
    name: "Dr. Michael Tharakan",
    role: "Former VC",
    designation: "",
    affiliation: "Kannur University",
    email: "michaeltharakan@yahoo.com",
    imageSrc: "/assets/michael-tharakan.jpg",
  },
  {
    name: "Prof Murali D Nair",
    role: "Faculty",
    designation: "",
    affiliation: "School of Social Work, Southern California University, USA",
    email: "muralina@usc.edu",
    imageSrc: "/assets/murali-nair.jpg",
  },
  {
    name: "Prof. G Palanithurai",
    role: "Rajiv Gandhi Chair for Panchayati Raj Studies",
    designation: "Dept. of Political Science and Development Administration",
    affiliation:
      "The Gandhigram Rural Institute - Deemed University, Gandhigram - 624 302, Dindigul District, Tamil Nadu, South India",
    email: "gpalanithurai@gmail.com",
    phone: "09159099809",
    imageSrc: "/assets/g-palanithurai.jpg",
  },
  {
    name: "Dr. Thomas M. Landy",
    role: "Centre for Religion, Ethics and Culture",
    designation: "",
    affiliation:
      "College of the Holy Cross, Dept. of Sociology and Anthropology, Smith 304",
    email: "tlandy@holycross.edu",
    phone: "508-793-3723",
    imageSrc: "/assets/thomas-landy.jpg",
  },
  {
    name: "Fr. E J Thomas S J",
    role: "Former Principal",
    designation: "",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India",
    email: "erinjeri.thomas@gmail.com",
    imageSrc: "/assets/ej-thomas.jpg",
  },
  {
    name: "Prof. John Joseph Puthenkalam",
    role: "Graduate School of Global Environmental Studies",
    designation: "",
    affiliation:
      "Sophia University, 7-1 Kioi-cho, Chiyoda-ku, Tokyo 102-8554, Japan",
    email: "j-puthen@sophia.ac.com",
    imageSrc: "/assets/john-joseph.jpg",
  },
  {
    name: "Dr. Usha John",
    role: "Former Principal",
    designation: "",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India",
    email: "john.usha@gmail.com",
    imageSrc: "/assets/usha-john.jpg",
  },
  {
    name: "Dr. KA Joseph",
    role: "Former Principal",
    designation: "",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India",
    email: "joseantonymcs@gmail.com",
    imageSrc: "/assets/ka-joseph.jpg",
  },
  {
    name: "Dr. Jose Boban",
    role: "Former Principal",
    designation: "",
    affiliation:
      "Loyola College of Social Sciences, Thiruvananthapuram, Kerala, India",
    email: "joseboban1@gmail.com",
    imageSrc: "/assets/jose-boban.jpg",
  },
];

export default function EditorialBoardPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/journals" },
    { label: "Editorial Board" },
  ];

  return (
    <main className="min-h-screen bg-background pt-36 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-1 bg-primary rounded-full"></div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground text-center">
            Editorial Board
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-16">
          {boardMembers.map((member, index) => (
            <BoardMemberCard key={index} {...member} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-16 mb-8">
          <div className="w-12 h-1 bg-primary rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
            Board Members
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-8 md:gap-y-12">
          {otherBoardMembers.map((member, index) => (
            <BoardMemberCard key={`board-${index}`} {...member} />
          ))}
        </div>
      </div>
    </main>
  );
}
