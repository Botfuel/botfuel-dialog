const db = require('./db');
const User = require('./models/user');

if (!db.isConnected()) {
  db.connect();
}

// Remove all users
User.remove()
  .then(() => {
    console.log('Bot users has been clean');
    process.exit(0);
  })
  .catch(console.error);
