// // "use client";

// // import { useEffect, useState } from "react";
// // import { usePathname } from "next/navigation";
// // import Image from "next/image";
// // import Link from "next/link";
// // import {
// //   ChevronDown,
// //   Instagram,
// //   Youtube,
// //   Facebook,
// //   X,
// //   Menu,
// //   XIcon,
// //   Search,
// //   ArrowRight,
// // } from "lucide-react";

// // // Fix TypeScript error: Make subtitle optional in the type definition
// // type MenuLink = {
// //   name: string;
// //   href: string;
// //   subtitle?: string; // Make subtitle optional
// // };

// // type MenuSection = {
// //   title: string;
// //   links: MenuLink[];
// // };

// // type MenuData = {
// //   title: string;
// //   description: string;
// //   ctaText: string;
// //   ctaLink: string;
// //   sections: MenuSection[];
// // };

// // const Navbar: React.FC = () => {
// //   const [scrolled, setScrolled] = useState<boolean>(false);
// //   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
// //   const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
// //   const pathname = usePathname();

// //   useEffect((): (() => void) => {
// //     const onScroll = (): void => {
// //       setScrolled(window.scrollY > 50);
// //     };

// //     window.addEventListener("scroll", onScroll);
// //     return () => window.removeEventListener("scroll", onScroll);
// //   }, []);

// //   const hideNavbarRoutes = ["/sys-ops"];
// //   const shouldHideNavbar = hideNavbarRoutes.some((route) =>
// //     pathname?.startsWith(route)
// //   );

// //   if (shouldHideNavbar) {
// //     return null;
// //   }

