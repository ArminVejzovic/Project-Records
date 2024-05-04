const pool = require('../postgresql/config');
const pdf = require('html-pdf');
const transporter = require('../mail/config');


const menadzerRenderujDropdownZaOdabirProjektaDetalji =  async (req, res) => {
    try {
        const projects = await pool.query('SELECT * FROM projekti');
        res.render("menadzerPracenjeProjekataDropdown", { user: req.user, projects: projects.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const menadzerRenderujProjekatDetalji = async (req, res) => {
    const { projectId } = req.query;
    const userId = req.user.id;

    try {
        const project = await pool.query('SELECT * FROM projekti WHERE id = $1', [projectId]);
        const tasks = await pool.query('SELECT * FROM zadaci WHERE projekt_id = $1 AND zavrsen = false', [projectId]);
        const hours = await pool.query(
            'SELECT radni_sati.*, radnici.ime, radnici.prezime FROM radni_sati INNER JOIN radnici ON radni_sati.radnik_id = radnici.id WHERE radni_sati.projekt_id = $1',
            [projectId]
        );

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [userId]);
        const radnik = radnikQuery.rows[0];

        // Prikaz izveštaja
        await res.render('menadzerPracenjeProjekataDetalji', { user: req.user, project: project.rows[0], tasks: tasks.rows, hours: hours.rows }, async (err, html) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }

            // Generiranje PDF-a
            const pdfOptions = { format: 'A4' };
            await pdf.create(html, pdfOptions).toBuffer(async (err, pdfBuffer) => {
                if (err) {
                    console.error('Greška prilikom generiranja PDF-a', err);
                    return res.status(500).send('Internal Server Error');
                }

                // Slanje e-maila s priloženim PDF-om i HTML-om
                const mailOptions = {
                    from: 'evidencija.projekata@outlook.com',
                    to: 'my.mail@example.com',
                    subject: 'Izvještaj o ' + project.rows[0].naziv + ' u PDF formatu - ' + radnik.ime + ' ' + radnik.prezime,
                    text: 'Pogledajte priloženi izvještaj u PDF formatu.',
                    html: html,
                    attachments: [
                        {
                            filename: 'izvjestajProjekta.pdf',
                            content: pdfBuffer,
                        },
                    ],
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Izvještaj poslan!!');
                    await res.render('menadzerPracenjeProjekataDetalji', { user: req.user, project: project.rows[0], tasks: tasks.rows, hours: hours.rows });
                } catch (emailError) {
                    console.error('Greška prilikom slanja e-maila', emailError);
                    res.status(500).send('Internal Server Error');
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { menadzerRenderujDropdownZaOdabirProjektaDetalji, menadzerRenderujProjekatDetalji };
