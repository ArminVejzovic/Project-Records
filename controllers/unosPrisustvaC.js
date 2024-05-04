const pool = require('../postgresql/config');

const renderujFormuZaUnosPrisustva = async (req, res) => {
    try {
        res.render('unosPrisustva');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const unesiPrisustvoZaZaposlenog = async (req, res) => {
    const { attendanceDate, isPresent } = req.body;

    try {
        // Unos prisustva u bazu podataka
        await pool.query('INSERT INTO evidencija_prisustva (radnik_id, datum, prisutan) VALUES ($1, $2, $3)', [req.user.id, attendanceDate, isPresent === 'true']);

        res.redirect('/uspjeh');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { renderujFormuZaUnosPrisustva, unesiPrisustvoZaZaposlenog };