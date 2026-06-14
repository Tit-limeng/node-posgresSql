const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// async function testConnection() {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     console.log("✅ PostgreSQL connected successfully!");
//     console.log("Server time:", result.rows[0]);

//     await pool.end();
//   } catch (err) {
//     console.error("❌ Database connection failed:");
//     console.error(err.message);
//   }
// }

// testConnection();

module.exports = pool;



