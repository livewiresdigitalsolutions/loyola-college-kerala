const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'loyola',
};

async function check() {
  try {
    const conn = await mysql.createConnection(config);
    const [p] = await conn.query('SELECT * FROM program_level');
    const [d] = await conn.query('SELECT * FROM degree');
    const [c] = await conn.query('SELECT * FROM course');
    
    // writing the result to a json file to avoid terminal garbling
    require('fs').writeFileSync('tmp-db-out.json', JSON.stringify({ p, d, c }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

check();
