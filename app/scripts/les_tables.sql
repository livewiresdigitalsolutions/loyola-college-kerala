-- ============================================
-- LES MySQL Tables
-- Run this script to create all required tables
-- for the LES section of the website
-- ============================================

-- Team Members
CREATE TABLE IF NOT EXISTS les_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(500) DEFAULT '/assets/defaultprofile.png',
    profile_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News Items
CREATE TABLE IF NOT EXISTS les_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    time_ago VARCHAR(100) DEFAULT 'Just now',
    content TEXT DEFAULT NULL,
    link VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images
CREATE TABLE IF NOT EXISTS les_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    src VARCHAR(500) NOT NULL,
    alt VARCHAR(255) DEFAULT '',
    category VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coordinators
CREATE TABLE IF NOT EXISTS les_coordinators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Info (single row table)
CREATE TABLE IF NOT EXISTS les_contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emails JSON DEFAULT NULL,
    phones JSON DEFAULT NULL,
    address TEXT DEFAULT NULL,
    office_hours_weekdays VARCHAR(255) DEFAULT NULL,
    office_hours_saturday VARCHAR(255) DEFAULT NULL,
    office_hours_sunday VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partner Organizations
CREATE TABLE IF NOT EXISTS les_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) DEFAULT NULL,
    logo VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Immediate Assistance Contacts
CREATE TABLE IF NOT EXISTS les_assistance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counselors
CREATE TABLE IF NOT EXISTS les_counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) DEFAULT NULL,
    image VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Counseling Time Slots
CREATE TABLE IF NOT EXISTS les_counseling_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteer Programs
CREATE TABLE IF NOT EXISTS les_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments (form submissions)
CREATE TABLE IF NOT EXISTS les_appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    address TEXT DEFAULT '',
    mobile_no VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age VARCHAR(10) DEFAULT '',
    counseling_date DATE NOT NULL,
    counseling_staff VARCHAR(255) NOT NULL,
    counseling_slot VARCHAR(100) NOT NULL,
    message TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteer Registrations (form submissions)
CREATE TABLE IF NOT EXISTS les_volunteer_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    address TEXT DEFAULT '',
    email VARCHAR(255) NOT NULL,
    age VARCHAR(10) DEFAULT '',
    qualification VARCHAR(255) DEFAULT '',
    institution_name VARCHAR(255) DEFAULT '',
    institution_address TEXT DEFAULT '',
    programme VARCHAR(255) NOT NULL,
    duration VARCHAR(100) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Form Submissions
CREATE TABLE IF NOT EXISTS les_contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT '',
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
