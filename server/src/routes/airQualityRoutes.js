
const { Router } = require('express');
const { getAirQualityData } = require('../controllers/airQualityController');

const router = Router();

router.get('/airquality', getAirQualityData);

module.exports = router;
