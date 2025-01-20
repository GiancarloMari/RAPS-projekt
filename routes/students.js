const express = require('express');
const db = require('../models/db');
const router = express.Router();

// Rute za dohvaćanje svih studenata
router.get('/', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja studenata:', err.message);
            res.status(500).json({ error: 'Greška prilikom dohvaćanja studenata.' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Dodavanje novog studenta
router.post('/', (req, res) => {
    const { ime, prezime } = req.body;

    // Validacija ulaznih podataka
    if (!ime || !prezime) {
        return res.status(400).json({ message: 'Polja ime i prezime su obavezna.' });
    }

    const query = 'INSERT INTO students (ime, prezime) VALUES (?, ?)';
    db.query(query, [ime, prezime], (err, result) => {
        if (err) {
            console.error('Greška prilikom dodavanja studenta:', err.message);
            res.status(500).json({ error: 'Greška prilikom dodavanja studenta.' });
        } else {
            res.status(201).json({ id: result.insertId, ime, prezime });
        }
    });
});

// Dohvaćanje studenta po ID-u
router.get('/:id', (req, res) => {
    const studentId = req.params.id;
    const query = 'SELECT * FROM students WHERE id = ?';

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja studenta:', err.message);
            res.status(500).json({ error: 'Greška prilikom dohvaćanja studenta.' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Student nije pronađen.' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Brisanje studenta prema ID-u
router.delete('/:id', (req, res) => {
    const studentId = req.params.id;

    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [studentId], (err, result) => {
        if (err) {
            console.error('Greška prilikom brisanja studenta:', err.message);
            res.status(500).json({ error: 'Greška prilikom brisanja studenta.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Student nije pronađen.' });
        } else {
            res.status(200).json({ message: 'Student uspješno obrisan.', id: studentId });
        }
    });
});

// Dohvaćanje svih ocjena za određenog studenta
router.get('/:id/ocjene', (req, res) => {
    const studentId = req.params.id;

    const query = 'SELECT * FROM ocjene WHERE student_id = ?';
    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Greška prilikom dohvaćanja ocjena:', err.message);
            res.status(500).json({ error: 'Greška prilikom dohvaćanja ocjena.' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Nema ocjena za ovog studenta.' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Dodavanje nove ocjene za studenta
router.post('/:id/ocjene', (req, res) => {
    const studentId = req.params.id;
    const { ocjena } = req.body;

    // Validacija ocjene
    if (!ocjena || ocjena < 1 || ocjena > 5) {
        return res.status(400).json({ message: 'Ocjena mora biti između 1 i 5.' });
    }

    const query = 'INSERT INTO ocjene (student_id, ocjena) VALUES (?, ?)';
    db.query(query, [studentId, ocjena], (err, result) => {
        if (err) {
            console.error('Greška prilikom dodavanja ocjene:', err.message);
            res.status(500).json({ error: 'Greška prilikom dodavanja ocjene.' });
        } else {
            res.status(201).json({ message: 'Ocjena uspješno dodana.', id: result.insertId });
        }
    });
});

// Ažuriranje ocjene prema ID-u
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
            console.error('Greška prilikom ažuriranja ocjene:', err.message);
            res.status(500).json({ error: 'Greška prilikom ažuriranja ocjene.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ocjena nije pronađena.' });
        } else {
            res.status(200).json({ message: 'Ocjena uspješno ažurirana.' });
        }
    });
});

// Brisanje ocjene prema ID-u
router.delete('/ocjene/:ocjenaId', (req, res) => {
    const ocjenaId = req.params.ocjenaId;

    const query = 'DELETE FROM ocjene WHERE id = ?';
    db.query(query, [ocjenaId], (err, result) => {
        if (err) {
            console.error('Greška prilikom brisanja ocjene:', err.message);
            res.status(500).json({ error: 'Greška prilikom brisanja ocjene.' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Ocjena nije pronađena.' });
        } else {
            res.status(200).json({ message: 'Ocjena uspješno obrisana.', id: ocjenaId });
        }
    });
});

module.exports = router;
