const bcrypt = require('bcryptjs');

// Usage: node scripts/generate-hash.js "YourPasswordHere"
const password = process.argv[2] || 'Loyola@Admin2025';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    return;
  }
  
});
