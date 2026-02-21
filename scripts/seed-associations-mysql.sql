-- ============================================================
-- Student Associations — MySQL Schema + Seed Data
-- ============================================================

CREATE TABLE IF NOT EXISTS associations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    department VARCHAR(255),
    tag_color VARCHAR(20) DEFAULT '#059669',
    banner_gradient VARCHAR(255) DEFAULT 'from-emerald-700 via-green-800 to-teal-900',
    motto VARCHAR(255),
    description TEXT,
    about_paragraphs JSON DEFAULT ('[]'),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS association_team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    association_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    department VARCHAR(255),
    image VARCHAR(500),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS association_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    association_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    date VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    type VARCHAR(100),
    sort_order INT DEFAULT 0,
    FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed: Associations
-- ============================================================

INSERT INTO associations (slug, name, full_name, category, department, tag_color, banner_gradient, motto, description, about_paragraphs, contact_email, contact_phone, address, sort_order) VALUES
('lasie', 'LASIE', 'Loyola Association of Sociological Imagination & Engagement', 'Sociology Department', 'Department of Sociology', '#dc2626', 'from-emerald-700 via-green-800 to-teal-900', 'Marching Towards Margins', 'The Department of Sociology, Loyola College of Social Sciences, Thiruvananthapuram was started in the year 1963 as the founding department. LASIE provides a platform for sociological discourse, community engagement, and critical thinking.', '["The Department of Sociology, Loyola College of Social Sciences, Thiruvananthapuram was started in the year 1963 as the founding department. Ever since then, the department was able to engage itself creatively in the wider academic horizons of Sociology in Kerala through the activities of both students and teachers.","The activities and programmes are organized under the banner of LASIE (Loyola Association of Sociological Imagination and Engagement) designed as a unit of Kerala Sociological Society (KSS).","It is the organized forum comprising the faculty and students of the department and their engagement in academic and non-academic discourses. It is at the same time space and also a window for the students to intervene in the community and engage themselves in society.","In every academic year, LASIE tries to organize programmes and activities with a pulp to aid the process of framing the young sociologists."]', 'lasie@loyolacollegetvm.edu.in', '+91 471 259 7600', 'Department of Sociology,\nLoyola College of Social Sciences,\nSreekariyam, Thiruvananthapuram,\nKerala – 695017', 1),

('lamps', 'LAMPS', 'Loyola Association of Masters in Political Science', 'Political Science Department', 'Department of Political Science', '#2563eb', 'from-blue-700 via-indigo-800 to-blue-900', 'Empowering Democratic Minds', 'LAMPS is the student association of the Department of Political Science, fostering political awareness, democratic values, and civic responsibility among students.', '["The Department of Political Science at Loyola College of Social Sciences has been a centre of excellence in political education and civic awareness since its inception. LAMPS serves as the student association fostering political awareness, democratic values, and civic responsibility.","LAMPS conducts a wide array of programmes including mock parliaments, policy debates, political discussions, and civic awareness campaigns on contemporary political issues at local, national, and international levels.","The association serves as a dynamic platform where students engage with current affairs, governance structures, and public policy frameworks. Through active participation, students develop leadership skills and a deeper understanding of democratic processes.","LAMPS aims to develop future leaders who are well-versed in governance, public policy, and political theory, bridging the gap between academic learning and real-world political engagement."]', 'lamps@loyolacollegetvm.edu.in', '+91 471 259 7601', 'Department of Political Science,\nLoyola College of Social Sciences,\nSreekariyam, Thiruvananthapuram,\nKerala – 695017', 2),

('lacs', 'LACS', 'Loyola Association of Counselling Students', 'Counselling Department', 'Department of Counselling Psychology', '#7c3aed', 'from-purple-700 via-violet-800 to-purple-900', 'Healing through Understanding', 'LACS is dedicated to promoting mental health awareness and counselling skills among students through workshops, awareness programs, and peer counselling sessions.', '["The Department of Counselling Psychology at Loyola College of Social Sciences has been at the forefront of mental health education and awareness. LACS is the student association dedicated to promoting mental health awareness and counselling skills among students.","LACS organizes workshops, awareness programs, peer counselling sessions, and community outreach initiatives focused on psychological well-being.","The association provides a supportive platform for students to explore various counselling approaches, case study discussions, and evidence-based therapeutic practices through hands-on learning experiences.","Through community outreach programs, LACS extends its reach to schools, colleges, and underserved communities, spreading mental health awareness and providing basic counselling support."]', 'lacs@loyolacollegetvm.edu.in', '+91 471 259 7602', 'Department of Counselling Psychology,\nLoyola College of Social Sciences,\nSreekariyam, Thiruvananthapuram,\nKerala – 695017', 3),

