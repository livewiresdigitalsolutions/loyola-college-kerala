// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   ChevronDown,
//   Instagram,
//   Youtube,
//   Facebook,
//   X,
//   Menu,
//   XIcon,
//   Search,
//   ArrowRight,
// } from "lucide-react";

// // Fix TypeScript error: Make subtitle optional in the type definition
// type MenuLink = {
//   name: string;
//   href: string;
//   subtitle?: string; // Make subtitle optional
// };

// type MenuSection = {
//   title: string;
//   links: MenuLink[];
// };

// type MenuData = {
//   title: string;
//   description: string;
//   ctaText: string;
//   ctaLink: string;
//   sections: MenuSection[];
// };

// const Navbar: React.FC = () => {
//   const [scrolled, setScrolled] = useState<boolean>(false);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
//   const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
//   const pathname = usePathname();

//   useEffect((): (() => void) => {
//     const onScroll = (): void => {
//       setScrolled(window.scrollY > 50);
//     };

//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const hideNavbarRoutes = ["/sys-ops"];
//   const shouldHideNavbar = hideNavbarRoutes.some((route) =>
//     pathname?.startsWith(route)
//   );

//   if (shouldHideNavbar) {
//     return null;
//   }

//   const menuData: Record<string, MenuData> = {
//     about: {
//       title: "About Loyola College of Social Sciences",
//       description:
//         "A Jesuit institution committed to academic excellence, social responsibility, and transformative education since 1963.",
//       ctaText: "Inside Loyola",
//       ctaLink: "/about",
//       sections: [
//         {
//           title: "About the Institution",
//           links: [
//             {
//               name: "History",
//               subtitle: "Our journey, milestones, and the legacy.",
//               href: "/about/history",
//             },
//             {
//               name: "Vision & Mission",
//               subtitle:
//                 "Values and principles guiding education, research, and social engagement.",
//               href: "/about/vision-mission",
//             },
//             {
//               name: "Administration",
//               subtitle:
//                 "Academic and administrative leadership steering the institution.",
//               href: "/about/administration",
//             },
//             {
//               name: "Governing Body",
//               subtitle: "Strategic oversight and institutional governance.",
//               href: "/about/governing-body",
//             },
//             {
//               name: "Academic Council",
//               subtitle: "Curriculum leadership and academic policy framework.",
//               href: "/about/academic-council",
//             },
//           ],
//         },
//         {
//           title: "Association & Identity",
//           links: [
//             { name: "PTA", href: "/about/pta" },
//             { name: "RTI Declaration", href: "/about/rti-declaration" },
//             {
//               name: "Institutional Distinctiveness",
//               href: "/about/distinctiveness",
//             },
//           ],
//         },
//         {
//           title: "Highlights",
//           links: [
//             {
//               name: "Milestones & Galaxy of Eminence",
//               href: "/about/milestones",
//             },
//             { name: "Eminent Visitors", href: "/about/visitors" },
//             { name: "Programme Outcomes (POs)", href: "/about/outcomes" },
//             { name: "Who is Who", href: "/about/who-is-who" },
//           ],
//         },
//       ],
//     },
//     academics: {
//       title: "Academics",
//       description:
//         "Comprehensive academic programs fostering excellence in teaching, learning, and research.",
//       ctaText: "Explore Programs",
//       ctaLink: "/academics",
//       sections: [
//         {
//           title: "Programs",
//           links: [
//             { name: "Departments", href: "/academics/departments" },
//             {
//               name: "Programmes & Courses Offered",
//               href: "/academics/courses",
//             },
//             { name: "Certificate Courses", href: "/academics/certificates" },
//             {
//               name: "ECE – Engaged Competence Enhancement",
//               href: "/academics/ece",
//             },
//           ],
//         },
//         {
//           title: "Teaching & Learning",
//           links: [
//             { name: "Faculty", href: "/academics/faculty" },
//             { name: "Innovation Centre", href: "/academics/innovation" },
//             { name: "Resources", href: "/academics/resources" },
//           ],
//         },
//         {
//           title: "Academic Process",
//           links: [
//             { name: "Academic Calendar", href: "/academics/calendar" },
//             {
//               name: "Outcome Based Education Framework",
//               href: "/academics/obe",
//             },
//             { name: "Code of Conduct", href: "/academics/conduct" },
//             { name: "Committees", href: "/academics/committees" },
//             { name: "Examination Details", href: "/academics/exams" },
//           ],
//         },
//       ],
//     },
//     campusLife: {
//       title: "Campus Life",
//       description:
//         "Experience vibrant campus facilities, modern infrastructure, and holistic student living.",
//       ctaText: "Explore Campus",
//       ctaLink: "/campus",
//       sections: [
//         {
//           title: "Learning Spaces",
//           links: [
//             { name: "Library", href: "/campus/library" },
//             { name: "Loyola Computer Centre", href: "/campus/computer-centre" },
//             { name: "Journals", href: "/campus/journals" },
//           ],
//         },
//         {
//           title: "Student Living",
//           links: [
//             { name: "Hostels", href: "/campus/hostels" },
//             { name: "Cafeteria", href: "/campus/cafeteria" },
//             { name: "Transportation", href: "/campus/transportation" },
//           ],
//         },
//         {
//           title: "Sports & Activities",
//           links: [{ name: "Gymnasium", href: "/campus/gymnasium" }],
//         },
//         {
//           title: "Halls & Venues",
//           links: [
//             { name: "Audio-Visual Hall", href: "/campus/av-hall" },
//             { name: "Dr. Jose Murikkan's Hall", href: "/campus/murikkan-hall" },
//             { name: "LES Hall", href: "/campus/les-hall" },
//           ],
//         },
//         {
//           title: "Services",
//           links: [
//             { name: "Loyola Extension Services (LES)", href: "/campus/les" },
//             { name: "Other Facilities", href: "/campus/facilities" },
//           ],
//         },
//       ],
//     },
//     iqac: {
//       title: "IQAC",
//       description:
//         "Quality assurance initiatives and accreditation frameworks ensuring academic excellence.",
//       ctaText: "Learn More",
//       ctaLink: "/iqac",
//       sections: [
//         {
//           title: "Quality Assurance",
//           links: [
//             { name: "Autonomy", href: "/iqac/autonomy" },
//             { name: "NAAC", href: "/iqac/naac" },
//             { name: "NIRF", href: "/iqac/nirf" },
//           ],
//         },
//         {
//           title: "Documentation",
//           links: [
//             { name: "AISHE", href: "/iqac/aishe" },
//             { name: "SAAC", href: "/iqac/saac" },
//             { name: "Others", href: "/iqac/others" },
//           ],
//         },
//       ],
//     },
//     placements: {
//       title: "Placements",
//       description:
//         "Career development, placement assistance, and industry partnerships for student success.",
//       ctaText: "View Opportunities",
//       ctaLink: "/placements",
//       sections: [
//         {
//           title: "Placement Services",
//           links: [
//             { name: "Placement Cell", href: "/placements/cell" },
//             { name: "Placement Activities", href: "/placements/activities" },
//             {
//               name: "Training & Skill Development",
//               href: "/placements/training",
//             },
//           ],
//         },
//         {
//           title: "Opportunities",
//           links: [
//             {
//               name: "Internship Opportunities",
//               href: "/placements/internships",
//             },
//             {
//               name: "Recruiters / Partner Companies",
//               href: "/placements/recruiters",
//             },
//             { name: "Placement Statistics", href: "/placements/statistics" },
//           ],
//         },
//         {
//           title: "Career Guidance",
//           links: [
//             { name: "Alumni Success Stories", href: "/placements/alumni" },
//             {
//               name: "Higher Studies Guidance",
//               href: "/placements/higher-studies",
//             },
//             { name: "Contact Placement Officer", href: "/placements/contact" },
//           ],
//         },
//       ],
//     },
//   };

