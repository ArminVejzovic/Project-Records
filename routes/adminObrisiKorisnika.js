const express = require('express');
const router = express.Router();
const adminObrisiKorisnikaC = require('../controllers/adminObrisiKorisnikaC');


router.get('/admin/users/delete', adminObrisiKorisnikaC.adminRenderujObrisiKorisnika);
router.post('/admin/users/delete/:id', adminObrisiKorisnikaC.adminObrisiKorisnika);

module.exports = router;