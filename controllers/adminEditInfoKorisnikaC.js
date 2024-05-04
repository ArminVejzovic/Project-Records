const pool = require('../postgresql/config');
const bcrypt = require("bcrypt");

const adminRenderujOdabirKorisnika =  async (req, res) => {
    try {
        const users = await pool.query('SELECT id, ime, prezime FROM radnici');
        res.render('adminEditInfoOdabirKorisnika', { users: users.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const adminPreuzmiOdabirRedirektajDalje =  async (req, res) => {
    const { selectedUserId } = req.body;

    if (!selectedUserId) {
        return res.status(400).send('Invalid user selection');
    }

    res.redirect(`/admin/users/edit/${selectedUserId}`);
};

const adminRenderujFormuZaEdit =  async (req, res) => {
    const { id } = req.params;

    try {
        const user = await pool.query('SELECT * FROM radnici WHERE id = $1', [id]);

        if (!user.rows.length) {
            return res.status(404).send('User not found');
        }

        res.render('adminEditInfoKorisnikaForma', { user: user.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const saltRounds = 10;
const adminAzurirajPodatkeZaKorisnika =  async (req, res) => {
    const { id } = req.params;
    const { ime, prezime, email, password, uloga } = req.body;
    const employeeId = req.user.id;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await pool.query('UPDATE radnici SET ime=$1, prezime=$2, email=$3, password=$4, uloga=$5 WHERE id=$6',
            [ime, prezime, email, hashedPassword, uloga, id]);

        const porukaEditInfo = "Azurirani su podaci od " + uloga + "a sa imenom " + ime + " " + prezime + " i korisnickim imenom: " + email;


        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, porukaEditInfo]
        );

        res.redirect('/uspjeh');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { adminRenderujOdabirKorisnika, adminPreuzmiOdabirRedirektajDalje, adminRenderujFormuZaEdit, adminAzurirajPodatkeZaKorisnika };
