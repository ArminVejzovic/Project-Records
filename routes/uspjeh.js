const express = require('express');
const router = express.Router();

router.get('/uspjeh', async (req, res) => {
    try {
        res.render('uspjeh');
    } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
