const bcrypt = require('bcryptjs');

// Usage: node scripts/generate-hash.js "YourPasswordHere"
const password = process.argv[2] || 'Loyola@Admin2025';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('\n🔐 Password Hash Generated:\n');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n📋 SQL Insert Example:\n');
  console.log(`INSERT INTO admin_users (username, password_hash, role) VALUES ('admin', '${hash}', 'super_admin');`);
  console.log('\n');
});
