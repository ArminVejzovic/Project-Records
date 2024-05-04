const pool = require('../postgresql/config');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const adminRenderujFormuZaDodavanjeKorisnika = (req, res) => {
    try {
        res.render('adminDodajKorisnika');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const adminDodajKorisnika =  async (req, res) => {
    const { ime, prezime, email, password, uloga } = req.body;
    const employeeId = req.user.id;

    try {

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query('INSERT INTO radnici (ime, prezime, email, password, uloga) VALUES ($1, $2, $3, $4, $5)', [ime, prezime, email, hashedPassword, uloga]);
        const porukaDodjelaKorisnika = "Dodan je " + uloga + " " + ime + " " + prezime + " sa emailom " + email;
        await pool.query('INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())', [employeeId, porukaDodjelaKorisnika]);
        res.redirect('/uspjeh');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { adminRenderujFormuZaDodavanjeKorisnika, adminDodajKorisnika};