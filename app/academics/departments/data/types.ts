export interface Faculty {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  image: string;
  email: string;
  phone?: string;
}

export interface Programme {
  id: string;
  name: string;
  duration: string;
  type: "UG" | "PG" | "Research";
  eligibility: string;
  seats?: number;
}

export interface Syllabus {
  semester: string;
  subjects: string[];
  pdfLink?: string;
}

export interface Department {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: string;
  image: string;
  shortDescription: string;
  
  // Detailed page content
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
  
  facilities?: string[];
  achievements?: string[];
}
