const express = require('express');
const router = express.Router();
const menadzerDodjeliRadnikaNaProjekatC = require('../controllers/menadzerDodjeliRadnikaNaProjekatC');


router.get('/menager/projects/assign', menadzerDodjeliRadnikaNaProjekatC.menadzerRenderujDodjeliRadnikaNaProjekat);
router.post('/menager/projects/assign', menadzerDodjeliRadnikaNaProjekatC.menadzerDodjeliRadnikaNaProjekat);

module.exports = router;