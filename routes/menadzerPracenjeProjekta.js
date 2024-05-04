const express = require('express');
const router = express.Router();
const menadzerPracenjeNapretkaProjektaC = require('../controllers/menadzerPracenjeProjektaC');


router.get('/menager/projects/dropdown', menadzerPracenjeNapretkaProjektaC.menadzerRenderujDropdownZaOdabirProjektaDetalji);
router.get('/menager/projects/details', menadzerPracenjeNapretkaProjektaC.menadzerRenderujProjekatDetalji);

module.exports = router;