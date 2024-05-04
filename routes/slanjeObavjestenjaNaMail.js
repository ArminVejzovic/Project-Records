const express = require('express');
const router = express.Router();
const slanjeObavjestenjaNaMailC = require('../controllers/slanjeObavjestenjaNaMailC');


router.get('/enter-notification-to-employees-gmail', slanjeObavjestenjaNaMailC.renderujStranicuZaSlanjeObavjestenjaNaMail);
router.post('/send-notification-to-employees-gmail', slanjeObavjestenjaNaMailC.posaljiObavjestenjeNaMail);

module.exports = router;