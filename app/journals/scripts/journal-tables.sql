-- Loyola Journals - Database Schema
-- Run this on your VPS MySQL instance

-- Journal authors/users
CREATE TABLE IF NOT EXISTS journal_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salutation VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    designation VARCHAR(200),
    affiliation VARCHAR(300),
    country VARCHAR(100),
    state VARCHAR(100),
    city VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Articles submitted by journal users
CREATE TABLE IF NOT EXISTS journal_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    abstract TEXT,
    content LONGTEXT NOT NULL,
    keywords VARCHAR(500),
    category VARCHAR(200),
    status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'draft',
    admin_remarks TEXT,
    submitted_at DATETIME,
    reviewed_at DATETIME,
    reviewed_by VARCHAR(100),
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES journal_users(id) ON DELETE CASCADE
);

-- OTPs for forgot-password
CREATE TABLE IF NOT EXISTS password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_journal_users_email ON journal_users(email);
CREATE INDEX idx_journal_articles_user_id ON journal_articles(user_id);
CREATE INDEX idx_journal_articles_status ON journal_articles(status);
CREATE INDEX idx_password_reset_otps_email ON password_reset_otps(email);
