const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'gmari',
    database: process.env.DB_NAME || 'studentske_ocjene'
});

db.connect(err => {
    if (err) {
        console.error('Greška pri spajanju na bazu:', err.message);
        process.exit(1);
    }
    console.log('Uspješno povezivanje na bazu podataka.');
});

module.exports = db;
