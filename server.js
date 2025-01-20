const express = require('express');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Rute
app.use('/api/students', studentRoutes);

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});
