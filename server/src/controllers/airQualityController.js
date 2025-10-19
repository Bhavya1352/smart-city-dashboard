const axios = require('axios');
const NodeCache = require('node-cache');
const { pool } = require('../database/db');

// Cache for 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

// New helper: normalize city consistently
const normalizeCity = (input) => {
	// trim, collapse spaces, remove dots, lowercase
	return String(input || '').trim().replace(/\.+/g, '').replace(/\s+/g, ' ').toLowerCase();
};

const getAirQualityData = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const normalizedCity = normalizeCity(city);
  console.log(`\n💨 Air Quality request for: ${city} (normalized: ${normalizedCity})`);

  const cacheKey = `airquality_${encodeURIComponent(normalizedCity)}`;

  try {
    // Check cache first and validate cached.normalizedCity matches normalizedCity
    const cached = cache.get(cacheKey);
    if (cached && cached.normalizedCity === normalizedCity) {
      console.log(`🗂️ AQI Cache HIT for ${normalizedCity} (age sec: ${Math.floor((Date.now() - new Date(cached.updatedAt).getTime())/1000)})`);
      return res.json(cached);
    }
    console.log(`🗂️ AQI Cache MISS for ${normalizedCity}`);

    // Try to get real data from OpenWeatherMap Air Pollution API
    const API_KEY = process.env.OPENWEATHER_API_KEY; // Add your API key

    // First get coordinates for the city (use original city in query to allow richer geo lookup)
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
    const geoResponse = await axios.get(geoUrl);

    if (!Array.isArray(geoResponse.data) || geoResponse.data.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon, name: apiCityName } = geoResponse.data[0];

    // Get air quality data
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const aqiResponse = await axios.get(aqiUrl);
    const aqiData = aqiResponse.data.list[0];

    const aqi = Math.round((aqiData.main?.aqi || 1) * 50); // Convert to standard-ish AQI scale
    const pm25 = Math.round(aqiData.components?.pm2_5 || 0);
    const pm10 = Math.round(aqiData.components?.pm10 || 0);

    const realData = {
      city: apiCityName || city,
      normalizedCity,
      airQuality: {
        aqi: aqi,
        pm25: pm25,
        pm10: pm10,
        status: getAQIStatus(aqi),
        no2: Math.round(aqiData.components.no2 || 0),
        so2: Math.round(aqiData.components.so2 || 0),
        co: Math.round(aqiData.components.co || 0),
        o3: Math.round(aqiData.components.o3 || 0)
      },
      predictions: generateAQIPredictions(aqiData),
      source: '🌐 OpenWeatherMap Air Quality API',
      updatedAt: new Date().toISOString(),
    };

    console.log(`✅ SUCCESS! Real AQI for ${realData.city}: ${realData.airQuality.aqi} (${realData.airQuality.status})`);
    cache.set(cacheKey, realData);
    return res.json(realData);

  } catch (err) {
    // API or geo error -> attempt to generate deterministic mock data per city
    console.log(`⚠️ AQI API/geo error for "${city}" (${normalizedCity}): ${err.message}. Generating mock data...`);

    try {
      // Deterministic pseudo-hash from normalized city name for consistent unique mocks
      let hash = 0;
      for (let i = 0; i < normalizedCity.length; i++) {
        hash = (hash << 5) - hash + normalizedCity.charCodeAt(i);
        hash |= 0;
      }
      const absHash = Math.abs(hash);

      // Map hash to reasonable AQI ranges and PM2.5 values
      const baseAQI = 30 + (absHash % 170); // 30..199
      const basePM25 = Math.max(5, Math.round(baseAQI / 2 + (absHash % 20) - 5));

      // Time-based variation (worse in morning/evening rush hours)
      const hour = new Date().getHours();
      const timeVariation = (hour >= 7 && hour <= 10) || (hour >= 18 && hour <= 21) ? 20 : -8;
      const dailyVariation = Math.round(Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 12);

      const finalAQI = Math.max(10, Math.min(500, Math.round(baseAQI + timeVariation + dailyVariation + (absHash % 15) - 7)));
      const finalPM25 = Math.max(4, Math.round(basePM25 + (timeVariation * 0.35) + (absHash % 7) - 3));

      const mockData = {
        city,
        normalizedCity,
        airQuality: {
          aqi: finalAQI,
          pm25: finalPM25,
          pm10: Math.round(finalPM25 * 1.25),
          status: getAQIStatus(finalAQI),
          no2: 10 + (absHash % 60),
          so2: 5 + (absHash % 25),
          co: 200 + (absHash % 1200),
          o3: 20 + (absHash % 90)
        },
        predictions: generateAQIPredictions({ components: { pm2_5: finalPM25 } }),
        source: '📝 Enhanced Mock Data',
        updatedAt: new Date().toISOString(),
      };

      console.log(`✅ SUCCESS! Mock AQI for ${city} (${normalizedCity}): ${mockData.airQuality.aqi} (${mockData.airQuality.status})`);
      cache.set(cacheKey, mockData);
      return res.json(mockData);
    } catch (mockErr) {
      console.error(`❌ AQI Mock generation error for ${city}:`, mockErr.message);

      const fallbackData = {
        city,
        normalizedCity,
        airQuality: { aqi: 85, pm25: 45, pm10: 65, status: 'Moderate', no2: 25, so2: 15, co: 500, o3: 40 },
        predictions: { nextHours: [85, 90, 88], trend: 'stable' },
        updatedAt: new Date().toISOString(),
      };

      return res.json(fallbackData);
    }
  }
};

const generateAQIPredictions = (aqiData) => {
  const currentPM25 = aqiData.components?.pm2_5 || 45;
  const hour = new Date().getHours();

  // Simple prediction logic based on time and current conditions
  const predictions = {
    nextHours: [],
    trend: 'stable',
    confidence: 70
  };

  // Generate next 6 hours predictions
  for (let i = 1; i <= 6; i++) {
    const timeVariation = (hour >= 7 && hour <= 10) || (hour >= 18 && hour <= 21) ? 15 : -10; // Rush hour effect
    const predictedPM25 = Math.round(currentPM25 + (timeVariation * 0.3) + Math.random() * 10 - 5);
    const predictedAQI = Math.max(10, Math.min(500, Math.round(predictedPM25 * 2)));
    predictions.nextHours.push(predictedAQI);
  }

  // Determine trend
  const avgNext = predictions.nextHours.reduce((a, b) => a + b, 0) / predictions.nextHours.length;
  const currentAQI = currentPM25 * 2;
  if (avgNext > currentAQI + 20) predictions.trend = 'worsening';
  else if (avgNext < currentAQI - 20) predictions.trend = 'improving';
  else predictions.trend = 'stable';

  return predictions;
};

const getAQIStatus = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

module.exports = { getAirQualityData };