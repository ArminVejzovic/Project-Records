const express = require('express');
const router = express.Router();
const adminDodjelaHijerarhije = require('../controllers/adminDodjelaHijerarhijeC');


router.get('/admin/users/hierarchy', adminDodjelaHijerarhije.adminRenderujOdabirZaposlenogHijerarhija);
router.post('/admin/users/hierarchy', adminDodjelaHijerarhije.adminRenderujOdabirNadredjenogHijerarhija);
router.post('/admin/users/hierarchy/:id', adminDodjelaHijerarhije.adminDodjelaHijerarhijeZaposlenima);

module.exports = router;