// //   const menuData: Record<string, MenuData> = {
// //     about: {
// //       title: "About Loyola College of Social Sciences",
// //       description:
// //         "A Jesuit institution committed to academic excellence, social responsibility, and transformative education since 1963.",
// //       ctaText: "Inside Loyola",
// //       ctaLink: "/about",
// //       sections: [
// //         {
// //           title: "About the Institution",
// //           links: [
// //             {
// //               name: "History",
// //               subtitle: "Our journey, milestones, and the legacy.",
// //               href: "/about/history",
// //             },
// //             {
// //               name: "Vision & Mission",
// //               subtitle:
// //                 "Values and principles guiding education, research, and social engagement.",
// //               href: "/about/vision-mission",
// //             },
// //             {
// //               name: "Administration",
// //               subtitle:
// //                 "Academic and administrative leadership steering the institution.",
// //               href: "/about/administration",
// //             },
// //             {
// //               name: "Governing Body",
// //               subtitle: "Strategic oversight and institutional governance.",
// //               href: "/about/governing-body",
// //             },
// //             {
// //               name: "Academic Council",
// //               subtitle: "Curriculum leadership and academic policy framework.",
// //               href: "/about/academic-council",
// //             },
// //           ],
// //         },
// //         {
// //           title: "Association & Identity",
// //           links: [
// //             { name: "PTA", href: "/about/pta" },
// //             { name: "RTI Declaration", href: "/about/rti-declaration" },
// //             {
// //               name: "Institutional Distinctiveness",
// //               href: "/about/distinctiveness",
// //             },
// //           ],
// //         },
// //         {
// //           title: "Highlights",
// //           links: [
// //             {
// //               name: "Milestones & Galaxy of Eminence",
// //               href: "/about/milestones",
// //             },
// //             { name: "Eminent Visitors", href: "/about/visitors" },
// //             { name: "Programme Outcomes (POs)", href: "/about/outcomes" },
// //             { name: "Who is Who", href: "/about/who-is-who" },
// //           ],
// //         },
// //       ],
// //     },
// //     academics: {
// //       title: "Academics",
// //       description:
// //         "Comprehensive academic programs fostering excellence in teaching, learning, and research.",
// //       ctaText: "Explore Programs",
// //       ctaLink: "/academics",
// //       sections: [
// //         {
// //           title: "Programs",
// //           links: [
// //             { name: "Departments", href: "/academics/departments" },
// //             {
// //               name: "Programmes & Courses Offered",
// //               href: "/academics/courses",
// //             },
// //             { name: "Certificate Courses", href: "/academics/certificates" },
// //             {
// //               name: "ECE – Engaged Competence Enhancement",
// //               href: "/academics/ece",
// //             },
// //           ],
// //         },
// //         {
// //           title: "Teaching & Learning",
// //           links: [
// //             { name: "Faculty", href: "/academics/faculty" },
// //             { name: "Innovation Centre", href: "/academics/innovation" },
// //             { name: "Resources", href: "/academics/resources" },
// //           ],
// //         },
// //         {
// //           title: "Academic Process",
// //           links: [
// //             { name: "Academic Calendar", href: "/academics/calendar" },
// //             {
// //               name: "Outcome Based Education Framework",
// //               href: "/academics/obe",
// //             },
// //             { name: "Code of Conduct", href: "/academics/conduct" },
// //             { name: "Committees", href: "/academics/committees" },
// //             { name: "Examination Details", href: "/academics/exams" },
// //           ],
// //         },
// //       ],
// //     },
// //     campusLife: {
// //       title: "Campus Life",
// //       description:
// //         "Experience vibrant campus facilities, modern infrastructure, and holistic student living.",
// //       ctaText: "Explore Campus",
// //       ctaLink: "/campus",
// //       sections: [
// //         {
// //           title: "Learning Spaces",
// //           links: [
// //             { name: "Library", href: "/campus/library" },
// //             { name: "Loyola Computer Centre", href: "/campus/computer-centre" },
// //             { name: "Journals", href: "/campus/journals" },
// //           ],
// //         },
// //         {
// //           title: "Student Living",
// //           links: [
// //             { name: "Hostels", href: "/campus/hostels" },
// //             { name: "Cafeteria", href: "/campus/cafeteria" },
// //             { name: "Transportation", href: "/campus/transportation" },
// //           ],
// //         },
// //         {
// //           title: "Sports & Activities",
// //           links: [{ name: "Gymnasium", href: "/campus/gymnasium" }],
// //         },
// //         {
// //           title: "Halls & Venues",
// //           links: [
// //             { name: "Audio-Visual Hall", href: "/campus/av-hall" },
// //             { name: "Dr. Jose Murikkan's Hall", href: "/campus/murikkan-hall" },
// //             { name: "LES Hall", href: "/campus/les-hall" },
// //           ],
// //         },
// //         {
// //           title: "Services",
// //           links: [
// //             { name: "Loyola Extension Services (LES)", href: "/campus/les" },
// //             { name: "Other Facilities", href: "/campus/facilities" },
// //           ],
// //         },
// //       ],
// //     },
// //     iqac: {
// //       title: "IQAC",
// //       description:
// //         "Quality assurance initiatives and accreditation frameworks ensuring academic excellence.",
// //       ctaText: "Learn More",
// //       ctaLink: "/iqac",
// //       sections: [
// //         {
// //           title: "Quality Assurance",
// //           links: [
// //             { name: "Autonomy", href: "/iqac/autonomy" },
// //             { name: "NAAC", href: "/iqac/naac" },
// //             { name: "NIRF", href: "/iqac/nirf" },
// //           ],
// //         },
// //         {
// //           title: "Documentation",
// //           links: [
// //             { name: "AISHE", href: "/iqac/aishe" },
// //             { name: "SAAC", href: "/iqac/saac" },
// //             { name: "Others", href: "/iqac/others" },
// //           ],
// //         },
// //       ],
// //     },
// //     placements: {
// //       title: "Placements",
// //       description:
// //         "Career development, placement assistance, and industry partnerships for student success.",
// //       ctaText: "View Opportunities",
// //       ctaLink: "/placements",
// //       sections: [
// //         {
// //           title: "Placement Services",
// //           links: [
// //             { name: "Placement Cell", href: "/placements/cell" },
// //             { name: "Placement Activities", href: "/placements/activities" },
// //             {
// //               name: "Training & Skill Development",
// //               href: "/placements/training",
// //             },
// //           ],
// //         },
// //         {
// //           title: "Opportunities",
// //           links: [
// //             {
// //               name: "Internship Opportunities",
// //               href: "/placements/internships",
// //             },
// //             {
// //               name: "Recruiters / Partner Companies",
// //               href: "/placements/recruiters",
// //             },
// //             { name: "Placement Statistics", href: "/placements/statistics" },
// //           ],
// //         },
// //         {
// //           title: "Career Guidance",
// //           links: [
// //             { name: "Alumni Success Stories", href: "/placements/alumni" },
// //             {
// //               name: "Higher Studies Guidance",
// //               href: "/placements/higher-studies",
// //             },
// //             { name: "Contact Placement Officer", href: "/placements/contact" },
// //           ],
// //         },
// //       ],
// //     },
// //   };

// //   return (
// //     <>
// //       <header
// //         className={`fixed top-0 z-50 w-full transition-all duration-300 ${
// //           scrolled ? "bg-white shadow-md" : "bg-transparent"
// //         }`}
// //       >
// //         {/* Top bar */}
// //         <div
// //           className={`px-4 md:px-8 lg:px-20 text-white transition-colors duration-300 ${
// //             scrolled ? "bg-primary" : "bg-transparent"
// //           }`}
// //         >
// //           <div className="flex items-center justify-between py-2.5 text-sm">
// //             <div className="flex items-center gap-3 md:gap-4">
// //               <Link
// //                 href="#"
// //                 aria-label="Instagram"
// //                 className="hover:opacity-75 transition"
// //               >
// //                 <Instagram size={18} />
// //               </Link>
// //               <Link
// //                 href="#"
// //                 aria-label="YouTube"
// //                 className="hover:opacity-75 transition"
// //               >
// //                 <Youtube size={18} />
// //               </Link>
// //               <Link
// //                 href="#"
// //                 aria-label="Facebook"
// //                 className="hover:opacity-75 transition"
// //               >
// //                 <Facebook size={18} />
// //               </Link>
// //               <Link
// //                 href="#"
// //                 aria-label="X"
// //                 className="hover:opacity-75 transition"
// //               >
// //                 <X size={18} />
// //               </Link>
// //             </div>

