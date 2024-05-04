const pool = require('../postgresql/config');
const transporter = require('../mail/config');

const renderujStranicuZaSlanjeObavjestenjaNaMail = async (req, res) => {
    try {
        res.render('slanjeObavjestenjaNaMailZaposlenim');
    } catch (error) {
        console.error("Greška prilikom renderovanja stranice:", error);
        res.status(500).send("Greška prilikom renderovanja stranice");
    }
};

const posaljiObavjestenjeNaMail = async (req, res) => {
    try {
        const obavestenjeTekst = req.body.obavestenje;
        const myMail = "my.mail@example.com";

        //const zaposleni = await pool.query('SELECT email FROM radnici WHERE email = $1', [myMail]);
        const posiljaocQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [req.user.id]);
        const posiljaoc = posiljaocQuery.rows[0];
        console.log(posiljaoc);

        // Slanje e-maila svakom zaposlenom
        //await Promise.all(zaposleni.rows.map(async (zaposlen) => {
        //    const emailAdresa = zaposlen.email;

        await transporter.sendMail({
            from: 'evidencija.projekata@outlook.com',
            to: myMail,
            subject: 'Novo obaveštenje od ' + posiljaoc.ime + " " + posiljaoc.prezime,
            text: obavestenjeTekst
        });
        //}));

        await res.redirect("/uspjeh");
    } catch (error) {
        console.error("Greška prilikom unosa obaveštenja:", error);
        res.sendStatus(500);
    }
};

module.exports = { renderujStranicuZaSlanjeObavjestenjaNaMail, posaljiObavjestenjeNaMail };