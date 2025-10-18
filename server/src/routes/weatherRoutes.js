
const { Router } = require('express');
const { getWeatherData } = require('../controllers/weatherController');

const router = Router();

router.get('/weather', getWeatherData);

module.exports = router;
