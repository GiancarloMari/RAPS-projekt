const express = require('express');
const {
    getAllStudents,
    addStudent,
    getStudentById
} = require('../controllers/studentsController');
const db = require('../models/db');
const router = express.Router();

// Rute
router.get('/', getAllStudents);            // Dohvat svih studenata
router.post('/', addStudent);               // Dodavanje studenta
router.get('/:id', getStudentById);         // Dohvat studenta po ID-u
router.delete('/:id', (req, res) => {
    const studentId = req.params.id;

    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [studentId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Greška prilikom brisanja studenta.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student nije pronađen.' });
        } else {
            res.status(200).json({ message: 'Student uspješno obrisan.', id: studentId });
        }
    });
});
// Brisanje ocjene prema ID-u
router.delete('/ocjene/:ocjenaId', (req, res) => {
    const ocjenaId = req.params.ocjenaId;

    const query = 'DELETE FROM ocjene WHERE id = ?';
    db.query(query, [ocjenaId], (err, result) => {
        if (err) {
            console.error('Greška prilikom brisanja ocjene:', err.message); // Dodan ispis greške
            res.status(500).json({ error: 'Greška prilikom brisanja ocjene.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ocjena nije pronađena.' });
        } else {
            res.status(200).json({ message: 'Ocjena uspješno obrisana.', id: ocjenaId });
        }
    });
});


router.get('/:id/ocjene', (req, res) => {
    const studentId = req.params.id;

    const query = 'SELECT * FROM ocjene WHERE student_id = ?';
    db.query(query, [studentId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Greška prilikom dohvaćanja ocjena.' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Nema ocjena za ovog studenta.' });
        } else {
            res.status(200).json(results);
        }
    });
});

router.post('/:id/ocjene', (req, res) => {
    const studentId = req.params.id;
    const { ocjena } = req.body;

    // Provjera da je ocjena unesena i validna
    if (!ocjena || ocjena < 1 || ocjena > 5) {
        return res.status(400).json({ message: 'Ocjena mora biti između 1 i 5.' });
    }

    const query = 'INSERT INTO ocjene (student_id, ocjena) VALUES (?, ?)';
    db.query(query, [studentId, ocjena], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Greška prilikom dodavanja ocjene.' });
        } else {
            res.status(201).json({ message: 'Ocjena uspješno dodana.', id: result.insertId });
        }
    });
});
router.put('/ocjene/:ocjenaId', (req, res) => {
    const ocjenaId = req.params.ocjenaId;
    const { novaOcjena } = req.body;

    // Validacija ocjene
    if (!novaOcjena || novaOcjena < 1 || novaOcjena > 5) {
        return res.status(400).json({ message: 'Ocjena mora biti između 1 i 5.' });
    }

    const query = 'UPDATE ocjene SET ocjena = ? WHERE id = ?';
    db.query(query, [novaOcjena, ocjenaId], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Greška prilikom ažuriranja ocjene.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ocjena nije pronađena.' });
        } else {
            res.status(200).json({ message: 'Ocjena uspješno ažurirana.' });
        }
    });
});


module.exports = router;
