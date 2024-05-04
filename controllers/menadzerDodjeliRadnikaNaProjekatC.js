const pool = require('../postgresql/config');

const menadzerRenderujDodjeliRadnikaNaProjekat =  async (req, res) => {
    const projects = await pool.query('SELECT * FROM projekti');
    const employees = await pool.query('SELECT * FROM radnici WHERE uloga = $1', ['radnik']);

    res.render("menadzerDodjeliRadnikaNaProjekat", { user: req.user, projects: projects.rows, employees: employees.rows });
};

const menadzerDodjeliRadnikaNaProjekat =  async (req, res) => {
    const { projectId, employeeId } = req.body;
    const menagerId = req.user.id;

    try {
        await pool.query('INSERT INTO dodjeljeni_projekti (radnik_id, projekt_id, menadzer_id) VALUES ($1, $2, $3)',
            [employeeId, projectId, menagerId]);

        const projectQuery = await pool.query('SELECT naziv FROM projekti WHERE id = $1', [projectId]);
        const projectNaziv = projectQuery.rows[0].naziv;

        const employeeQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [employeeId]);
        const employeeIme = employeeQuery.rows[0].ime;
        const employePrezime = employeeQuery.rows[0].prezime;

        const menagerQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [menagerId]);
        const menagerIme = menagerQuery.rows[0].ime;
        const menagerPrezime = menagerQuery.rows[0].prezime;

        const tekstDodjeliRadnika = "Dodjeljen je radnik " + employeeIme + " " + employePrezime + " i menadzer " + menagerIme + " " + menagerPrezime + " na projekat pod nazivom: " + projectNaziv;


        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [employeeId, tekstDodjeliRadnika]
        );

        res.redirect("/uspjeh");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { menadzerRenderujDodjeliRadnikaNaProjekat, menadzerDodjeliRadnikaNaProjekat };

