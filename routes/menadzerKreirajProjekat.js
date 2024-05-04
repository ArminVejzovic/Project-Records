const express = require('express');
const router = express.Router();
const menadzerKreirajProjekatC = require('../controllers/menadzerKreirajProjekatC');


router.get('/menager/projects/create', menadzerKreirajProjekatC.menadzerRenderujFormuZaKreiranjeProjekta);
router.post('/menager/projects/create', menadzerKreirajProjekatC.menadzerKreirajProjekat);

module.exports = router;
