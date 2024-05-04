const express = require('express');
const router = express.Router();
const pool = require('../postgresql/config');

router.get('/projekti', async (req, res) => {

    try {
        const result = await pool.query('SELECT * FROM projekti order by id desc');
        //console.log('Uspješno dohvaćeni projekti:', result.rows);
        res.render('projekti', { result: result });
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