//   return (
//     <>
//       <header
//         className={`fixed top-0 z-50 w-full transition-all duration-300 ${
//           scrolled ? "bg-white shadow-md" : "bg-transparent"
//         }`}
//       >
//         {/* Top bar */}
//         <div
//           className={`px-4 md:px-8 lg:px-20 text-white transition-colors duration-300 ${
//             scrolled ? "bg-primary" : "bg-transparent"
//           }`}
//         >
//           <div className="flex items-center justify-between py-2.5 text-sm">
//             <div className="flex items-center gap-3 md:gap-4">
//               <Link
//                 href="#"
//                 aria-label="Instagram"
//                 className="hover:opacity-75 transition"
//               >
//                 <Instagram size={18} />
//               </Link>
//               <Link
//                 href="#"
//                 aria-label="YouTube"
//                 className="hover:opacity-75 transition"
//               >
//                 <Youtube size={18} />
//               </Link>
//               <Link
//                 href="#"
//                 aria-label="Facebook"
//                 className="hover:opacity-75 transition"
//               >
//                 <Facebook size={18} />
//               </Link>
//               <Link
//                 href="#"
//                 aria-label="X"
//                 className="hover:opacity-75 transition"
//               >
//                 <X size={18} />
//               </Link>
//             </div>

//             <div className="hidden lg:flex items-center gap-6">
//               <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
//                 Student <ChevronDown size={14} />
//               </div>
//               <Link href="/alumni" className="hover:opacity-80 transition">
//                 Alumni
//               </Link>
//               <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
//                 News & Events <ChevronDown size={14} />
//               </div>
//               <Link href="/contact" className="hover:opacity-80 transition">
//                 Contact Us
//               </Link>

//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className={`rounded-md px-3 py-1.5 text-sm outline-none transition w-48 ${
//                     scrolled
//                       ? "bg-white/20 placeholder-white text-white"
//                       : "bg-white/30 placeholder-white/80 text-white"
//                   }`}
//                 />
//                 <Search
//                   size={16}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
//                 />
//               </div>

//               {/* <button className="bg-primary hover:bg-[#3832A0] text-white px-4 py-1.5 rounded-md text-sm font-medium transition">
//                 Login
//               </button> */}
//             </div>

//             <button
//               className="lg:hidden p-2"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               aria-label="Toggle menu"
//             >
//               {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//           <div
//             className={`h-px px-8 transition-colors duration-300 ${
//               scrolled ? "bg-transparent" : "bg-white"
//             }`}
//           />
//         </div>

//         {/* Divider line between top and bottom bars */}

//         {/* Main navbar */}
//         <div
//           className={`px-4 md:px-8 lg:px-20 transition-colors duration-300 ${
//             scrolled ? "text-gray-900 bg-white" : "text-white"
//           }`}
//         >
//           <div className="flex items-center justify-between py-4">
//             <Link href="/">
//               <Image
//                 src={
//                   scrolled
//                     ? "/assets/loyolalogogreen.png"
//                     : "/assets/loyolalogo.png"
//                 }
//                 alt="Loyola College"
//                 width={160}
//                 height={45}
//                 className="h-12 w-auto"
//                 priority
//               />
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:flex items-center gap-7 font-medium text-[15px]">
//               <div
//                 className="relative"
//                 onMouseEnter={() => setActiveDropdown("about")}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
//                   About <ChevronDown size={16} />
//                 </div>
//               </div>

//               <div
//                 className="relative"
//                 onMouseEnter={() => setActiveDropdown("academics")}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
//                   Academics <ChevronDown size={16} />
//                 </div>
//               </div>

//               <Link
//                 href="/research"
//                 className="hover:text-primary transition"
//               >
//                 Research
//               </Link>

//               <div
//                 className="relative"
//                 onMouseEnter={() => setActiveDropdown("campusLife")}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition whitespace-nowrap">
//                   Campus Life <ChevronDown size={16} />
//                 </div>
//               </div>

//               <div
//                 className="relative"
//                 onMouseEnter={() => setActiveDropdown("iqac")}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
//                   IQAC <ChevronDown size={16} />
//                 </div>
//               </div>

//               <div
//                 className="relative"
//                 onMouseEnter={() => setActiveDropdown("placements")}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
//                   Placements <ChevronDown size={16} />
//                 </div>
//               </div>

//               <Link href="/gallery" className="hover:text-primary transition">
//                 Gallery
//               </Link>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Backdrop - stays when hovering dropdown */}
//       {activeDropdown && (
//         <div className="fixed inset-0 z-40" style={{ top: "100px" }} />
//       )}

//       {/* Mega Menu Dropdowns - With Left Blue Sidebar */}
//       {activeDropdown === "about" && (
//         <div
//           className="fixed left-0 right-0 z-50"
//           style={{ top: "117px" }}
//           onMouseEnter={() => setActiveDropdown("about")}
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
//             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
//               {/* Left Blue Sidebar with Background Image */}
//               <div
//                 className="w-80 bg-gradient-to-br from-primary/95 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url(/assets/loyola-building.png)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

//                 <div className="relative z-10">
//                   <h2 className="text-2xl font-bold mb-4 leading-tight">
//                     {menuData.about.title}
//                   </h2>
//                   <p className="text-white/90 text-sm leading-relaxed mb-6">
//                     {menuData.about.description}
//                   </p>
//                 </div>
//                 <Link
//                   href={menuData.about.ctaLink}
//                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all relative z-10"
//                 >
//                   {menuData.about.ctaText} <ArrowRight size={18} />
//                 </Link>
//               </div>

