const pool = require('../postgresql/config');

const adminRenderujObrisiKorisnika = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM radnici');
        res.render('adminObrisiKorisnika', { users: users.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const adminObrisiKorisnika =  async (req, res) => {
    const { id } = req.params;
    const employeeId = req.user.id;

    try {

        const userQuery = await pool.query('SELECT ime, prezime, email FROM radnici WHERE id = $1', [id]);

        const userIme = userQuery.rows[0].ime;
        const userPrezime = userQuery.rows[0].prezime;
        const userEmail = userQuery.rows[0].email;

        await pool.query('DELETE FROM dodjeljeni_projekti WHERE radnik_id = $1', [id]);
        await pool.query('DELETE FROM radni_sati WHERE radnik_id = $1', [id]);

        await pool.query('DELETE FROM radnici WHERE id = $1', [id]);
        const tekstZaBrisanje = "Obrisan je korisnik " + userIme + " " + userPrezime + " sa emailom: " + userEmail;
        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, tekstZaBrisanje]
        );
        res.redirect('/admin/users/delete');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { adminRenderujObrisiKorisnika, adminObrisiKorisnika};