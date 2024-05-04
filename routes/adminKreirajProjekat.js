const express = require('express');
const router = express.Router();
const adminKreirajProjekatC = require('../controllers/adminKreirajProjekatC');


router.get('/admin/projects/create', adminKreirajProjekatC.adminRenderujFormuZaKreiranjeProjekta);
router.post('/admin/projects/create', adminKreirajProjekatC.adminKreirajProjekat);

module.exports = router;