// //             <div className="hidden lg:flex items-center gap-6">
// //               <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
// //                 Student <ChevronDown size={14} />
// //               </div>
// //               <Link href="/alumni" className="hover:opacity-80 transition">
// //                 Alumni
// //               </Link>
// //               <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
// //                 News & Events <ChevronDown size={14} />
// //               </div>
// //               <Link href="/contact" className="hover:opacity-80 transition">
// //                 Contact Us
// //               </Link>

// //               <div className="relative">
// //                 <input
// //                   type="text"
// //                   placeholder="Search..."
// //                   className={`rounded-md px-3 py-1.5 text-sm outline-none transition w-48 ${
// //                     scrolled
// //                       ? "bg-white/20 placeholder-white text-white"
// //                       : "bg-white/30 placeholder-white/80 text-white"
// //                   }`}
// //                 />
// //                 <Search
// //                   size={16}
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
// //                 />
// //               </div>

// //               {/* <button className="bg-primary hover:bg-[#3832A0] text-white px-4 py-1.5 rounded-md text-sm font-medium transition">
// //                 Login
// //               </button> */}
// //             </div>

// //             <button
// //               className="lg:hidden p-2"
// //               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //               aria-label="Toggle menu"
// //             >
// //               {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
// //             </button>
// //           </div>
// //           <div
// //             className={`h-px px-8 transition-colors duration-300 ${
// //               scrolled ? "bg-transparent" : "bg-white"
// //             }`}
// //           />
// //         </div>

// //         {/* Divider line between top and bottom bars */}

// //         {/* Main navbar */}
// //         <div
// //           className={`px-4 md:px-8 lg:px-20 transition-colors duration-300 ${
// //             scrolled ? "text-gray-900 bg-white" : "text-white"
// //           }`}
// //         >
// //           <div className="flex items-center justify-between py-4">
// //             <Link href="/">
// //               <Image
// //                 src={
// //                   scrolled
// //                     ? "/assets/loyolalogogreen.png"
// //                     : "/assets/loyolalogo.png"
// //                 }
// //                 alt="Loyola College"
// //                 width={160}
// //                 height={45}
// //                 className="h-12 w-auto"
// //                 priority
// //               />
// //             </Link>

// //             {/* Desktop Navigation */}
// //             <nav className="hidden lg:flex items-center gap-7 font-medium text-[15px]">
// //               <div
// //                 className="relative"
// //                 onMouseEnter={() => setActiveDropdown("about")}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
// //                   About <ChevronDown size={16} />
// //                 </div>
// //               </div>

// //               <div
// //                 className="relative"
// //                 onMouseEnter={() => setActiveDropdown("academics")}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
// //                   Academics <ChevronDown size={16} />
// //                 </div>
// //               </div>

// //               <Link
// //                 href="/research"
// //                 className="hover:text-primary transition"
// //               >
// //                 Research
// //               </Link>

// //               <div
// //                 className="relative"
// //                 onMouseEnter={() => setActiveDropdown("campusLife")}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition whitespace-nowrap">
// //                   Campus Life <ChevronDown size={16} />
// //                 </div>
// //               </div>

// //               <div
// //                 className="relative"
// //                 onMouseEnter={() => setActiveDropdown("iqac")}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
// //                   IQAC <ChevronDown size={16} />
// //                 </div>
// //               </div>

// //               <div
// //                 className="relative"
// //                 onMouseEnter={() => setActiveDropdown("placements")}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
// //                   Placements <ChevronDown size={16} />
// //                 </div>
// //               </div>

// //               <Link href="/gallery" className="hover:text-primary transition">
// //                 Gallery
// //               </Link>
// //             </nav>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Backdrop - stays when hovering dropdown */}
// //       {activeDropdown && (
// //         <div className="fixed inset-0 z-40" style={{ top: "100px" }} />
// //       )}

// //       {/* Mega Menu Dropdowns - With Left Blue Sidebar */}
// //       {activeDropdown === "about" && (
// //         <div
// //           className="fixed left-0 right-0 z-50"
// //           style={{ top: "117px" }}
// //           onMouseEnter={() => setActiveDropdown("about")}
// //           onMouseLeave={() => setActiveDropdown(null)}
// //         >
// //           <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
// //             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// //               {/* Left Blue Sidebar with Background Image */}
// //               <div
// //                 className="w-80 bg-gradient-to-br from-primary/95 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
// //                 style={{
// //                   backgroundImage: "url(/assets/loyola-building.png)",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               >
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