//               {/* Right White Content */}
//               <div className="flex-1 bg-white p-8 border-l border-gray-100">
//                 <div className="grid grid-cols-3 gap-8">
//                   {menuData.about.sections.map((section, idx) => (
//                     <div key={idx} className="space-y-4">
//                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
//                         {section.title}
//                       </h3>
//                       <ul className="space-y-3">
//                         {section.links.map((link, linkIdx) => (
//                           <li key={linkIdx}>
//                             <Link href={link.href} className="block group">
//                               <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
//                                 <ChevronDown
//                                   size={16}
//                                   className="mt-0.5 rotate-[-90deg] text-gray-400 group-hover:text-primary"
//                                 />
//                                 <span>{link.name}</span>
//                               </div>
//                               {link.subtitle && (
//                                 <p className="text-xs text-gray-500 mt-1 ml-6">
//                                   {link.subtitle}
//                                 </p>
//                               )}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rest of the dropdowns remain the same - academics, campusLife, iqac, placements */}
//       {activeDropdown === "academics" && (
//         <div
//           className="fixed left-0 right-0 z-50"
//           style={{ top: "117px" }}
//           onMouseEnter={() => setActiveDropdown("academics")}
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
//             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              
//               <div
//                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url(/assets/loyola-building.png)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

//                 <div className="relative z-10">
//                   <h2 className="text-2xl font-bold mb-4">
//                     {menuData.academics.title}
//                   </h2>
//                   <p className="text-white/90 text-sm leading-relaxed mb-6">
//                     {menuData.academics.description}
//                   </p>
//                 </div>
//                 <Link
//                   href={menuData.academics.ctaLink}
//                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
//                 >
//                   {menuData.academics.ctaText} <ArrowRight size={18} />
//                 </Link>
//               </div>

//               <div className="flex-1 bg-white p-8 border-l border-gray-100 ">
//                 <div className="grid grid-cols-3 gap-8">
//                   {menuData.academics.sections.map((section, idx) => (
//                     <div key={idx} className="space-y-4">
//                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
//                         {section.title}
//                       </h3>
//                       <ul className="space-y-3">
//                         {section.links.map((link, linkIdx) => (
//                           <li key={linkIdx}>
//                             <Link
//                               href={link.href}
//                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
//                             >
//                               <ChevronDown
//                                 size={16}
//                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
//                               />
//                               {link.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeDropdown === "campusLife" && (
//         <div
//           className="fixed left-0 right-0 z-50"
//           style={{ top: "117px" }}
//           onMouseEnter={() => setActiveDropdown("campusLife")}
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <div className="max-w-7xl ml-auto mr-30 px-4 md:px-8 lg:px-20 py-4">
//             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// <div
//                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url(/assets/loyola-building.png)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

//                 <div className="relative z-10">
//                   <h2 className="text-2xl font-bold mb-4">
//                     {menuData.campusLife.title}
//                   </h2>
//                   <p className="text-white/90 text-sm leading-relaxed mb-6">
//                     {menuData.campusLife.description}
//                   </p>
//                 </div>
//                 <Link
//                   href={menuData.campusLife.ctaLink}
//                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
//                 >
//                   {menuData.campusLife.ctaText} <ArrowRight size={18} />
//                 </Link>
//               </div>

//               <div className="flex-1 bg-white p-8 border-l border-gray-100">
//                 <div className="grid grid-cols-5 gap-6">
//                   {menuData.campusLife.sections.map((section, idx) => (
//                     <div key={idx} className="space-y-4">
//                       <h3 className="text-primary font-bold text-sm pb-2 border-b-2 border-gray-200">
//                         {section.title}
//                       </h3>
//                       <ul className="space-y-2">
//                         {section.links.map((link, linkIdx) => (
//                           <li key={linkIdx}>
//                             <Link
//                               href={link.href}
//                               className="text-xm text-gray-700 hover:text-primary transition flex items-center gap-1 group"
//                             >
//                               <ChevronDown
//                                 size={14}
//                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
//                               />
//                               {link.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeDropdown === "iqac" && (
//         <div
//           className="fixed left-0 right-0 z-50"
//           style={{ top: "117px" }}
//           onMouseEnter={() => setActiveDropdown("iqac")}
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <div className="max-w-5xl ml-auto mr-30 px-4 md:px-8 lg:px-20 py-4">
//             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// <div
//                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url(/assets/loyola-building.png)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />
//                 <div className="relative z-10">
//                   <h2 className="text-2xl font-bold mb-4">
//                     {menuData.iqac.title}
//                   </h2>
//                   <p className="text-white/90 text-sm leading-relaxed mb-6">
//                     {menuData.iqac.description}
//                   </p>
//                 </div>
//                 <Link
//                   href={menuData.iqac.ctaLink}
//                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
//                 >
//                   {menuData.iqac.ctaText} <ArrowRight size={18} />
//                 </Link>
//               </div>

//               <div className="flex-1 bg-white p-8 border-l border-gray-100">
//                 <div className="grid grid-cols-2 gap-8">
//                   {menuData.iqac.sections.map((section, idx) => (
//                     <div key={idx} className="space-y-4">
//                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
//                         {section.title}
//                       </h3>
//                       <ul className="space-y-3">
//                         {section.links.map((link, linkIdx) => (
//                           <li key={linkIdx}>
//                             <Link
//                               href={link.href}
//                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
//                             >
//                               <ChevronDown
//                                 size={16}
//                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
//                               />
//                               {link.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeDropdown === "placements" && (
//         <div
//           className="fixed left-0 right-0 z-50"
//           style={{ top: "117px" }}
//           onMouseEnter={() => setActiveDropdown("placements")}
//           onMouseLeave={() => setActiveDropdown(null)}
//         >
//           <div className="max-w-6xl ml-auto mr-2 px-4 md:px-8 lg:px-20 py-4">
//             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// <div
//                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url(/assets/loyola-building.png)",
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay for better text readability */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

//                 <div className="relative z-10">
//                   <h2 className="text-2xl font-bold mb-4">
//                     {menuData.placements.title}
//                   </h2>
//                   <p className="text-white/90 text-sm leading-relaxed mb-6">
//                     {menuData.placements.description}
//                   </p>
//                 </div>
//                 <Link
//                   href={menuData.placements.ctaLink}
//                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
//                 >
//                   {menuData.placements.ctaText} <ArrowRight size={18} />
//                 </Link>
//               </div>

//               <div className="flex-1 bg-white p-8 border-l border-gray-100">
//                 <div className="grid grid-cols-3 gap-8">
//                   {menuData.placements.sections.map((section, idx) => (
//                     <div key={idx} className="space-y-4">
//                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
//                         {section.title}
//                       </h3>
//                       <ul className="space-y-3">
//                         {section.links.map((link, linkIdx) => (
//                           <li key={linkIdx}>
//                             <Link
//                               href={link.href}
//                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
//                             >
//                               <ChevronDown
//                                 size={16}
//                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
//                               />
//                               {link.name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Menu */}
//       <div
//         className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
//           mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={() => setMobileMenuOpen(false)}
//       />

