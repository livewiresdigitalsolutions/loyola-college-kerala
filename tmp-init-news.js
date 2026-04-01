const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'loyola',
  multipleStatements: true,
};

const SQL = `
CREATE TABLE IF NOT EXISTS college_news (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category    VARCHAR(100)   NOT NULL DEFAULT 'General',
  date        DATE           NOT NULL,
  title       VARCHAR(500)   NOT NULL,
  excerpt     TEXT,
  image       VARCHAR(500)   DEFAULT '/assets/loyola-building.png',
  lead_text   TEXT,
  body        JSON,
  section_title VARCHAR(300),
  section_body  TEXT,
  sort_order  INT            DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO college_news (id, category, date, title, excerpt, image, sort_order) VALUES
(1, 'Research',   '2026-01-08', 'Groundbreaking Study on Social Justice Published by Faculty',
 'Dr. Maria Thomas and her research team have published a comprehensive study examining the impact of community-led initiatives on social equity in Kerala.',
 '/assets/loyola.png', 0),
(2, 'Events',     '2026-01-05', 'Annual Cultural Festival ''Sangam 2026'' Announced',
 'Join us for three days of cultural celebrations, workshops, and performances by students and invited artists.',
 '/assets/loyola.png', 1),
(3, 'Admissions', '2025-12-28', 'Admissions Open for 2026-27 Academic Year',
 'Applications are now being accepted for all UG, PG, and Doctoral programmes. Apply before June 15, 2026.',
 '/assets/loyola.png', 2),
(4, 'Achievement', '2025-12-20', 'Students Win National Social Work Competition',
 'Team Loyola secures first place in the All-India Social Innovation Challenge held in New Delhi.',
 '/assets/loyola.png', 3);
`;

async function main() {
  console.log('Connecting to database...');
  const conn = await mysql.createConnection(config);
  console.log('Running SQL...');
  await conn.query(SQL);
  console.log('Table created and seeded successfully.');
  
  const [rows] = await conn.query('SELECT * FROM college_news');
  console.log('Current rows:', rows.length);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
