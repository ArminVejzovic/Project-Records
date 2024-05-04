const express = require('express');
const router = express.Router();
const menadzerDodavanjeTaskaC = require('../controllers/menadzerDodavanjeTaskaC');


router.get('/menager/projects/new-task', menadzerDodavanjeTaskaC.menadzerRenderujFormuDodavanjeTaska);
router.post('/menager/projects/create-task', menadzerDodavanjeTaskaC.menadzerUnesiTaskNaProjekat);


module.exports = router;