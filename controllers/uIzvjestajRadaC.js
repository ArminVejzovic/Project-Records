const pool = require('../postgresql/config');
const pdf = require('html-pdf');
const transporter = require('../mail/config');

const renderujIspisIzvjestajaRada = async (req, res) => {
    try {
        const userId = req.user.id;
        const radniSati = await pool.query('SELECT * FROM radni_sati WHERE radnik_id = $1', [userId]);
        const prisustvo = await pool.query('SELECT * FROM evidencija_prisustva WHERE radnik_id = $1', [userId]);

        const radnikQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [userId]);
        const radnik = radnikQuery.rows[0];

        // Prikaz izvještaja
        await res.render('uIzvjestajRada', { radniSati: radniSati.rows, prisustvo: prisustvo.rows }, async (err, html) => {
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
                    subject: 'Izvještaj rada u PDF formatu - ' + radnik.ime + " " + radnik.prezime,
                    text: 'Pogledajte priloženi izvještaj u PDF formatu.',
                    html: html,
                    attachments: [
                        {
                            filename: 'izvjestajPrisustvoRadnoVrijeme.pdf',
                            content: pdfBuffer,
                        },
                    ],
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log("Izvjestaj poslan!!");
                    res.render('uIzvjestajRada', { radniSati: radniSati.rows, prisustvo: prisustvo.rows });
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

module.exports = { renderujIspisIzvjestajaRada };