// //                 <div className="relative z-10">
// //                   <h2 className="text-2xl font-bold mb-4 leading-tight">
// //                     {menuData.about.title}
// //                   </h2>
// //                   <p className="text-white/90 text-sm leading-relaxed mb-6">
// //                     {menuData.about.description}
// //                   </p>
// //                 </div>
// //                 <Link
// //                   href={menuData.about.ctaLink}
// //                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all relative z-10"
// //                 >
// //                   {menuData.about.ctaText} <ArrowRight size={18} />
// //                 </Link>
// //               </div>

// //               {/* Right White Content */}
// //               <div className="flex-1 bg-white p-8 border-l border-gray-100">
// //                 <div className="grid grid-cols-3 gap-8">
// //                   {menuData.about.sections.map((section, idx) => (
// //                     <div key={idx} className="space-y-4">
// //                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
// //                         {section.title}
// //                       </h3>
// //                       <ul className="space-y-3">
// //                         {section.links.map((link, linkIdx) => (
// //                           <li key={linkIdx}>
// //                             <Link href={link.href} className="block group">
// //                               <div className="text-sm font-medium text-gray-800 group-hover:text-primary transition flex items-start gap-2">
// //                                 <ChevronDown
// //                                   size={16}
// //                                   className="mt-0.5 rotate-[-90deg] text-gray-400 group-hover:text-primary"
// //                                 />
// //                                 <span>{link.name}</span>
// //                               </div>
// //                               {link.subtitle && (
// //                                 <p className="text-xs text-gray-500 mt-1 ml-6">
// //                                   {link.subtitle}
// //                                 </p>
// //                               )}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Rest of the dropdowns remain the same - academics, campusLife, iqac, placements */}
// //       {activeDropdown === "academics" && (
// //         <div
// //           className="fixed left-0 right-0 z-50"
// //           style={{ top: "117px" }}
// //           onMouseEnter={() => setActiveDropdown("academics")}
// //           onMouseLeave={() => setActiveDropdown(null)}
// //         >
// //           <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20 py-4">
// //             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              
// //               <div
// //                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
// //                 style={{
// //                   backgroundImage: "url(/assets/loyola-building.png)",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               >
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

// //                 <div className="relative z-10">
// //                   <h2 className="text-2xl font-bold mb-4">
// //                     {menuData.academics.title}
// //                   </h2>
// //                   <p className="text-white/90 text-sm leading-relaxed mb-6">
// //                     {menuData.academics.description}
// //                   </p>
// //                 </div>
// //                 <Link
// //                   href={menuData.academics.ctaLink}
// //                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
// //                 >
// //                   {menuData.academics.ctaText} <ArrowRight size={18} />
// //                 </Link>
// //               </div>

// //               <div className="flex-1 bg-white p-8 border-l border-gray-100 ">
// //                 <div className="grid grid-cols-3 gap-8">
// //                   {menuData.academics.sections.map((section, idx) => (
// //                     <div key={idx} className="space-y-4">
// //                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
// //                         {section.title}
// //                       </h3>
// //                       <ul className="space-y-3">
// //                         {section.links.map((link, linkIdx) => (
// //                           <li key={linkIdx}>
// //                             <Link
// //                               href={link.href}
// //                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
// //                             >
// //                               <ChevronDown
// //                                 size={16}
// //                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
// //                               />
// //                               {link.name}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {activeDropdown === "campusLife" && (
// //         <div
// //           className="fixed left-0 right-0 z-50"
// //           style={{ top: "117px" }}
// //           onMouseEnter={() => setActiveDropdown("campusLife")}
// //           onMouseLeave={() => setActiveDropdown(null)}
// //         >
// //           <div className="max-w-7xl ml-auto mr-30 px-4 md:px-8 lg:px-20 py-4">
// //             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// // <div
// //                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
// //                 style={{
// //                   backgroundImage: "url(/assets/loyola-building.png)",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               >
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

// //                 <div className="relative z-10">
// //                   <h2 className="text-2xl font-bold mb-4">
// //                     {menuData.campusLife.title}
// //                   </h2>
// //                   <p className="text-white/90 text-sm leading-relaxed mb-6">
// //                     {menuData.campusLife.description}
// //                   </p>
// //                 </div>
// //                 <Link
// //                   href={menuData.campusLife.ctaLink}
// //                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
// //                 >
// //                   {menuData.campusLife.ctaText} <ArrowRight size={18} />
// //                 </Link>
// //               </div>

