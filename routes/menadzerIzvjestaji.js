const express = require('express');
const router = express.Router();
const menadzerIzvjestajiC = require('../controllers/menadzerIzvjestajiC');

router.get('/menager/reports/dropdown', menadzerIzvjestajiC.menadzerRenderujIzvjestajProjektiDropdown);
router.get('/menager/reports', menadzerIzvjestajiC.menadzerGenerisiIzvjestaj);

module.exports = router;