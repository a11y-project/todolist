const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(client => {
        console.log('Connected to Supabase (PostgreSQL)');
        client.release();
    })
    .catch(err => {
        console.error('Error connecting to Supabase:', err.message);
    });

module.exports = pool;
