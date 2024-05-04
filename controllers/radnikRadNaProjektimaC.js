const pool = require('../postgresql/config');

const radnikRenderujPrikazProjekata = async (req, res) => {

    const userId = req.user.id;
    //console.log(userId);

    try {
        // Prikazivanje projekata na kojima radnik radi
        //const projects = await pool.query('SELECT projekti.* FROM projekti JOIN dodjeljeni_projekti ON projekti.id = dodjeljeni_projekti.projekt_id WHERE dodjeljeni_projekti.radnik_id = $1', [userId]);

        const projects = await pool.query('SELECT DISTINCT projekti.* FROM projekti INNER JOIN zadaci ON projekti.id = zadaci.projekt_id WHERE zadaci.zavrsen = false');

        res.render('radnikRadNaProjektimaOdabirP', { projects: projects.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const radnikRadNaOdabranomProjektu = async (req, res) => {
    const projectId = req.params.projectId;
    //console.log(projectId);

    try {
        const projectQuery = await pool.query('SELECT * FROM projekti WHERE id = $1', [projectId]);
        const project = projectQuery.rows[0];

        if (project.length === 0) {
            return res.status(404).send('Projekat nije pronađen');
        }

        const tasksQuery = await pool.query('SELECT * FROM zadaci WHERE projekt_id = $1', [projectId]);
        const tasks = tasksQuery.rows;
        res.render('radnikRadNaOdabranomProjektu', { project, tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const brziUnosRadnihSati = async (req, res) => {

    const userId = req.user.id;

    try {

        const inputValue = req.body.quickInput;
        console.log(req.user.id);

        const regex = /^#(.+?)\s+##(.+?)\s+t(\d+)$/; // Regex za provjeru oblika
        const match = inputValue.match(regex);

        if (!match) {
            return res.send('<script>alert("Neispravan format unosa. Molimo koristite format #projekat ##task t5"); window.location.href = "/employee/projects/selection";</script>');
        }

        const project = match[1];
        const task = match[2];
        const hour = parseInt(match[3], 10);

        //console.log(project);
        //console.log(task);
        //console.log(hour);

        const result = await pool.query(`SELECT id FROM projekti WHERE naziv = $1`, [project]);

        if (result.rows.length === 0) {
            return res.send('<script>alert("Projekat nije pronađen."); window.location.href = "/employee/projects/selection";</script>');

        }

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [userId]);

        const radnikIme = radnikQuery.rows[0].ime;
        const radnikPrezime = radnikQuery.rows[0].prezime;

        const tekstZaBrziUnos = "Radnik " + radnikIme + " " + radnikPrezime + " je dodao " + hour + " sati rada za task " +
            task + " na projektu pod nazivom " + project;
        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [userId, tekstZaBrziUnos]
        );

        const projectId = result.rows[0].id;

        await pool.query(
            'INSERT INTO radni_sati (radnik_id, projekt_id, task, sati, datum) VALUES ($1, $2, $3, $4, now())',
            [userId, projectId, task, hour]
        );
        return res.send('<script>alert("Ispravno unesen format, podatci su uneseni u bazu podataka"); window.location.href = "/employee/projects/selection";</script>');


    } catch (error) {
        console.error(error);
        // Ako dođe do greške, vratite odgovor sa statusom 500 i odgovarajućom porukom
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const unesiRadneSate = async (req, res) => {
    const { tasks, hours, status } = req.body;
    const selectedTaskNaziv = req.body.task;
    const projectId = req.params.projectId;
    console.log(projectId);
    const userId = req.user.id;

    try {

        const zadaciQuery = await pool.query('SELECT naziv, opis FROM zadaci WHERE projekt_id = $1 AND naziv = $2', [projectId, selectedTaskNaziv]);
        const zadaci = zadaciQuery.rows[0];

        if(status === 'true') {
            await pool.query('UPDATE zadaci SET zavrsen = true WHERE naziv = $1 AND opis = $2 AND projekt_id = $3', [zadaci.naziv, zadaci.opis, projectId]);
        }

        await pool.query('INSERT INTO radni_sati (radnik_id, projekt_id, task, sati, datum) VALUES ($1, $2, $3, $4, now())',
            [userId, projectId, selectedTaskNaziv, hours]);

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [userId]);

        const radnikIme = radnikQuery.rows[0].ime;
        const radnikPrezime = radnikQuery.rows[0].prezime;

        const projectQuery = await pool.query('SELECT naziv FROM projekti WHERE id = $1', [projectId]);

        const project = projectQuery.rows[0].naziv;

        const tekstZaUnos = "Radnik " + radnikIme + " " + radnikPrezime + " je dodao " + hours + " sati rada za task " +
            selectedTaskNaziv + " na projektu pod nazivom " + project;
        await pool.query(
            'INSERT INTO prijave (radnik_id, action, timestamp) VALUES ($1, $2, now())',
            [userId, tekstZaUnos]
        );

        res.redirect(`/employee/projects/work${projectId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { radnikRenderujPrikazProjekata, radnikRadNaOdabranomProjektu, brziUnosRadnihSati, unesiRadneSate};
