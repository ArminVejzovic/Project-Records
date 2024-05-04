const pool = require('../postgresql/config');
const pdf = require('html-pdf');
const transporter = require('../mail/config');

const menadzerRenderujIzvjestajProjektiDropdown = async (req, res) => {
    try {
        const projects = await pool.query('SELECT * FROM projekti');
        res.render("menadzerIzvjestajProjektiDropdown", { user: req.user, projects: projects.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const menadzerGenerisiIzvjestaj = async (req, res) => {
    const { projectId } = req.query;
    const userId = req.user.id;

    try {
        // Dohvati projekat
        const projectResult = await pool.query('SELECT * FROM projekti WHERE id = $1', [projectId]);
        const projects = projectResult.rows[0];

        // Dohvati ukupan broj zadataka na projektu
        const totalTasksResult = await pool.query('SELECT COUNT(*) FROM zadaci WHERE projekt_id = $1', [projectId]);
        const totalTasks = totalTasksResult.rows[0];

        // Dohvati broj završenih zadataka
        const completedTasksResult = await pool.query('SELECT COUNT(*) FROM zadaci WHERE projekt_id = $1 AND zavrsen = $2', [projectId, true]);
        const completedTasks = completedTasksResult.rows[0].count;

        // Dohvati zadatke na projektu
        const tasksResult = await pool.query('SELECT * FROM zadaci WHERE projekt_id = $1', [projectId]);
        const tasks = tasksResult.rows;

        // Izračunaj procenat završenosti
        const completionPercentage = (completedTasks / totalTasks.count) * 100;

        const employeeResult = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [userId]);
        const employee = employeeResult.rows[0];

        // Renderuj EJS šablon
        await res.render('menadzerIzvjestaji', {
            projects,
            totalTasks,
            completedTasks,
            completionPercentage,
            tasks
        }, async (err, html) => {
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
                    subject: 'Izvještaj o radu zaposlenih za projekat ' + projects.naziv + ' u PDF formatu - ' + employee.ime + ' ' + employee.prezime,
                    text: 'Pogledajte priloženi izvještaj u PDF formatu.',
                    html: html, // Dodajte HTML ovdje ako želite poslati i HTML u e-mailu
                    attachments: [
                        {
                            filename: 'izvjestajRadZaposlenih.pdf',
                            content: pdfBuffer,
                        },
                    ],
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log('Izvještaj poslan!!');
                    await res.render('menadzerIzvjestaji', {
                        projects,
                        totalTasks,
                        completedTasks,
                        completionPercentage,
                        tasks
                    });
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



module.exports = { menadzerRenderujIzvjestajProjektiDropdown, menadzerGenerisiIzvjestaj};