// //               <div className="flex-1 bg-white p-8 border-l border-gray-100">
// //                 <div className="grid grid-cols-5 gap-6">
// //                   {menuData.campusLife.sections.map((section, idx) => (
// //                     <div key={idx} className="space-y-4">
// //                       <h3 className="text-primary font-bold text-sm pb-2 border-b-2 border-gray-200">
// //                         {section.title}
// //                       </h3>
// //                       <ul className="space-y-2">
// //                         {section.links.map((link, linkIdx) => (
// //                           <li key={linkIdx}>
// //                             <Link
// //                               href={link.href}
// //                               className="text-xm text-gray-700 hover:text-primary transition flex items-center gap-1 group"
// //                             >
// //                               <ChevronDown
// //                                 size={14}
// //                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
// //                               />
// //                               {link.name}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {activeDropdown === "iqac" && (
// //         <div
// //           className="fixed left-0 right-0 z-50"
// //           style={{ top: "117px" }}
// //           onMouseEnter={() => setActiveDropdown("iqac")}
// //           onMouseLeave={() => setActiveDropdown(null)}
// //         >
// //           <div className="max-w-5xl ml-auto mr-30 px-4 md:px-8 lg:px-20 py-4">
// //             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// // <div
// //                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
// //                 style={{
// //                   backgroundImage: "url(/assets/loyola-building.png)",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               >
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />
// //                 <div className="relative z-10">
// //                   <h2 className="text-2xl font-bold mb-4">
// //                     {menuData.iqac.title}
// //                   </h2>
// //                   <p className="text-white/90 text-sm leading-relaxed mb-6">
// //                     {menuData.iqac.description}
// //                   </p>
// //                 </div>
// //                 <Link
// //                   href={menuData.iqac.ctaLink}
// //                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
// //                 >
// //                   {menuData.iqac.ctaText} <ArrowRight size={18} />
// //                 </Link>
// //               </div>

// //               <div className="flex-1 bg-white p-8 border-l border-gray-100">
// //                 <div className="grid grid-cols-2 gap-8">
// //                   {menuData.iqac.sections.map((section, idx) => (
// //                     <div key={idx} className="space-y-4">
// //                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
// //                         {section.title}
// //                       </h3>
// //                       <ul className="space-y-3">
// //                         {section.links.map((link, linkIdx) => (
// //                           <li key={linkIdx}>
// //                             <Link
// //                               href={link.href}
// //                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
// //                             >
// //                               <ChevronDown
// //                                 size={16}
// //                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
// //                               />
// //                               {link.name}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {activeDropdown === "placements" && (
// //         <div
// //           className="fixed left-0 right-0 z-50"
// //           style={{ top: "117px" }}
// //           onMouseEnter={() => setActiveDropdown("placements")}
// //           onMouseLeave={() => setActiveDropdown(null)}
// //         >
// //           <div className="max-w-6xl ml-auto mr-2 px-4 md:px-8 lg:px-20 py-4">
// //             <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
// // <div
// //                 className="w-80 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-8 flex flex-col justify-between relative overflow-hidden"
// //                 style={{
// //                   backgroundImage: "url(/assets/loyola-building.png)",
// //                   backgroundSize: "cover",
// //                   backgroundPosition: "center",
// //                 }}
// //               >
// //                 {/* Overlay for better text readability */}
// //                 <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

// //                 <div className="relative z-10">
// //                   <h2 className="text-2xl font-bold mb-4">
// //                     {menuData.placements.title}
// //                   </h2>
// //                   <p className="text-white/90 text-sm leading-relaxed mb-6">
// //                     {menuData.placements.description}
// //                   </p>
// //                 </div>
// //                 <Link
// //                   href={menuData.placements.ctaLink}
// //                   className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
// //                 >
// //                   {menuData.placements.ctaText} <ArrowRight size={18} />
// //                 </Link>
// //               </div>

// //               <div className="flex-1 bg-white p-8 border-l border-gray-100">
// //                 <div className="grid grid-cols-3 gap-8">
// //                   {menuData.placements.sections.map((section, idx) => (
// //                     <div key={idx} className="space-y-4">
// //                       <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
// //                         {section.title}
// //                       </h3>
// //                       <ul className="space-y-3">
// //                         {section.links.map((link, linkIdx) => (
// //                           <li key={linkIdx}>
// //                             <Link
// //                               href={link.href}
// //                               className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
// //                             >
// //                               <ChevronDown
// //                                 size={16}
// //                                 className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
// //                               />
// //                               {link.name}
// //                             </Link>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Mobile Menu */}
// //       <div
// //         className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
// //           mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
// //         }`}
// //         onClick={() => setMobileMenuOpen(false)}
// //       />