//       <div
//         className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
//           mobileMenuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="p-6">
//           <button
//             onClick={() => setMobileMenuOpen(false)}
//             className="mb-6 p-2 hover:bg-gray-100 rounded-full transition"
//           >
//             <XIcon size={24} className="text-gray-700" />
//           </button>
//           <nav className="space-y-4">
//             <Link
//               href="/about"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               About
//             </Link>
//             <Link
//               href="/academics"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               Academics
//             </Link>
//             <Link
//               href="/research"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               Research
//             </Link>
//             <Link
//               href="/campus"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               Campus Life
//             </Link>
//             <Link
//               href="/iqac"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               IQAC
//             </Link>
//             <Link
//               href="/placements"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               Placements
//             </Link>
//             <Link
//               href="/gallery"
//               className="block font-medium text-gray-900 hover:text-primary"
//             >
//               Gallery
//             </Link>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;




















"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Instagram,
  Youtube,
  Facebook,
  X,
  Menu,
  XIcon,
  Search,
  ArrowRight,
} from "lucide-react";

// Fix TypeScript error: Make subtitle optional in the type definition
type MenuLink = {
  name: string;
  href: string;
  subtitle?: string; // Make subtitle optional
};

type MenuSection = {
  title: string;
  links: MenuLink[];
};

