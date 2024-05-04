const pool = require('../postgresql/config');

const adminRenderujOdabirZaposlenogHijerarhija =  async (req, res) => {
    try {
        const users = await pool.query('SELECT id, ime, prezime FROM radnici');
        res.render('adminOdabirZaposlenogHijerarhija', { users: users.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const adminRenderujOdabirNadredjenogHijerarhija = async (req, res) => {
    const { selectedUserId } = req.body;

    try {
        const employees = await pool.query('SELECT id, ime, prezime FROM radnici WHERE id != $1', [selectedUserId]);
        res.render('adminDodavanjeNadredjenogHijerarhija', { employeeId: selectedUserId, employees: employees.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const adminDodjelaHijerarhijeZaposlenima = async (req, res) => {
    const { id } = req.params;
    const { nadredjeniId } = req.body;
    const employeeId = req.user.id;

    try {

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [id]);
        const radnikIme = radnikQuery.rows[0].ime;
        const radnikPrezime = radnikQuery.rows[0].prezime;


        const nadredjeniQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [nadredjeniId]);
        const nadredjeniIme = nadredjeniQuery.rows[0].ime;
        const nadredjeniPrezime = nadredjeniQuery.rows[0].prezime;


        await pool.query('UPDATE radnici SET nadredjeni_id = $1 WHERE id = $2', [nadredjeniId, id]);

        const tekstHijerarhija = "Korisniku " + radnikIme + " " + radnikPrezime + " je dodjeljen nadredjeni " + nadredjeniIme + " " + nadredjeniPrezime;

        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, tekstHijerarhija]
        );

        res.redirect('/uspjeh');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {adminRenderujOdabirZaposlenogHijerarhija, adminRenderujOdabirNadredjenogHijerarhija, adminDodjelaHijerarhijeZaposlenima};