// //       <div
// //         className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
// //           mobileMenuOpen ? "translate-x-0" : "translate-x-full"
// //         }`}
// //       >
// //         <div className="p-6">
// //           <button
// //             onClick={() => setMobileMenuOpen(false)}
// //             className="mb-6 p-2 hover:bg-gray-100 rounded-full transition"
// //           >
// //             <XIcon size={24} className="text-gray-700" />
// //           </button>
// //           <nav className="space-y-4">
// //             <Link
// //               href="/about"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               About
// //             </Link>
// //             <Link
// //               href="/academics"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               Academics
// //             </Link>
// //             <Link
// //               href="/research"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               Research
// //             </Link>
// //             <Link
// //               href="/campus"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               Campus Life
// //             </Link>
// //             <Link
// //               href="/iqac"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               IQAC
// //             </Link>
// //             <Link
// //               href="/placements"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               Placements
// //             </Link>
// //             <Link
// //               href="/gallery"
// //               className="block font-medium text-gray-900 hover:text-primary"
// //             >
// //               Gallery
// //             </Link>
// //           </nav>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Navbar;




















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

//   // Check if current page is homepage
//   const isHomePage = pathname === "/";

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

//   // Determine if navbar should be transparent (only on homepage when not scrolled)
//   const isTransparent = isHomePage && !scrolled;

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
//           isTransparent ? "bg-transparent" : "bg-white shadow-md"
//         }`}
//       >
//         {/* Top bar */}
//         <div
//           className={`px-4 md:px-8 lg:px-20 text-white transition-colors duration-300 ${
//             isTransparent ? "bg-transparent" : "bg-primary"
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
//               <Link href="/admission" className="hover:opacity-80 transition">
//                 Admissions
//               </Link>
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
//                     isTransparent
//                       ? "bg-white/30 placeholder-white/80 text-white"
//                       : "bg-white/20 placeholder-white text-white"
//                   }`}
//                 />
//                 <Search
//                   size={16}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
//                 />
//               </div>
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
//               isTransparent ? "bg-white" : "bg-transparent"
//             }`}
//           />
//         </div>

//         {/* Main navbar */}
//         <div
//           className={`px-4 md:px-8 lg:px-20 transition-colors duration-300 ${
//             isTransparent ? "text-white" : "text-gray-900 bg-white"
//           }`}
//         >
//           <div className="flex items-center justify-between py-4">
//             <Link href="/">
//               <Image
//                 src={
//                   isTransparent
//                     ? "/assets/loyolalogo.png"
//                     : "/assets/loyolalogogreen.png"
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

