const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'loyola',
  multipleStatements: true,
};

async function main() {
  const conn = await mysql.createConnection(config);
  await conn.query('TRUNCATE TABLE college_news;');
  console.log('college_news truncated');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
