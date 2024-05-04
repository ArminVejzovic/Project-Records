const pool = require('../postgresql/config');

const adminRenderujFormedodjeliProjekatRadnicima = async (req, res) => {
    try {
        const projects = await pool.query('SELECT * FROM projekti');
        const employees = await pool.query('SELECT * FROM radnici WHERE uloga = $1', ['radnik']);
        const menagers = await pool.query('SELECT * FROM radnici WHERE uloga = $1', ['menadzer']);

        res.render('adminDodjelaProjekataRadnicima', {projects: projects.rows, employees: employees.rows, managers: menagers.rows});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const adminDodjeliProjekatRadnicima = async (req, res) => {
    const { projectId, employeeId, managerId } = req.body;
    employeeId_user = req.user.id;

    try {

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [employeeId]);
        const menadzerQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [managerId]);
        const projekatQuery = await pool.query('SELECT naziv FROM projekti WHERE id = $1', [projectId]);


        const radnikIme = radnikQuery.rows[0].ime;
        const radnikPrezime = radnikQuery.rows[0].prezime;

        const menadzerIme = menadzerQuery.rows[0].ime;
        const menadzerPrezime = menadzerQuery.rows[0].prezime;

        const projekatIme = projekatQuery.rows[0].naziv

        await pool.query('INSERT INTO dodjeljeni_projekti (radnik_id, projekt_id, menadzer_id) VALUES ($1, $2, $3)', [employeeId, projectId, managerId]);
        const porukaZaDodjeluRadnika = "Dodjeljen je radnik " + radnikIme + " " + radnikPrezime + " i menadzer " + menadzerIme + " " + menadzerPrezime + " na projekat pod nazivom " + projekatIme;
        await pool.query('INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())', [employeeId_user, porukaZaDodjeluRadnika]);
        res.redirect('/uspjeh');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { adminRenderujFormedodjeliProjekatRadnicima, adminDodjeliProjekatRadnicima };