const mysql = require('mysql2/promise');

async function createTable() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'loyola'
    });
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS les_donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        txnid VARCHAR(255) NOT NULL UNIQUE,
        easepayid VARCHAR(255),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(20),
        fund VARCHAR(100),
        donation_type VARCHAR(50),
        gateway VARCHAR(50) DEFAULT 'easebuzz',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('les_donations table created successfully');
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

createTable();