type MenuData = {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  sections: MenuSection[];
};

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if current page is homepage
  const isHomePage = pathname === "/";

  useEffect((): (() => void) => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close all menus when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setMobileMenuOpen(false);
    setSearchQuery("");
    setSearchOpen(false);
  }, [pathname]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hideNavbarExactRoutes = ["/", "/admission/pg-admissions"];
  const hideNavbarPrefixRoutes = ["/sys-ops", "/alumni", "/journals", "/les"];

  const shouldHideNavbar = 
    hideNavbarExactRoutes.includes(pathname) ||
    hideNavbarPrefixRoutes.some((route) => pathname?.startsWith(route));

  if (shouldHideNavbar) {
    return null;
  }

  // Determine if navbar should be transparent (no longer homepage specific)
  const isTransparent = !scrolled;

  const menuData: Record<string, MenuData> = {
    about: {
      title: "About Loyola College of Social Sciences",
      description:
        "A Jesuit institution committed to academic excellence, social responsibility, and transformative education since 1963.",
      ctaText: "Inside Loyola",
      ctaLink: "/about",
      sections: [
        {
          title: "About the Institution",
          links: [
            {
              name: "History",
              subtitle: "Our journey, milestones, and the legacy.",
              href: "/about/history",
            },
            {
              name: "Vision & Mission",
              subtitle:
                "Values and principles guiding education, research, and social engagement.",
              href: "/about/vision-mission",
            },
            {
              name: "Institutional Governance",
              subtitle: "Strategic oversight and institutional governance.",
              href: "/about/institutional-governance",
            },
            { 
              name: "PTA", 
              subtitle: "Parent Teacher Association activities and updates.",
              href: "/about/pta" 
            },
            {
              name: "Eminent Visitors",
              subtitle: "Notable personalities who visited our campus.",
              href: "/about/eminent-visitors",
            },
          ],
        },
      ],
    },
    academics: {
      title: "Academics",
      description:
        "Comprehensive academic programs fostering excellence in teaching, learning, and research.",
      ctaText: "Explore Programs",
      ctaLink: "/academics/programmes-and-course",
      sections: [
        {
          title: "Programs",
          links: [
            { 
              name: "Departments", 
              subtitle: "Explore our diverse academic departments.",
              href: "/academics/departments" 
            },
            {
              name: "Programmes & Courses Offered",
              subtitle: "UG, PG and research programmes available.",
              href: "/academics/programmes-and-course",
            },
          ],
        },
        {
          title: "Teaching & Learning",
          links: [
            { 
              name: "Faculty & Staffs", 
              subtitle: "Meet our qualified and dedicated teaching staff.",
              href: "/academics/faculty-and-staffs" 
            },
            { 
              name: "Innovation Centre", 
              subtitle: "Fostering creativity, research, and entrepreneurship.",
              href: "/academics/innovation-center" 
            },
          ],
        },
        {
          title: "Academic Process",
          links: [
            { 
              name: "Academic Calendar", 
              subtitle: "Schedules, events, and important academic dates.",
              href: "/academics/academic-calendar" 
            },
            {
              name: "Outcome Based Education",
              subtitle: "Student learning outcomes and assessment framework.",
              href: "/academics/obe",
            },
            { 
              name: "Code of Conduct", 
              subtitle: "Rules, values, and expected behavioural standards.",
              href: "/academics/code-of-conduct" 
            },
            { 
              name: "College Committees", 
              subtitle: "Committees overseeing academic and student affairs.",
              href: "/academics/college-committees" 
            },
          ],
        },
      ],
    },
    iqac: {
      title: "IQAC",
      description:
        "Quality assurance initiatives and accreditation frameworks ensuring academic excellence.",
      ctaText: "Learn More",
      ctaLink: "/iqac/Home",
      sections: [
        {
          title: "Quality Assurance",
          links: [
            { 
              name: "Home", 
              subtitle: "Overview of IQAC goals and activities.",
              href: "/iqac/Home" 
            },
            { 
              name: "Autonomy", 
              subtitle: "Details on the college's autonomous status.",
              href: "/iqac/Autonomy" 
            },
            { 
              name: "NAAC Accreditation", 
              subtitle: "National accreditation status and grading.",
              href: "/iqac/NAAC-Accreditation" 
            },
            { 
              name: "SSR", 
              subtitle: "Self-Study Report documents and submissions.",
              href: "/iqac/SSR" 
            },
          ],
        },
        {
          title: "Documentation & Reports",
          links: [
            { 
              name: "Activities", 
              subtitle: "IQAC activities, workshops, and seminars.",
              href: "/iqac/Activities" 
            },
            { 
              name: "AQARs", 
              subtitle: "Annual Quality Assurance Reports.",
              href: "/iqac/AQARs" 
            },
            { 
              name: "AQARs Formats", 
              subtitle: "Downloadable templates for AQAR submissions.",
              href: "/iqac/AQARs-Formats" 
            },
            { 
              name: "Documents", 
              subtitle: "Key institutional documents and publications.",
              href: "/iqac/Documents" 
            },
          ],
        },
        {
          title: "Stakeholder Input",
          links: [
            { 
              name: "Feedback", 
              subtitle: "Student, parent, and alumni feedback portal.",
              href: "/iqac/Feedback" 
            },
            { 
              name: "Contact Us", 
              subtitle: "Reach out to the IQAC team directly.",
              href: "/iqac/Contact-us" 
            },
          ],
        },
      ],
    },
    journals: {
      title: "Loyola Journals",
      description:
        "Scholarly publications promoting research and academic dialogue in social sciences.",
      ctaText: "View Journals",
      ctaLink: "/journals",
      sections: [
        {
          title: "Publishing",
          links: [
            { 
              name: "About Journals", 
              subtitle: "Our peer-reviewed academic journal publications.",
              href: "/journals/about" 
            },
            { 
              name: "Editorial Board", 
              subtitle: "Distinguished academics guiding our publications.",
              href: "/journals/editorial-board" 
            },
            { 
              name: "Article Submission", 
              subtitle: "Submit your research for peer review.",
              href: "/journals/article-submission" 
            },
            { 
              name: "Subscription", 
              subtitle: "Access and subscribe to journal content.",
              href: "/journals/subscription" 
            },
            { 
              name: "Contact", 
              subtitle: "Get in touch with the journal editorial team.",
              href: "/journals/contact" 
            },
          ],
        },
      ],
    },
    student: {
      title: "Student Engagement",
      description: "Discover clubs, associations, support, and active student life at Loyola.",
      ctaText: "College Union",
      ctaLink: "/students-engagement/college-union",
      sections: [
        {
          title: "Student Life",
          links: [
            { name: "College Union", subtitle: "Student governance and leadership.", href: "/students-engagement/college-union" },
            { name: "Students Associations", subtitle: "Join clubs and student groups.", href: "/students-engagement/students-associations" },
            { name: "NSS Unit", subtitle: "National Service Scheme activities.", href: "/students-engagement/loyola-nss-unit" },
            { name: "Women's Cell", subtitle: "Empowerment and grievance redressal.", href: "/students-engagement/womens-cell" },
          ],
        },
        {
          title: "Support & Growth",
          links: [
            { name: "Mentoring Programme", subtitle: "Guidance and counselling support.", href: "/students-engagement/loyola-mentoring-programme" },
            { name: "LACE", subtitle: "Loyola Academy for Career Enhancement.", href: "/students-engagement/loyola-academy-for-career-enhancement" },
            { name: "LILA", subtitle: "Language advancement initiatives.", href: "/students-engagement/loyola-initiative-for-language-advancement" },
          ],
        },
      ],
    },
    newsEvents: {
      title: "News & Events",
      description: "Stay informed with the latest happenings, announcements, and events at Loyola.",
      ctaText: "View Current News",
      ctaLink: "/news-and-events/news-and-upcoming-events",
      sections: [
        {
          title: "Latest",
          links: [
            { name: "News & Announcements", subtitle: "Latest institutional news and updates.", href: "/news-and-events/news-and-upcoming-events" },
            { name: "Upcoming Events", subtitle: "Events, seminars, and workshops happening soon.", href: "/news-and-events/news-and-upcoming-events" },
          ],
        },
        {
          title: "Media",
          links: [
            { name: "Gallery", subtitle: "Photos and video highlights from campus.", href: "/gallery" },
            { name: "Event Reports", subtitle: "Detailed reports of past events and activities.", href: "/news-and-events/event-reports" },
          ],
        },
      ],
    },
  };

  // ── Comprehensive flat search index ──────────────────────────────────────
  type SearchEntry = { name: string; subtitle?: string; href: string; category: string };

  const searchIndex: SearchEntry[] = [
    // Home & General
    { name: "Home", subtitle: "Loyola College of Social Sciences homepage", href: "/", category: "General" },
    { name: "Contact Us", subtitle: "Reach the college by phone, email, or visit", href: "/contact", category: "General" },
    { name: "Careers", subtitle: "Job openings and career opportunities at Loyola", href: "/careers", category: "General" },
    { name: "Gallery", subtitle: "Photo gallery of campus events and activities", href: "/gallery", category: "General" },
    { name: "Research", subtitle: "Research initiatives and publications at Loyola", href: "/research", category: "General" },
    // About
    { name: "About Loyola", subtitle: "Overview of Loyola College of Social Sciences", href: "/about", category: "About" },
    { name: "History", subtitle: "Our journey, milestones, and the legacy since 1963", href: "/about/history", category: "About" },
    { name: "Vision & Mission", subtitle: "Values and principles guiding our education", href: "/about/vision-mission", category: "About" },
    { name: "Institutional Governance", subtitle: "Strategic oversight and institutional leadership", href: "/about/institutional-governance", category: "About" },
    { name: "PTA", subtitle: "Parent Teacher Association activities and updates", href: "/about/pta", category: "About" },
    { name: "Eminent Visitors", subtitle: "Notable personalities who have visited our campus", href: "/about/eminent-visitors", category: "About" },
    // Academics
    { name: "Departments", subtitle: "Explore all academic departments at Loyola", href: "/academics/departments", category: "Academics" },
    { name: "Programmes & Courses", subtitle: "UG, PG and research programmes offered", href: "/academics/programmes-and-course", category: "Academics" },
    { name: "Faculty & Staffs", subtitle: "Meet our qualified teaching and support staff", href: "/academics/faculty-and-staffs", category: "Academics" },
    { name: "Innovation Centre", subtitle: "Fostering creativity, research, and entrepreneurship", href: "/academics/innovation-center", category: "Academics" },
    { name: "Academic Calendar", subtitle: "Schedules, events, and important academic dates", href: "/academics/academic-calendar", category: "Academics" },
    { name: "Outcome Based Education", subtitle: "OBE framework and student learning outcomes", href: "/academics/obe", category: "Academics" },
    { name: "Code of Conduct", subtitle: "Rules, values, and expected behavioural standards", href: "/academics/code-of-conduct", category: "Academics" },
    { name: "College Committees", subtitle: "Committees overseeing academic and student affairs", href: "/academics/college-committees", category: "Academics" },
    // Admissions
    { name: "Admissions", subtitle: "Apply for undergraduate and postgraduate programs", href: "/admission", category: "Admissions" },
    { name: "PG Admissions", subtitle: "Postgraduate admission portal and details", href: "/admission/pg-admissions", category: "Admissions" },
    // Campus Life
    { name: "Campus Life", subtitle: "Explore facilities, sports, and student services", href: "/campus-life", category: "Campus Life" },
    // IQAC
    { name: "IQAC Home", subtitle: "Quality assurance overview and IQAC goals", href: "/iqac/Home", category: "IQAC" },
    { name: "Autonomy", subtitle: "Details about the college's autonomous status", href: "/iqac/Autonomy", category: "IQAC" },
    { name: "NAAC Accreditation", subtitle: "National accreditation status and grading", href: "/iqac/NAAC-Accreditation", category: "IQAC" },
    { name: "SSR", subtitle: "Self-Study Report documents and submissions", href: "/iqac/SSR", category: "IQAC" },
    { name: "IQAC Activities", subtitle: "IQAC workshops, seminars, and events", href: "/iqac/Activities", category: "IQAC" },
    { name: "AQARs", subtitle: "Annual Quality Assurance Reports", href: "/iqac/AQARs", category: "IQAC" },
    { name: "AQARs Formats", subtitle: "Downloadable templates for AQAR submissions", href: "/iqac/AQARs-Formats", category: "IQAC" },
    { name: "IQAC Documents", subtitle: "Key institutional documents and publications", href: "/iqac/Documents", category: "IQAC" },
    { name: "Feedback", subtitle: "Student, parent, and alumni feedback portal", href: "/iqac/Feedback", category: "IQAC" },
    { name: "IQAC Contact", subtitle: "Reach out to the IQAC team directly", href: "/iqac/Contact-us", category: "IQAC" },
    // Journals
    { name: "Journals", subtitle: "Loyola's scholarly peer-reviewed publications", href: "/journals", category: "Journals" },
    { name: "About Journals", subtitle: "Overview of our academic journal publications", href: "/journals/about", category: "Journals" },
    { name: "Editorial Board", subtitle: "Distinguished academics guiding our publications", href: "/journals/editorial-board", category: "Journals" },
    { name: "Article Submission", subtitle: "Submit your research for peer review", href: "/journals/article-submission", category: "Journals" },
    { name: "Journal Subscription", subtitle: "Access and subscribe to journal content", href: "/journals/subscription", category: "Journals" },
    // LES
    { name: "LES", subtitle: "Loyola Extension Services — community outreach and welfare", href: "/les", category: "LES" },
    { name: "LES About", subtitle: "About Loyola Extension Services and its mission", href: "/les/about", category: "LES" },
    { name: "LES Gallery", subtitle: "Photos from LES activities and community programmes", href: "/les/gallery", category: "LES" },
    { name: "LES Team", subtitle: "Meet the LES team and volunteers", href: "/les/team", category: "LES" },
    { name: "LES Engagements", subtitle: "Community engagement programmes by LES", href: "/les/engagements", category: "LES" },
    { name: "LES Contact", subtitle: "Get in touch with the LES unit", href: "/les/contact", category: "LES" },
    { name: "Counselling Appointment", subtitle: "Book a counselling session through LES", href: "/les/counsellingAppointment", category: "LES" },
    { name: "Donate to LES", subtitle: "Support LES community welfare initiatives", href: "/les/donate", category: "LES" },
    // Student Engagement
    { name: "College Union", subtitle: "Student governance and leadership body", href: "/students-engagement/college-union", category: "Student Engagement" },
    { name: "Students Associations", subtitle: "Join clubs and departmental student groups", href: "/students-engagement/students-associations", category: "Student Engagement" },
    { name: "NSS Unit", subtitle: "National Service Scheme activities and volunteering", href: "/students-engagement/loyola-nss-unit", category: "Student Engagement" },
    { name: "Women's Cell", subtitle: "Empowerment, awareness, and grievance redressal", href: "/students-engagement/womens-cell", category: "Student Engagement" },
    { name: "Mentoring Programme", subtitle: "Guidance, counselling, and academic support", href: "/students-engagement/loyola-mentoring-programme", category: "Student Engagement" },
    { name: "LACE", subtitle: "Loyola Academy for Career Enhancement", href: "/students-engagement/loyola-academy-for-career-enhancement", category: "Student Engagement" },
    { name: "LILA", subtitle: "Loyola Initiative for Language Advancement", href: "/students-engagement/loyola-initiative-for-language-advancement", category: "Student Engagement" },
    { name: "Loyola Ethnographic Theatre", subtitle: "Theatre and performing arts engagement", href: "/students-engagement/loyola-ethnographic-theatre", category: "Student Engagement" },
    { name: "EM & Biodiversity", subtitle: "Environmental management and biodiversity activities", href: "/students-engagement/em-and-bio-diversity", category: "Student Engagement" },
    { name: "Loyola in Company of Friends", subtitle: "Peer learning and friendship-based engagement", href: "/students-engagement/loyola-in-the-company-of-friends", category: "Student Engagement" },
    { name: "Students Progression", subtitle: "Tracking alumni and student career outcomes", href: "/students-engagement/students-progression", category: "Student Engagement" },
    // News & Events
    { name: "News & Events", subtitle: "Latest institutional news and upcoming events", href: "/news-and-events/news-and-upcoming-events", category: "News & Events" },
    { name: "Event Reports", subtitle: "Detailed reports of past events and activities", href: "/news-and-events/event-reports", category: "News & Events" },
    // Alumni
    { name: "Alumni", subtitle: "Loyola alumni network and resources", href: "/alumni", category: "Alumni" },
  ];

  const q = searchQuery.trim().toLowerCase();

  const searchResults: SearchEntry[] =
    q.length > 0
      ? searchIndex.filter(
          (entry) =>
            entry.name.toLowerCase().includes(q) ||
            (entry.subtitle ?? "").toLowerCase().includes(q) ||
            entry.category.toLowerCase().includes(q)
        )
      : [];

  // Group results by category
  const groupedResults = searchResults.reduce<Record<string, SearchEntry[]>>((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Highlight matched text
  const highlight = (text: string) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-primary/15 text-primary font-semibold rounded-sm px-0.5">
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      const target = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      if (target) {
        router.push(target.href);
        setSearchQuery("");
        setSearchOpen(false);
        setSelectedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setSearchOpen(false);
      setSelectedIndex(-1);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isTransparent ? "bg-transparent" : "bg-white shadow-md"
        }`}
        onClick={(e) => {
          if (!(e.target as Element).closest('.nav-trigger')) {
            setActiveDropdown(null);
          }
        }}
      >
        {/* Top bar */}
        <div
          className={`px-4 md:px-8 lg:px-20 text-white transition-colors duration-300 ${
            isTransparent ? "bg-transparent" : "bg-primary"
          }`}
        >
          <div className="flex items-center justify-between py-2.5 text-sm">
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="#"
                aria-label="Instagram"
                className="hover:opacity-75 transition"
              >
                <Instagram size={18} />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="hover:opacity-75 transition"
              >
                <Youtube size={18} />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="hover:opacity-75 transition"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                aria-label="X"
                className="hover:opacity-75 transition"
              >
                <X size={18} />
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <Link href="/admission" className="hover:opacity-80 transition">
                Admissions
              </Link>
              <div
                className={`relative flex items-center gap-1 cursor-pointer transition nav-trigger px-2.5 py-1 rounded-md ${
                  activeDropdown === "student" ? "bg-white/25 font-semibold" : "hover:bg-white/20 hover:font-semibold"
                }`}
                onMouseEnter={() => setActiveDropdown("student")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "student" ? null : "student")}
              >
                Student <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "student" ? "rotate-180" : ""}`} />
              </div>
              <Link href="/alumni" className="hover:opacity-80 transition">
                Alumni
              </Link>
              <div
                className={`relative flex items-center gap-1 cursor-pointer transition nav-trigger px-2.5 py-1 rounded-md ${
                  activeDropdown === "newsEvents" ? "bg-white/25 font-semibold" : "hover:bg-white/20 hover:font-semibold"
                }`}
                onMouseEnter={() => setActiveDropdown("newsEvents")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "newsEvents" ? null : "newsEvents")}
              >
                News & Events <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "newsEvents" ? "rotate-180" : ""}`} />
              </div>
              <Link href="/contact" className="hover:opacity-80 transition">
                Contact Us
              </Link>

              {/* ── Visible Search Bar (opens spotlight on click) ── */}
              <button
                onClick={() => { setSearchOpen(true); setSearchQuery(""); }}
                aria-label="Open search"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                  isTransparent
                    ? "bg-white/10 border-white/30 text-white/80 hover:bg-white/20 hover:border-white/50"
                    : "bg-white/10 border-white/40 text-white/90 hover:bg-white/20 hover:border-white/60"
                }`}
              >
                <Search size={14} className="shrink-0" />
                <span className="text-sm">Search...</span>
              </button>
            </div>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div
            className={`h-px px-8 transition-colors duration-300 ${
              isTransparent ? "bg-white" : "bg-transparent"
            }`}
          />
        </div>

        {/* Main navbar */}
        <div
          className={`px-4 md:px-8 lg:px-20 transition-colors duration-300 ${
            isTransparent ? "text-white" : "text-gray-900 bg-white"
          }`}
        >
          <div className="flex items-center justify-between py-4">
            <Link href="/">
              <Image
                src={
                  isTransparent
                    ? "/assets/loyolalogo.png"
                    : "/assets/loyolalogogreen.png"
                }
                alt="Loyola College"
                width={160}
                height={45}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 font-medium text-[15px]">
              <div
                className="relative nav-trigger"
                onMouseEnter={() => setActiveDropdown("about")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "about" ? null : "about")}
              >
                <div className={`flex items-center gap-1 cursor-pointer transition px-3 py-1 rounded-md ${
                    activeDropdown === "about"
                      ? isTransparent ? "bg-white text-primary font-semibold" : "bg-primary/10 text-primary font-semibold"
                      : isTransparent ? "hover:bg-white/20 hover:font-semibold" : "hover:bg-primary/10 hover:text-primary hover:font-semibold"
                  }`}>
                  About <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "about" ? "rotate-180" : ""}`} />
                </div>
              </div>

              <div
                className="relative nav-trigger"
                onMouseEnter={() => setActiveDropdown("academics")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "academics" ? null : "academics")}
              >
                <div className={`flex items-center gap-1 cursor-pointer transition px-3 py-1 rounded-md ${
                    activeDropdown === "academics"
                      ? isTransparent ? "bg-white text-primary font-semibold" : "bg-primary/10 text-primary font-semibold"
                      : isTransparent ? "hover:bg-white/20 hover:font-semibold" : "hover:bg-primary/10 hover:text-primary hover:font-semibold"
                  }`}>
                  Academics <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "academics" ? "rotate-180" : ""}`} />
                </div>
              </div>

              <Link href="/research" className="hover:text-primary transition">
                Research
              </Link>

              <div
                className="relative nav-trigger"
                onMouseEnter={() => setActiveDropdown("iqac")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "iqac" ? null : "iqac")}
              >
                <div className={`flex items-center gap-1 cursor-pointer transition px-3 py-1 rounded-md ${
                    activeDropdown === "iqac"
                      ? isTransparent ? "bg-white text-primary font-semibold" : "bg-primary/10 text-primary font-semibold"
                      : isTransparent ? "hover:bg-white/20 hover:font-semibold" : "hover:bg-primary/10 hover:text-primary hover:font-semibold"
                  }`}>
                  IQAC <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "iqac" ? "rotate-180" : ""}`} />
                </div>
              </div>

              <div
                className="relative nav-trigger"
                onMouseEnter={() => setActiveDropdown("journals")}
                onMouseLeave={() => setActiveDropdown(null)}
                onClick={() => setActiveDropdown(activeDropdown === "journals" ? null : "journals")}
              >
                <div className={`flex items-center gap-1 cursor-pointer transition px-3 py-1 rounded-md ${
                    activeDropdown === "journals"
                      ? isTransparent ? "bg-white text-primary font-semibold" : "bg-primary/10 text-primary font-semibold"
                      : isTransparent ? "hover:bg-white/20 hover:font-semibold" : "hover:bg-primary/10 hover:text-primary hover:font-semibold"
                  }`}>
                  Journals <ChevronDown size={16} className={`transition-transform duration-200 ${activeDropdown === "journals" ? "rotate-180" : ""}`} />
                </div>
              </div>

              <Link href="/les" className="hover:text-primary transition">
                LES
              </Link>

              <Link href="/careers" className="hover:text-primary transition">
                Careers
              </Link>

              <Link href="/gallery" className="hover:text-primary transition">
                Gallery
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Backdrop - stays when hovering dropdown */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" style={{ top: "100px" }} onClick={() => setActiveDropdown(null)} />
      )}

      {/* Mega Menu Dropdowns - With Left Blue Sidebar */}
      {activeDropdown === "about" && (
        <div
          className="fixed left-0 right-0 z-50 pt-3"
          style={{ top: "96px" }}
          onMouseEnter={() => setActiveDropdown("about")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              {/* Left Blue Sidebar with Background Image */}
              <div
                className="w-80 bg-gradient-to-br from-primary/95 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4 leading-tight">
                    {menuData.about.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.about.description}
                  </p>
                </div>
                <Link
                  href={menuData.about.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all relative z-10"
                >
                  {menuData.about.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              {/* Right White Content */}
              <div className="flex-1 bg-white p-8 border-l border-gray-100">
                <div className="grid grid-cols-1 gap-8">
                  {menuData.about.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="grid grid-rows-3 grid-flow-col gap-y-3 gap-x-12 auto-cols-[minmax(200px,1fr)]">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown
                                  size={16}
                                  className="mt-0.5 rotate-[-90deg] text-gray-400 group-hover:text-primary"
                                />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                  {link.subtitle}
                                </p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the dropdowns remain the same - academics, campusLife, iqac, placements */}
      {activeDropdown === "academics" && (
        <div
          className="fixed left-0 right-0 z-50 pt-3"
          style={{ top: "96px" }}
          onMouseEnter={() => setActiveDropdown("academics")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              <div
                className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">
                    {menuData.academics.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.academics.description}
                  </p>
                </div>
                <Link
                  href={menuData.academics.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
                >
                  {menuData.academics.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex-1 bg-white p-8 border-l border-gray-100 ">
                <div className="grid grid-cols-3 gap-8">
                  {menuData.academics.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown size={16} className="mt-0.5 -rotate-90 text-gray-400 group-hover:text-primary" />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{link.subtitle}</p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === "journals" && (
        <div
          className="fixed left-0 right-0 z-50 pt-3"
          style={{ top: "96px" }}
          onMouseEnter={() => setActiveDropdown("journals")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              <div
                className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">
                    {menuData.journals.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.journals.description}
                  </p>
                </div>
                <Link
                  href={menuData.journals.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
                >
                  {menuData.journals.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex-1 bg-white p-8 border-l border-gray-100">
                <div className="grid grid-cols-1 gap-8">
                  {menuData.journals.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-sm pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="grid grid-rows-3 grid-flow-col gap-y-3 gap-x-12 auto-cols-[minmax(200px,1fr)]">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown size={16} className="mt-0.5 -rotate-90 text-gray-400 group-hover:text-primary" />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{link.subtitle}</p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDropdown === "iqac" && (
        <div
          className="fixed left-0 right-0 z-50 pt-3"
          style={{ top: "96px" }}
          onMouseEnter={() => setActiveDropdown("iqac")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              <div
                className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">
                    {menuData.iqac.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.iqac.description}
                  </p>
                </div>
                <Link
                  href={menuData.iqac.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
                >
                  {menuData.iqac.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex-1 bg-white p-8 border-l border-gray-100">
                <div className="grid grid-cols-3 gap-8">
                  {menuData.iqac.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown size={16} className="mt-0.5 -rotate-90 text-gray-400 group-hover:text-primary" />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && (
                                <p className="text-xs text-gray-500 mt-1 ml-6">{link.subtitle}</p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student dropdown */}
      {activeDropdown === "student" && (
        <div
          className="fixed left-0 right-0 lg:left-auto lg:right-0 z-50 pt-2 lg:pt-3"
          style={{ top: "40px" }}
          onMouseEnter={() => setActiveDropdown("student")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              <div className="w-72 bg-linear-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: "url(/assets/loyola-building.png)", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-primary/90 z-0" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">{menuData.student.title}</h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">{menuData.student.description}</p>
                </div>
                <Link href={menuData.student.ctaLink} className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10 relative">
                  {menuData.student.ctaText} <ArrowRight size={18} />
                </Link>
              </div>
              <div className="flex-1 bg-white p-8 border-l border-gray-100">
                <div className="grid grid-cols-2 gap-8">
                  {menuData.student.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown size={16} className="mt-0.5 -rotate-90 text-gray-400 group-hover:text-primary" />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && <p className="text-xs text-gray-500 mt-1 ml-6">{link.subtitle}</p>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News & Events dropdown */}
      {activeDropdown === "newsEvents" && (
        <div
          className="fixed left-0 right-0 lg:left-auto lg:right-0 z-50 pt-2 lg:pt-3"
          style={{ top: "40px" }}
          onMouseEnter={() => setActiveDropdown("newsEvents")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl min-h-[320px]">
              <div className="w-72 bg-linear-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: "url(/assets/loyola-building.png)", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-primary/90 z-0" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">{menuData.newsEvents.title}</h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">{menuData.newsEvents.description}</p>
                </div>
                <Link href={menuData.newsEvents.ctaLink} className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10 relative">
                  {menuData.newsEvents.ctaText} <ArrowRight size={18} />
                </Link>
              </div>
              <div className="flex-1 bg-white p-8 border-l border-gray-100">
                <div className="grid grid-cols-2 gap-8">
                  {menuData.newsEvents.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link href={link.href} className="block group">
                              <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
                                <ChevronDown size={16} className="mt-0.5 -rotate-90 text-gray-400 group-hover:text-primary" />
                                <span>{link.name}</span>
                              </div>
                              {link.subtitle && <p className="text-xs text-gray-500 mt-1 ml-6">{link.subtitle}</p>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
           SPOTLIGHT SEARCH OVERLAY
      ══════════════════════════════════════════ */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4"
          style={{ animation: "searchOverlayIn 200ms ease both" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false);
              setSearchQuery("");
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Search card */}
          <div
            ref={searchRef}
            className="relative w-full max-w-2xl"
            style={{ animation: "searchCardIn 240ms cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 bg-white px-5 py-4 shadow-xl rounded-lg border border-gray-200">
              <Search size={20} className="text-primary shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(-1); }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search pages, departments, courses…"
                className="flex-1 text-[17px] text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  <XIcon size={16} />
                </button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="ml-1 px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            {/* Results panel — dynamic, categorized, highlighted */}
            {searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    {/* Result count header */}
                    <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 bg-gray-50/70">
                      <span className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
                      </span>
                      <span className="text-[10px] text-gray-300 hidden sm:block">↑↓ navigate · Enter to go · Esc to close</span>
                    </div>
                    {/* Grouped by category */}
                    {Object.entries(groupedResults).map(([category, entries]) => {
                      return (
                        <div key={category}>
                          <div className="px-5 pt-3 pb-1">
                            <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">{category}</span>
                          </div>
                          {entries.map((result) => {
                            const flatIdx = searchResults.indexOf(result);
                            const isSelected = flatIdx === selectedIndex;
                            return (
                              <Link
                                key={result.href}
                                href={result.href}
                                onClick={() => { setSearchQuery(""); setSearchOpen(false); setSelectedIndex(-1); }}
                                onMouseEnter={() => setSelectedIndex(flatIdx)}
                                className={`flex items-center gap-3 px-5 py-2.5 group transition-colors ${
                                  isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                }`}>
                                  <Search size={13} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold transition-colors ${isSelected ? "text-primary" : "text-gray-800 group-hover:text-primary"}`}>
                                    {highlight(result.name)}
                                  </p>
                                  {result.subtitle && (
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">{highlight(result.subtitle)}</p>
                                  )}
                                </div>
                                <ArrowRight size={14} className={`shrink-0 transition-colors ${isSelected ? "text-primary" : "text-gray-200 group-hover:text-primary"}`} />
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="px-6 py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      No results for &ldquo;<span className="text-gray-700">{searchQuery}</span>&rdquo;
                    </p>
                    <p className="text-xs text-gray-300 mt-1">Try searching for a page, department, or section name</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick links when input is empty */}
            {searchQuery.trim().length === 0 && (
              <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-xl px-5 py-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Popular Pages</p>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { name: "Admissions", href: "/admission" },
                    { name: "Departments", href: "/academics/departments" },
                    { name: "Gallery", href: "/gallery" },
                    { name: "Contact Us", href: "/contact" },
                    { name: "IQAC", href: "/iqac/Home" },
                    { name: "LES Gallery", href: "/les/gallery" },
                    { name: "News & Events", href: "/news-and-events/news-and-upcoming-events" },
                    { name: "Research", href: "/research" },
                    { name: "Alumni", href: "/alumni" },
                  ].map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/5 group transition-colors text-sm text-gray-500 hover:text-primary font-medium"
                    >
                      <ArrowRight size={12} className="text-gray-300 group-hover:text-primary shrink-0" />
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes searchOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes searchCardIn {
          from { opacity: 0; transform: translateY(-24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Mobile Menu */}

      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mb-6 p-2 hover:bg-gray-100 rounded-full transition"
            title="Close menu"
            aria-label="Close menu"
          >
            <XIcon size={24} className="text-gray-700" />
          </button>
          <nav className="space-y-4">
            <Link
              href="/about"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/academics"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Academics
            </Link>
            <Link
              href="/research"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Research
            </Link>
            <Link
              href="/iqac/Home"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              IQAC
            </Link>
            <Link
              href="/journals"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Journals
            </Link>
            <Link
              href="/careers"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Careers
            </Link>
            <Link
              href="/gallery"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Gallery
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
