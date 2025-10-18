
const { Router } = require('express');
const { getTransportData } = require('../controllers/transportController');

const router = Router();

router.get('/transport', getTransportData);

module.exports = router;