('salt', 'SALT', 'Social Work Students Association of Loyola for Transformation', 'Social Work Department', 'Department of Social Work', '#ea580c', 'from-orange-700 via-amber-800 to-orange-900', 'Transforming Communities, Building Futures', 'SALT represents the Department of Social Work, embodying the spirit of social transformation and community service through field work, community development, and social awareness campaigns.', '["The Department of Social Work at Loyola College of Social Sciences has a strong tradition of community engagement and social transformation. SALT represents the student body, embodying the spirit of social service and community development.","SALT actively engages in field work, community development projects, and social awareness campaigns providing students with real-world exposure to social work practice.","The association organizes extension activities, awareness drives, and collaboration programmes with NGOs and government organizations to address pressing social issues.","SALT plays a pivotal role in building bridges between the academic world and grassroots communities, ensuring that students graduate with both theoretical knowledge and practical competence in social work."]', 'salt@loyolacollegetvm.edu.in', '+91 471 259 7603', 'Department of Social Work,\nLoyola College of Social Sciences,\nSreekariyam, Thiruvananthapuram,\nKerala – 695017', 4),

('lads', 'LADS', 'Loyola Association of Disaster Studies', 'Disaster Management Department', 'Department of Disaster Management', '#0d9488', 'from-teal-700 via-cyan-800 to-teal-900', 'Building Resilient Communities', 'LADS focuses on disaster preparedness, risk reduction, and emergency management education through training programs, mock drills, and community-based disaster preparedness activities.', '["The Department of Disaster Management at Loyola College of Social Sciences is one of the pioneering departments offering specialized education in disaster risk reduction and emergency management. LADS is the student association dedicated to promoting disaster preparedness and resilience.","LADS focuses on disaster preparedness, risk reduction, and emergency management education through practical training programmes, mock drills, and awareness campaigns.","Students actively participate in community-based disaster preparedness activities, first-aid training, hazard mapping, and post-disaster relief coordination.","LADS plays a crucial role in building resilient communities through education, capacity building, and practical training in disaster response and recovery."]', 'lads@loyolacollegetvm.edu.in', '+91 471 259 7604', 'Department of Disaster Management,\nLoyola College of Social Sciences,\nSreekariyam, Thiruvananthapuram,\nKerala – 695017', 5);

-- ============================================================
-- Seed: Team Members
-- ============================================================

-- LASIE team
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Dr. John Thomas', 'Staff Advisor', 'Department of Sociology', 1 FROM associations WHERE slug = 'lasie';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Ananya Krishnan', 'President', 'MSW Sociology', 2 FROM associations WHERE slug = 'lasie';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Rahul Menon', 'Vice President', 'MA Sociology', 3 FROM associations WHERE slug = 'lasie';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Sneha Nair', 'Secretary', 'MA Sociology', 4 FROM associations WHERE slug = 'lasie';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Arjun Das', 'Joint Secretary', 'BA Sociology', 5 FROM associations WHERE slug = 'lasie';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Meera Pillai', 'Treasurer', 'MA Sociology', 6 FROM associations WHERE slug = 'lasie';

-- LAMPS team
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Dr. Priya Varghese', 'Staff Advisor', 'Department of Political Science', 1 FROM associations WHERE slug = 'lamps';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Aditya Sharma', 'President', 'MA Political Science', 2 FROM associations WHERE slug = 'lamps';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Kavitha Raj', 'Vice President', 'MA Political Science', 3 FROM associations WHERE slug = 'lamps';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Vishnu Prasad', 'Secretary', 'MA Political Science', 4 FROM associations WHERE slug = 'lamps';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Lakshmi Devi', 'Joint Secretary', 'BA Political Science', 5 FROM associations WHERE slug = 'lamps';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Suresh Kumar', 'Treasurer', 'MA Political Science', 6 FROM associations WHERE slug = 'lamps';

-- LACS team
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Dr. Sarah Joseph', 'Staff Advisor', 'Department of Counselling Psychology', 1 FROM associations WHERE slug = 'lacs';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Deepa Mohan', 'President', 'MSc Counselling Psychology', 2 FROM associations WHERE slug = 'lacs';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Ravi Shankar', 'Vice President', 'MSc Counselling Psychology', 3 FROM associations WHERE slug = 'lacs';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Anjali Nair', 'Secretary', 'MSc Counselling Psychology', 4 FROM associations WHERE slug = 'lacs';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Thomas George', 'Joint Secretary', 'BSc Psychology', 5 FROM associations WHERE slug = 'lacs';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Preethi Das', 'Treasurer', 'MSc Counselling Psychology', 6 FROM associations WHERE slug = 'lacs';

