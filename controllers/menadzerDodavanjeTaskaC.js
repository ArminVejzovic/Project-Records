const pool = require('../postgresql/config');


const menadzerRenderujFormuDodavanjeTaska = async (req, res) => {
    try {
        const projects = await pool.query('SELECT * FROM projekti');
        res.render('menadzerDodavanjeTaska', { projects: projects.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const menadzerUnesiTaskNaProjekat = async (req, res) => {
    const {project, name, description} = req.body;
    const employeeId = req.user.id;
    try {
        // Dodajte novi task u bazu podataka
        const newTask = await pool.query('INSERT INTO zadaci (naziv, opis, projekt_id) VALUES ($1, $2, $3) RETURNING *', [name, description, project]);
        const projectsQuery = await pool.query('SELECT naziv FROM projekti WHERE id = $1', [project]);
        const projects = projectsQuery.rows[0];


        const textDodavanjeTaskaNaProjekat = "Kreiran task pod nazivom " + name + " na projektu " + projects.naziv;

        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, textDodavanjeTaskaNaProjekat]
        );

        res.render('uspjeh');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { menadzerRenderujFormuDodavanjeTaska, menadzerUnesiTaskNaProjekat };