const express = require('express');
const router = express.Router();
const adminDodajKorisnikaC = require('../controllers/adminDodajKorisnikaC');


router.get('/admin/users/add', adminDodajKorisnikaC.adminRenderujFormuZaDodavanjeKorisnika);
router.post('/admin/users/add', adminDodajKorisnikaC.adminDodajKorisnika);

module.exports = router;