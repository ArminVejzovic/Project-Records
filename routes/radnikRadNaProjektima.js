const express = require('express');
const router = express.Router();
const radnikRadNaProjektimaC = require('../controllers/radnikRadNaProjektimaC');


router.get('/employee/projects/selection', radnikRadNaProjektimaC.radnikRenderujPrikazProjekata);
router.get('/employee/projects/work:projectId', radnikRadNaProjektimaC.radnikRadNaOdabranomProjektu);
router.post('/employee/projects/quick-submit-hours', radnikRadNaProjektimaC.brziUnosRadnihSati);
router.post('/employee/projects/submit-hours/:projectId', radnikRadNaProjektimaC.unesiRadneSate);

module.exports = router;