// Run with: node scripts/init-journal-tables.mjs
import mysql from 'mysql2/promise';

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'loyola',
    multipleStatements: true,
};

const SQL = `
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

CREATE TABLE IF NOT EXISTS password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts INT DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function init() {
    console.log('Connecting to MySQL...', config.host, config.port, config.database);
    const conn = await mysql.createConnection(config);
    console.log('Connected! Creating tables...');
    await conn.query(SQL);
    console.log('✓ journal_users created');
    console.log('✓ journal_articles created');
    console.log('✓ password_reset_otps created');

    // Verify
    const [tables] = await conn.query("SHOW TABLES LIKE 'journal%'");
    console.log('\\nJournal tables in DB:', tables);

    const [otpTable] = await conn.query("SHOW TABLES LIKE 'password_reset%'");
    console.log('OTP tables in DB:', otpTable);

    await conn.end();
    console.log('\\nDone!');
}

init().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