//               <Link href="/research" className="hover:text-primary transition">
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
//             title="Close menu"
//             aria-label="Close menu"
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

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  subtitle?: string;
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
  const pathname = usePathname();

  // NEW: Add hover delay timer
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect((): (() => void) => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hideNavbarRoutes = ["/sys-ops"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null;
  }

  // UPDATED: Make transparent on ALL pages when not scrolled
  const isTransparent = !scrolled;

  // UPDATED: Handle dropdown with delay
  const handleDropdownEnter = (dropdown: string) => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
    setHoverTimer(timer);
  };

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
              name: "Administration",
              subtitle:
                "Academic and administrative leadership steering the institution.",
              href: "/about/administration",
            },
            {
              name: "Governing Body",
              subtitle: "Strategic oversight and institutional governance.",
              href: "/about/governing-body",
            },
            {
              name: "Academic Council",
              subtitle: "Curriculum leadership and academic policy framework.",
              href: "/about/academic-council",
            },
          ],
        },
        {
          title: "Association & Identity",
          links: [
            { name: "PTA", href: "/about/pta" },
            { name: "RTI Declaration", href: "/about/rti-declaration" },
            {
              name: "Institutional Distinctiveness",
              href: "/about/distinctiveness",
            },
          ],
        },
        {
          title: "Highlights",
          links: [
            {
              name: "Milestones & Galaxy of Eminence",
              href: "/about/milestones",
            },
            { name: "Eminent Visitors", href: "/about/visitors" },
            { name: "Programme Outcomes (POs)", href: "/about/outcomes" },
            { name: "Who is Who", href: "/about/who-is-who" },
          ],
        },
      ],
    },
    academics: {
      title: "Academics",
      description:
        "Comprehensive academic programs fostering excellence in teaching, learning, and research.",
      ctaText: "Explore Programs",
      ctaLink: "/academics",
      sections: [
        {
          title: "Programs",
          links: [
            { name: "Departments", href: "/academics/departments" },
            {
              name: "Programmes & Courses Offered",
              href: "/academics/courses",
            },
            { name: "Certificate Courses", href: "/academics/certificates" },
            {
              name: "ECE – Engaged Competence Enhancement",
              href: "/academics/ece",
            },
          ],
        },
        {
          title: "Teaching & Learning",
          links: [
            { name: "Faculty", href: "/academics/faculty" },
            { name: "Innovation Centre", href: "/academics/innovation" },
            { name: "Resources", href: "/academics/resources" },
          ],
        },
        {
          title: "Academic Process",
          links: [
            { name: "Academic Calendar", href: "/academics/calendar" },
            {
              name: "Outcome Based Education Framework",
              href: "/academics/obe",
            },
            { name: "Code of Conduct", href: "/academics/conduct" },
            { name: "Committees", href: "/academics/committees" },
            { name: "Examination Details", href: "/academics/exams" },
          ],
        },
      ],
    },
    campusLife: {
      title: "Campus Life",
      description:
        "Experience vibrant campus facilities, modern infrastructure, and holistic student living.",
      ctaText: "Explore Campus",
      ctaLink: "/campus",
      sections: [
        {
          title: "Learning Spaces",
          links: [
            { name: "Library", href: "/campus/library" },
            { name: "Loyola Computer Centre", href: "/campus/computer-centre" },
            { name: "Journals", href: "/campus/journals" },
          ],
        },
        {
          title: "Student Living",
          links: [
            { name: "Hostels", href: "/campus/hostels" },
            { name: "Cafeteria", href: "/campus/cafeteria" },
            { name: "Transportation", href: "/campus/transportation" },
          ],
        },
        {
          title: "Sports & Activities",
          links: [{ name: "Gymnasium", href: "/campus/gymnasium" }],
        },
        {
          title: "Halls & Venues",
          links: [
            { name: "Audio-Visual Hall", href: "/campus/av-hall" },
            { name: "Dr. Jose Murikkan's Hall", href: "/campus/murikkan-hall" },
            { name: "LES Hall", href: "/campus/les-hall" },
          ],
        },
        {
          title: "Services",
          links: [
            { name: "Loyola Extension Services (LES)", href: "/campus/les" },
            { name: "Other Facilities", href: "/campus/facilities" },
          ],
        },
      ],
    },
    iqac: {
      title: "IQAC",
      description:
        "Quality assurance initiatives and accreditation frameworks ensuring academic excellence.",
      ctaText: "Learn More",
      ctaLink: "/iqac",
      sections: [
        {
          title: "Quality Assurance",
          links: [
            { name: "Autonomy", href: "/iqac/autonomy" },
            { name: "NAAC", href: "/iqac/naac" },
            { name: "NIRF", href: "/iqac/nirf" },
          ],
        },
        {
          title: "Documentation",
          links: [
            { name: "AISHE", href: "/iqac/aishe" },
            { name: "SAAC", href: "/iqac/saac" },
            { name: "Others", href: "/iqac/others" },
          ],
        },
      ],
    },
    placements: {
      title: "Placements",
      description:
        "Career development, placement assistance, and industry partnerships for student success.",
      ctaText: "View Opportunities",
      ctaLink: "/placements",
      sections: [
        {
          title: "Placement Services",
          links: [
            { name: "Placement Cell", href: "/placements/cell" },
            { name: "Placement Activities", href: "/placements/activities" },
            {
              name: "Training & Skill Development",
              href: "/placements/training",
            },
          ],
        },
        {
          title: "Opportunities",
          links: [
            {
              name: "Internship Opportunities",
              href: "/placements/internships",
            },
            {
              name: "Recruiters / Partner Companies",
              href: "/placements/recruiters",
            },
            { name: "Placement Statistics", href: "/placements/statistics" },
          ],
        },
        {
          title: "Career Guidance",
          links: [
            { name: "Alumni Success Stories", href: "/placements/alumni" },
            {
              name: "Higher Studies Guidance",
              href: "/placements/higher-studies",
            },
            { name: "Contact Placement Officer", href: "/placements/contact" },
          ],
        },
      ],
    },
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isTransparent ? "bg-transparent" : "bg-white shadow-md"
        }`}
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
              <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                Student <ChevronDown size={14} />
              </div>
              <Link href="/alumni" className="hover:opacity-80 transition">
                Alumni
              </Link>
              <div className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
                News & Events <ChevronDown size={14} />
              </div>
              <Link href="/contact" className="hover:opacity-80 transition">
                Contact Us
              </Link>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`rounded-md px-3 py-1.5 text-sm outline-none transition w-48 ${
                    isTransparent
                      ? "bg-white/30 placeholder-white/80 text-white"
                      : "bg-white/20 placeholder-white text-white"
                  }`}
                />
                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70"
                />
              </div>
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

            {/* Desktop Navigation - UPDATED with new hover handlers */}
            <nav className="hidden lg:flex items-center gap-7 font-medium text-[15px]">
              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("about")}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
                  About <ChevronDown size={16} />
                </div>
              </div>

              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("academics")}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
                  Academics <ChevronDown size={16} />
                </div>
              </div>

              <Link href="/research" className="hover:text-primary transition">
                Research
              </Link>

              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("campusLife")}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition whitespace-nowrap">
                  Campus Life <ChevronDown size={16} />
                </div>
              </div>

              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("iqac")}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
                  IQAC <ChevronDown size={16} />
                </div>
              </div>

              <div
                className="relative"
                onMouseEnter={() => handleDropdownEnter("placements")}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
                  Placements <ChevronDown size={16} />
                </div>
              </div>

              <Link href="/gallery" className="hover:text-primary transition">
                Gallery
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Backdrop - stays when hovering dropdown */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" style={{ top: "100px" }} />
      )}

      {/* UPDATED: Mega Menu Dropdowns - Increased size and added hover handlers */}
      {activeDropdown === "about" && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ top: "117px" }}
          onMouseEnter={() => handleDropdownEnter("about")}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-20 py-6">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              {/* Left Blue Sidebar - INCREASED width */}
              <div
                className="w-96 bg-gradient-to-br from-primary/95 to-primary/95 text-white p-10 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
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

              {/* Right Content - INCREASED padding */}
              <div className="flex-1 bg-white p-10 border-l border-gray-100">
                <div className="grid grid-cols-3 gap-10">
                  {menuData.about.sections.map((section, idx) => (
                    <div key={idx} className="space-y-5">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
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

      {/* Academics Dropdown - UPDATED */}
      {activeDropdown === "academics" && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ top: "117px" }}
          onMouseEnter={() => handleDropdownEnter("academics")}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-20 py-6">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-96 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-10 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
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

              <div className="flex-1 bg-white p-10 border-l border-gray-100">
                <div className="grid grid-cols-3 gap-10">
                  {menuData.academics.sections.map((section, idx) => (
                    <div key={idx} className="space-y-5">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
                            >
                              <ChevronDown
                                size={16}
                                className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
                              />
                              {link.name}
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

      {/* Campus Life Dropdown - UPDATED */}
      {activeDropdown === "campusLife" && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ top: "117px" }}
          onMouseEnter={() => handleDropdownEnter("campusLife")}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-20 py-6">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-96 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-10 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">
                    {menuData.campusLife.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.campusLife.description}
                  </p>
                </div>
                <Link
                  href={menuData.campusLife.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
                >
                  {menuData.campusLife.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex-1 bg-white p-10 border-l border-gray-100">
                <div className="grid grid-cols-5 gap-8">
                  {menuData.campusLife.sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                      <h3 className="text-primary font-bold text-sm pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-1 group"
                            >
                              <ChevronDown
                                size={14}
                                className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
                              />
                              {link.name}
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

      {/* IQAC Dropdown - UPDATED */}
      {activeDropdown === "iqac" && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ top: "117px" }}
          onMouseEnter={() => handleDropdownEnter("iqac")}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-20 py-6">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-96 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-10 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
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

              <div className="flex-1 bg-white p-10 border-l border-gray-100">
                <div className="grid grid-cols-2 gap-10">
                  {menuData.iqac.sections.map((section, idx) => (
                    <div key={idx} className="space-y-5">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
                            >
                              <ChevronDown
                                size={16}
                                className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
                              />
                              {link.name}
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

      {/* Placements Dropdown - UPDATED */}
      {activeDropdown === "placements" && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ top: "117px" }}
          onMouseEnter={() => handleDropdownEnter("placements")}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-20 py-6">
            <div className="flex gap-0 rounded-2xl overflow-hidden shadow-2xl">
              <div
                className="w-96 bg-gradient-to-br from-primary/90 to-primary/95 text-white p-10 flex flex-col justify-between relative overflow-hidden"
                style={{
                  backgroundImage: "url(/assets/loyola-building.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/90 z-0" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-4">
                    {menuData.placements.title}
                  </h2>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    {menuData.placements.description}
                  </p>
                </div>
                <Link
                  href={menuData.placements.ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:gap-3 transition-all z-10"
                >
                  {menuData.placements.ctaText} <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex-1 bg-white p-10 border-l border-gray-100">
                <div className="grid grid-cols-3 gap-10">
                  {menuData.placements.sections.map((section, idx) => (
                    <div key={idx} className="space-y-5">
                      <h3 className="text-primary font-bold text-base pb-2 border-b-2 border-gray-200">
                        {section.title}
                      </h3>
                      <ul className="space-y-4">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-700 hover:text-primary transition flex items-center gap-2 group"
                            >
                              <ChevronDown
                                size={16}
                                className="rotate-[-90deg] text-gray-400 group-hover:text-primary"
                              />
                              {link.name}
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

      {/* Mobile Menu - unchanged */}
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
              href="/campus"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Campus Life
            </Link>
            <Link
              href="/iqac"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              IQAC
            </Link>
            <Link
              href="/placements"
              className="block font-medium text-gray-900 hover:text-primary"
            >
              Placements
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
