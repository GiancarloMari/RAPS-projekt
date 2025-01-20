const db = require('../models/db');

// Dohvat svih studenata
const getAllStudents = (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Dodavanje studenta
const addStudent = (req, res) => {
    const { ime, prezime } = req.body;
    db.query('INSERT INTO students (ime, prezime) VALUES (?, ?)', [ime, prezime], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ime, prezime });
    });
};

// Dohvat studenta prema ID-u
const getStudentById = (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Student nije pronađen' });
        res.json(results[0]);
    });
};

module.exports = { getAllStudents, addStudent, getStudentById };
