const express = require('express');
const router = express.Router();
const adminAktivnostZaposlenihC = require('../controllers/adminAktivnostZaposlenihC');


router.get('/admin/activity', adminAktivnostZaposlenihC.adminRenderujAktivnostZaposlenih);

module.exports = router;