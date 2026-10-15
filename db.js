const{Pool}= require('pg');
//require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'NANA-DAYCARE',
    password: 'HUSTLER',
    port: 5432,
});
//test database connection
pool.connect((err) => {
    if (err) {
       console.error('Database connection error:', err.stack);
   } else {
console.log('Connected to PostgreSQL database');
        }
   });
    module.exports = pool;