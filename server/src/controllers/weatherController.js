const axios = require('axios');
const NodeCache = require('node-cache');
const { pool } = require('../database/db');

// Cache for 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

const getWeatherData = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  // Normalize city to avoid cache collisions and mismatches
  const normalizedCity = city.trim().toLowerCase();
  console.log(`\n🌍 Weather request for: ${city} (normalized: ${normalizedCity})`);

  const cacheKey = `weather_${encodeURIComponent(normalizedCity)}`;

  try {
    // Check cache first and validate cached.city matches normalizedCity
    const cached = cache.get(cacheKey);
    if (cached && (String(cached.city).trim().toLowerCase() === normalizedCity)) {
      console.log(`🗂️ Cache HIT for ${normalizedCity}`);
      return res.json(cached);
    }
    console.log(`🗂️ Cache MISS for ${normalizedCity}`);

    // Try to get real data from OpenWeatherMap API
    const API_KEY = process.env.OPENWEATHER_API_KEY; // Add your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);
    const weatherData = response.data;

    const realData = {
      city: weatherData.name,
      weather: {
        temp: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        desc: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        pressure: weatherData.main.pressure
      },
      predictions: generateWeatherPredictions(weatherData),
      source: '🌐 OpenWeatherMap API',
      updatedAt: new Date().toISOString(),
    };

    console.log(`✅ SUCCESS! Real weather data for ${weatherData.name}: ${realData.weather.temp}°C`);
    cache.set(cacheKey, realData);
    return res.json(realData);

  } catch (apiError) {
    console.log(`⚠️ API failed for "${city}", using enhanced mock data for ${normalizedCity}`);

    try {
      // Enhanced city-specific realistic data as fallback
      const cityData = {
        'delhi': { baseTemp: 35, humidity: 68, desc: 'Hazy', icon: '50d' },
        'mumbai': { baseTemp: 29, humidity: 87, desc: 'Light rain', icon: '10d' },
        'bangalore': { baseTemp: 23, humidity: 52, desc: 'Pleasant', icon: '02d' },
        'chennai': { baseTemp: 32, humidity: 78, desc: 'Hot and humid', icon: '01d' },
        'kolkata': { baseTemp: 31, humidity: 82, desc: 'Muggy', icon: '04d' },
        'hyderabad': { baseTemp: 28, humidity: 58, desc: 'Warm', icon: '03d' },
        'pune': { baseTemp: 25, humidity: 48, desc: 'Moderate', icon: '02d' },
        'ahmedabad': { baseTemp: 38, humidity: 42, desc: 'Very hot', icon: '01d' },
        'jaipur': { baseTemp: 36, humidity: 38, desc: 'Dry heat', icon: '01d' },
        'goa': { baseTemp: 30, humidity: 85, desc: 'Heavy rain', icon: '10d' },
        'shimla': { baseTemp: 18, humidity: 65, desc: 'Cool', icon: '03d' },
        'manali': { baseTemp: 15, humidity: 70, desc: 'Cold', icon: '13d' }
      };

      const cityKey = normalizedCity.replace(/\./g, '').replace(/\s+/g, ' ');

      // If not found, generate deterministic mock values per city (so different unknown cities won't all become Delhi)
      const getCityInfo = (key) => {
        if (cityData[key]) return cityData[key];

        // Deterministic pseudo-hash from city name
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
          hash = (hash << 5) - hash + key.charCodeAt(i);
          hash |= 0;
        }
        // Map hash to reasonable ranges
        const baseTemp = 18 + (Math.abs(hash) % 18); // 18..35
        const humidity = 30 + (Math.abs(hash >> 3) % 60); // 30..89
        const descOptions = ['Partly cloudy', 'Clear', 'Light rain', 'Hazy', 'Windy', 'Overcast'];
        const desc = descOptions[Math.abs(hash >> 2) % descOptions.length];
        const iconMap = { 'Clear': '01d', 'Partly cloudy': '02d', 'Light rain': '10d', 'Hazy': '50d', 'Windy': '03d', 'Overcast': '04d' };

        return { baseTemp, humidity, desc, icon: iconMap[desc] || '02d' };
      };

      const cityInfo = getCityInfo(cityKey);

      // Add time-based variation
      const hour = new Date().getHours();
      const timeVariation = hour < 6 ? -5 : hour < 12 ? 0 : hour < 18 ? 3 : -2;

      // Add daily variation
      const dailyVariation = Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 3;

      const mockTemp = Math.round(cityInfo.baseTemp + timeVariation + dailyVariation + Math.floor(Math.random() * 3 - 1));
      const mockData = {
        city,
        weather: {
          temp: Math.max( -30, Math.min(60, mockTemp)),
          humidity: Math.max(10, Math.min(95, cityInfo.humidity + Math.floor(Math.random() * 8 - 4))),
          desc: cityInfo.desc,
          icon: cityInfo.icon,
          windSpeed: Math.floor(Math.random() * 12) + 3,
          pressure: 1013 + Math.floor(Math.random() * 30 - 15)
        },
        predictions: generateWeatherPredictions({ main: { temp: mockTemp }, weather: [{ description: cityInfo.desc }] }),
        source: '📝 Enhanced Mock Data',
        updatedAt: new Date().toISOString(),
      };

      console.log(`✅ SUCCESS! Mock data for ${city} (${normalizedCity}): ${mockData.weather.temp}°C`);
      cache.set(cacheKey, mockData);
      return res.json(mockData);
    } catch (mockError) {
      console.error(`❌ Error for ${city}:`, mockError.message);

      // Fallback data
      const fallbackData = {
        city,
        weather: { temp: 25, humidity: 65, desc: 'Partly cloudy', icon: '02d', windSpeed: 10, pressure: 1013 },
        predictions: { nextHours: [25, 26, 27], trend: 'stable' },
        source: 'fallback',
        updatedAt: new Date().toISOString(),
      };

      res.json(fallbackData);
    }
  }
};

const generateWeatherPredictions = (weatherData) => {
  const currentTemp = weatherData.main?.temp || 25;
  const hour = new Date().getHours();

  // Simple prediction logic based on time and current conditions
  const predictions = {
    nextHours: [],
    trend: 'stable',
    confidence: 75
  };

  // Generate next 6 hours predictions
  for (let i = 1; i <= 6; i++) {
    const timeVariation = (i * 2) - 3; // Slight variation
    const predictedTemp = Math.round(currentTemp + timeVariation + Math.random() * 2 - 1);
    predictions.nextHours.push(Math.max(10, Math.min(45, predictedTemp)));
  }

  // Determine trend
  const avgNext = predictions.nextHours.reduce((a, b) => a + b, 0) / predictions.nextHours.length;
  if (avgNext > currentTemp + 2) predictions.trend = 'warming';
  else if (avgNext < currentTemp - 2) predictions.trend = 'cooling';
  else predictions.trend = 'stable';

  return predictions;
};

module.exports = { getWeatherData };