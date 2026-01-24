export interface Program {
  id: number;
  discipline: string;
}

export interface Degree {
  id: number;
  degree_name: string;
  program_level_id: number;
}

export interface Course {
  id: number;
  course_name: string;
  degree_id: number;
}

export interface ExamCenter {
  id: number;
  centre_name: string;
  location?: string;
}

export interface SubjectMark {
  subject_name: string;
  marks_obtained?: number;
  max_marks?: number;
  grade?: string;
  percentage?: number;
  subject_order?: number;
}

export interface AcademicMark {
  id?: number;
  qualification_level: '10th' | '12th' | 'ug' | 'pg';
  register_number?: string;
  board_or_university?: string;
  school_or_college?: string;
  year_of_passing?: string;
  percentage_or_cgpa?: string;
  stream_or_degree?: string;
  subjects?: SubjectMark[];
}

export interface BasicInfo {
  id?: number;
  program_level_id: string;
  degree_id: string;
  course_id: string;
  second_preference_course_id?: string;
  second_preference_degree_id?:string;
  third_preference_degree_id?:string;
  third_preference_course_id?: string;
  exam_center_id: string;
  academic_year?: string;
  form_status?: string;
  payment_status?: string;
  user_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalInfo {
  id?: number;
  admission_id?: number;
  full_name: string;
  gender: string;
  dob: string;
  mobile: string;
  email: string;
  aadhaar: string;
  nationality: string;
  religion?: string;
  category: string;
  seat_reservation_quota: string;
  caste: string;
  mother_tongue: string;
  nativity: string;
  blood_group?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FamilyInfo {
  id?: number;
  admission_id?: number;
  father_name: string;
  father_mobile: string;
  father_education: string;
  father_occupation: string;
  mother_name: string;
  mother_mobile: string;
  mother_education: string;
  mother_occupation: string;
  annual_family_income: string;
  is_disabled?: string;
  disability_type?: string;
  disability_percentage?: string;
  dependent_of?: string;
  seeking_admission_under_quota?: string;
  scholarship_or_fee_concession?: string;
  hostel_accommodation_required?: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_mobile: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddressInfo {
  id?: number;
  admission_id?: number;
  communication_address: string;
  communication_city: string;
  communication_state: string;
  communication_district: string;
  communication_pincode: string;
  communication_country: string;
  permanent_address: string;
  permanent_city: string;
  permanent_state: string;
  permanent_district: string;
  permanent_pincode: string;
  permanent_country: string;
  created_at?: string;
  updated_at?: string;
}

// Combined interface with both structured and flat data
export interface CompleteFormData extends BasicInfo, PersonalInfo, FamilyInfo, AddressInfo {
  // Structured nested data (from API response)
  basicInfo?: BasicInfo;
  personalInfo?: PersonalInfo;
  familyInfo?: FamilyInfo;
  addressInfo?: AddressInfo;
  academicMarks?: AcademicMark[];
  
  // Additional optional fields
  previous_gap?: string;
  extracurricular?: string;
  achievements?: string;
  
  // Legacy fields for backward compatibility
  tenth_register_number?: string;
  tenth_board?: string;
  tenth_school?: string;
  tenth_year?: string;
  tenth_percentage?: string;
  twelfth_register_number?: string;
  twelfth_board?: string;
  twelfth_school?: string;
  twelfth_year?: string;
  twelfth_percentage?: string;
  twelfth_stream?: string;
  ug_university?: string;
  ug_college?: string;
  ug_degree?: string;
  ug_year?: string;
  ug_percentage?: string;
  pg_university?: string;
  pg_college?: string;
  pg_degree?: string;
  pg_year?: string;
  pg_percentage?: string;
}
