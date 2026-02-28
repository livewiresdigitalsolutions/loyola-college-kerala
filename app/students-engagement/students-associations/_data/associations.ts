// Types for the dynamic association data from the API

export interface TeamMember {
    id?: number;
    association_id?: number;
    name: string;
    role: string;
    department: string;
    image?: string;
    sort_order?: number;
}

export interface Activity {
    id?: number;
    association_id?: number;
    title: string;
    date: string;
    location: string;
    description: string;
    type: string;
    sort_order?: number;
}

export interface AssociationData {
    id: number;
    slug: string;
    name: string;
    full_name: string;
    category: string;
    department: string;
    tag_color: string;
    banner_gradient: string;
    motto: string;
    description: string;
    about_paragraphs: string[];
    contact_email: string;
    contact_phone: string;
    address: string;
    bg_image?: string;
    is_active: boolean;
    sort_order: number;
    teamMembers: TeamMember[];
    activities: Activity[];
}

// Listing page only gets a subset
export interface AssociationListItem {
    id: number;
    slug: string;
    name: string;
    full_name: string;
    category: string;
    department: string;
    tag_color: string;
    banner_gradient: string;
    bg_image?: string;
    motto: string;
    description: string;
}