-- SALT team
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Dr. Michael Fernandes', 'Staff Advisor', 'Department of Social Work', 1 FROM associations WHERE slug = 'salt';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Nithya Raj', 'President', 'MSW Social Work', 2 FROM associations WHERE slug = 'salt';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Ajith Kumar', 'Vice President', 'MSW Social Work', 3 FROM associations WHERE slug = 'salt';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Fathima Beevi', 'Secretary', 'MSW Social Work', 4 FROM associations WHERE slug = 'salt';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Sanjay Mohan', 'Joint Secretary', 'BSW Social Work', 5 FROM associations WHERE slug = 'salt';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Divya Lakshmi', 'Treasurer', 'MSW Social Work', 6 FROM associations WHERE slug = 'salt';

-- LADS team
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Dr. Rajesh Nair', 'Staff Advisor', 'Department of Disaster Management', 1 FROM associations WHERE slug = 'lads';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Arun Babu', 'President', 'MSc Disaster Management', 2 FROM associations WHERE slug = 'lads';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Reshma Raj', 'Vice President', 'MSc Disaster Management', 3 FROM associations WHERE slug = 'lads';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Vivek Menon', 'Secretary', 'MSc Disaster Management', 4 FROM associations WHERE slug = 'lads';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Sruthi Krishnan', 'Joint Secretary', 'BSc Disaster Management', 5 FROM associations WHERE slug = 'lads';
INSERT INTO association_team_members (association_id, name, role, department, sort_order)
SELECT id, 'Bibin Joseph', 'Treasurer', 'MSc Disaster Management', 6 FROM associations WHERE slug = 'lads';

-- ============================================================
-- Seed: Activities
-- ============================================================

-- LASIE activities
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Annual Sociology Seminar', 'March 2025', 'Loyola Auditorium', 'A national-level seminar bringing together sociologists, researchers, and students to discuss emerging trends in sociological research and social policy.', 'Seminar', 1 FROM associations WHERE slug = 'lasie';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Community Outreach Programme', 'January 2025', 'Attipra Village, Trivandrum', 'Field-based community engagement programme focusing on understanding the socio-economic dynamics of marginalized communities.', 'Outreach', 2 FROM associations WHERE slug = 'lasie';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Sociological Film Festival', 'December 2024', 'AV Hall, Loyola College', 'Screening and discussion of documentaries and films that explore sociological themes such as inequality, identity, and migration.', 'Cultural', 3 FROM associations WHERE slug = 'lasie';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Inter-Departmental Debate', 'November 2024', 'Seminar Hall', 'Engaging debates on contemporary social issues to build critical thinking and public speaking among sociology students.', 'Academic', 4 FROM associations WHERE slug = 'lasie';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Rural Immersion Camp', 'September 2024', 'Wayanad District', 'A week-long camp providing students with first-hand exposure to rural life, tribal communities, and grassroots development initiatives.', 'Field Work', 5 FROM associations WHERE slug = 'lasie';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'LASIE Inauguration Ceremony', 'August 2024', 'Loyola Auditorium', 'Annual inauguration of LASIE association activities with keynote address by eminent sociologists and cultural programmes by students.', 'Event', 6 FROM associations WHERE slug = 'lasie';

-- LAMPS activities
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Mock Parliament Session', 'February 2025', 'Loyola Auditorium', 'Annual mock parliament session simulating Lok Sabha proceedings to develop legislative understanding and public speaking among students.', 'Academic', 1 FROM associations WHERE slug = 'lamps';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'National Policy Debate', 'January 2025', 'Seminar Hall', 'Inter-collegiate debate competition on contemporary national policies, governance reforms, and constitutional amendments.', 'Debate', 2 FROM associations WHERE slug = 'lamps';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Voter Awareness Campaign', 'November 2024', 'Trivandrum City', 'Community outreach programme to promote voter awareness and civic participation among first-time voters.', 'Outreach', 3 FROM associations WHERE slug = 'lamps';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Political Film Screening', 'October 2024', 'AV Hall', 'Screening of critically acclaimed political films followed by panel discussions on governance and democracy.', 'Cultural', 4 FROM associations WHERE slug = 'lamps';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Leadership Workshop', 'September 2024', 'Seminar Hall', 'Workshop series on leadership skills, public speaking, and political communication for aspiring young leaders.', 'Workshop', 5 FROM associations WHERE slug = 'lamps';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'LAMPS Inauguration', 'August 2024', 'Loyola Auditorium', 'Grand inauguration of the academic year with keynote addresses by eminent political scientists and leaders.', 'Event', 6 FROM associations WHERE slug = 'lamps';

