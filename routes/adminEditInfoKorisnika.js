const express = require('express');
const router = express.Router();
const adminEditInfoKorisnikaC = require('../controllers/adminEditInfoKorisnikaC');


router.get('/admin/users/select', adminEditInfoKorisnikaC.adminRenderujOdabirKorisnika);
router.post('/admin/users/select', adminEditInfoKorisnikaC.adminPreuzmiOdabirRedirektajDalje);
router.get('/admin/users/edit/:id', adminEditInfoKorisnikaC.adminRenderujFormuZaEdit);
router.post('/admin/users/edit/:id', adminEditInfoKorisnikaC.adminAzurirajPodatkeZaKorisnika);

module.exports = router;