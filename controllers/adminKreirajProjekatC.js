const pool = require('../postgresql/config');

const adminRenderujFormuZaKreiranjeProjekta = (req, res) => {
    res.render('adminKreirajProjekat');
};

const adminKreirajProjekat = async (req, res) => {
    const { naziv, opis, datumPocetka, datumZavrsetka } = req.body;
    const employeeId = req.user.id;

    try {
        await pool.query(
            'INSERT INTO projekti (naziv, opis, datum_pocetka, datum_zavrsetka) VALUES ($1, $2, $3, $4) RETURNING id',
            [naziv, opis, datumPocetka, datumZavrsetka]
        );
        const tekstZaKreiranjeProjekta = "Kreiran novi projekat sa imenom: " + naziv;
        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, tekstZaKreiranjeProjekta]
        );

        res.redirect('/projekti');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    adminRenderujFormuZaKreiranjeProjekta,
    adminKreirajProjekat,
};