-- LACS activities
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Mental Health Awareness Week', 'March 2025', 'Loyola Campus', 'Week-long programme featuring talks, workshops, and creative activities to promote mental health awareness among students and staff.', 'Awareness', 1 FROM associations WHERE slug = 'lacs';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Peer Counselling Training', 'January 2025', 'Seminar Hall', 'Training programme equipping students with basic peer counselling skills to support fellow students.', 'Workshop', 2 FROM associations WHERE slug = 'lacs';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Community Mental Health Camp', 'December 2024', 'Vizhinjam, Trivandrum', 'Outreach camp providing mental health screening, awareness sessions, and basic counselling services to underserved communities.', 'Outreach', 3 FROM associations WHERE slug = 'lacs';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Art Therapy Workshop', 'November 2024', 'AV Hall', 'Experiential workshop exploring art-based therapeutic techniques for emotional expression and healing.', 'Workshop', 4 FROM associations WHERE slug = 'lacs';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Psychology Film Forum', 'October 2024', 'AV Hall', 'Screening and analysis of films depicting psychological themes, followed by group discussions on mental health representation.', 'Cultural', 5 FROM associations WHERE slug = 'lacs';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'LACS Inauguration', 'August 2024', 'Loyola Auditorium', 'Annual inauguration with keynote address by renowned counselling psychologists and interactive sessions for students.', 'Event', 6 FROM associations WHERE slug = 'lacs';

-- SALT activities
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Rural Immersion Camp', 'February 2025', 'Idukki District', 'Week-long residential camp providing students with firsthand experience of rural community life and grassroots social work practice.', 'Field Work', 1 FROM associations WHERE slug = 'salt';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Street Play for Social Awareness', 'January 2025', 'Trivandrum City', 'Series of street plays highlighting social issues like child labour, domestic violence, and substance abuse for public awareness.', 'Outreach', 2 FROM associations WHERE slug = 'salt';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'NGO Collaboration Workshop', 'December 2024', 'Seminar Hall', 'Workshop with leading NGOs to explore collaboration opportunities and understand real-world social work interventions.', 'Workshop', 3 FROM associations WHERE slug = 'salt';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Blood Donation Drive', 'November 2024', 'Loyola Campus', 'Annual blood donation camp organized in collaboration with the Red Cross to promote voluntary blood donation among students.', 'Service', 4 FROM associations WHERE slug = 'salt';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Community Development Seminar', 'October 2024', 'Loyola Auditorium', 'National seminar on community development approaches with experts from social work academia and practice.', 'Seminar', 5 FROM associations WHERE slug = 'salt';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'SALT Inauguration', 'August 2024', 'Loyola Auditorium', 'Grand inauguration with keynote by distinguished social workers and cultural programmes by students.', 'Event', 6 FROM associations WHERE slug = 'salt';

-- LADS activities
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Disaster Preparedness Mock Drill', 'March 2025', 'Loyola Campus', 'Campus-wide mock drill simulating earthquake and fire scenarios to test emergency response preparedness and evacuation procedures.', 'Training', 1 FROM associations WHERE slug = 'lads';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Community First Aid Training', 'January 2025', 'Kazhakkoottam, Trivandrum', 'Training programme teaching basic first aid and emergency response skills to community members and school students.', 'Outreach', 2 FROM associations WHERE slug = 'lads';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Flood Relief Coordination', 'December 2024', 'Kuttanad, Alappuzha', 'Active participation in flood relief coordination, distributing supplies and providing support to affected families.', 'Relief', 3 FROM associations WHERE slug = 'lads';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'Hazard Mapping Workshop', 'November 2024', 'Seminar Hall', 'Hands-on workshop on hazard mapping techniques using GIS and remote sensing tools for disaster risk assessment.', 'Workshop', 4 FROM associations WHERE slug = 'lads';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'National Disaster Seminar', 'October 2024', 'Loyola Auditorium', 'National seminar on emerging challenges in disaster management with experts from NDMA and state disaster management authorities.', 'Seminar', 5 FROM associations WHERE slug = 'lads';
INSERT INTO association_activities (association_id, title, date, location, description, type, sort_order)
SELECT id, 'LADS Inauguration', 'August 2024', 'Loyola Auditorium', 'Annual inauguration with keynote address by disaster management professionals and interactive demonstrations.', 'Event', 6 FROM associations WHERE slug = 'lads';
