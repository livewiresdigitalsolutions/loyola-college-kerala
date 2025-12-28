const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const mysqlConfig = {
  host: 'localhost',
  port: 3303,
  user: 'root',
  password: '',
  database: 'loyola',
};

async function createAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'Loyola@Admin2025';
  const role = process.argv[4] || 'super_admin';

  console.log('\n🔐 Creating Admin User...\n');

  try {
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    // Connect to database
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Connected to database');

    // Create table if not exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin', 'viewer') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('✅ Table verified/created');

    // Insert admin
    await connection.execute(
      'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role]
    );
    console.log('✅ Admin user created successfully\n');

    console.log('📋 Login Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${role}\n`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
 