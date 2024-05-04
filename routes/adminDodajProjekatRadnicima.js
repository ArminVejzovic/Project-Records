const express = require('express');
const router = express.Router();
const adminDodjelaProjekataRadnicimaC = require('../controllers/adminDodjelaProjekataRadnicimaC');


router.get('/admin/projects/assign', adminDodjelaProjekataRadnicimaC.adminRenderujFormedodjeliProjekatRadnicima);
router.post('/admin/projects/assign', adminDodjelaProjekataRadnicimaC.adminDodjeliProjekatRadnicima);

module.exports = router;