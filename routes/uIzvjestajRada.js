const express = require('express');
const router = express.Router();
const uIzvjestajRadaC = require('../controllers/uIzvjestajRadaC');


router.get('/generate-work-report', uIzvjestajRadaC.renderujIspisIzvjestajaRada);

module.exports = router;