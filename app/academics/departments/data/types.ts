// // export interface Faculty {
// //   id: string;
// //   name: string;
// //   designation: string;
// //   qualification: string;
// //   specialization: string;
// //   image: string;
// //   email: string;
// //   phone?: string;
// // }

// // export interface Programme {
// //   id: string;
// //   name: string;
// //   duration: string;
// //   type: "UG" | "PG" | "Research";
// //   eligibility: string;
// //   seats?: number;
// // }

// // export interface Syllabus {
// //   semester: string;
// //   subjects: string[];
// //   pdfLink?: string;
// // }

// // export interface Department {
// //   id: string;
// //   name: string;
// //   shortName: string;
// //   slug: string;
// //   category: string;
// //   image: string;
// //   shortDescription: string;

// //   // Detailed page content
// //   introduction: {
// //     title: string;
// //     description: string[];
// //     highlights: string[];
// //   };

// //   goals: {
// //     vision: string;
// //     mission: string[];
// //     objectives: string[];
// //   };

// //   faculty: Faculty[];

// //   programmes: {
// //     ug: Programme[];
// //     pg: Programme[];
// //     research: Programme[];
// //   };

// //   syllabus: {
// //     ug: Syllabus[];
// //     pg: Syllabus[];
// //   };

// //   facilities?: string[];
// //   achievements?: string[];
// // }








// export interface Faculty {
//   id: number;
//   name: string;
//   designation: string;
//   qualification: string;
//   specialization: string;
//   email: string;
//   phone?: string;
//   image: string;
// }

// export interface Programme {
//   id: number;
//   name: string;
//   duration: string;
//   eligibility: string;
//   seats?: number;
// }

// export interface Syllabus {
//   id:number;
//   semester: string;
//   courses: string[];
//   downloadLink?: string;
//   pdfLink?: string;
//   subjects:string;
// }

// export interface Eligibility {
//   criteria: string;
//   indexCalculation: string;
//   additionalInfo: string[];
//   seats: number;
//   weightage: {
//     entrance: number;
//     hsExam: number;
//     interview: number;
//   };
//   importantDates: {
//     applicationDeadline: string;
//     entranceExam: string;
//     rankListPublication: string;
//   };
// }

// export interface Department {
//   id: string;
//   name: string;
//   slug: string;
//   shortDescription: string;
//   category: string;
//   image: string;
//   introduction: {
//     title: string;
//     description: string[];
//     highlights: string[];
//   };
//   goals: {
//     vision: string;
//     mission: string[];
//     objectives: string[];
//   };
//   eligibility: Eligibility;
//   faculty: Faculty[];
//   programmes: {
//     ug: Programme[];
//     pg: Programme[];
//     research: Programme[];
//   };
//   syllabus: {
//     ug: Syllabus[];
//     pg: Syllabus[];
//   };
// }













export interface Faculty {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  email: string;
  phone?: string;
  image: string;
}

export interface Programme {
  id: number;
  name: string;
  duration: string;
  eligibility: string;
  seats?: number;
}

export interface Syllabus {
  id: number;
  semester: string;
  subjects: string[];  // Changed from 'courses' to 'subjects' and from string to string[]
  pdfLink?: string;    // Removed downloadLink, kept only pdfLink
}

export interface Eligibility {
  criteria: string;
  indexCalculation: string;
  additionalInfo: string[];
  seats: number;
  weightage: {
    entrance: number;
    hsExam: number;
    interview: number;
  };
  importantDates: {
    applicationDeadline: string;
    entranceExam: string;
    rankListPublication: string;
  };
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  image: string;
  introduction: {
    title: string;
    description: string[];
    highlights: string[];
  };
  goals: {
    vision: string;
    mission: string[];
    objectives: string[];
  };
  eligibility: Eligibility;
  faculty: Faculty[];
  programmes: {
    ug: Programme[];
    pg: Programme[];
    research: Programme[];
  };
  syllabus: {
    ug: Syllabus[];
    pg: Syllabus[];
  };
  syllabusLinks?: SyllabusLink[];
  publications?: PublicationCategory[];
}
export interface SyllabusLink {
  label: string;    // e.g. "MSW Syllabus - Latest"
  url: string;      // link to the PDF
}

export interface PublicationCategory {
  title: string;       // "Scholars" or "Students"
  image: string;       // circular avatar image path
  items: string[];     // list of publication names
  viewAllLink?: string;
}

