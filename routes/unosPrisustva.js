const express = require('express');
const router = express.Router();
const unosPrisustvaC = require('../controllers/unosPrisustvaC');


router.get('/enter-attentdence', unosPrisustvaC.renderujFormuZaUnosPrisustva);
router.post('/track-attendance', unosPrisustvaC.unesiPrisustvoZaZaposlenog);


module.exports = router;