const pool = require('../postgresql/config');

const adminRenderujAktivnostZaposlenih = async (req, res) => {
    try {
        const activities = await pool.query('SELECT * FROM prijave ORDER BY timestamp DESC');

        const activitiesWithEditors = await Promise.all(
            activities.rows.map(async (activity) => {
                const editorQuery = await pool.query('SELECT ime, prezime FROM radnici WHERE id = $1', [activity.radnik_id]);
                const editorIme = editorQuery.rows[0].ime;
                const editorPrezime = editorQuery.rows[0].prezime;

                return {
                    ...activity,
                    editorIme,
                    editorPrezime,
                };
            })
        );

        res.render('adminAktivnostZaposlenih', { activities: activitiesWithEditors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { adminRenderujAktivnostZaposlenih }