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

  console.log(`\n🌍 Weather request for: ${city}`);
  console.log(`🔍 City key: ${city.toLowerCase().replace('.', '')}`);
  
  const cacheKey = `weather_${city.toLowerCase()}`;
  
  try {
    // Enhanced city-specific realistic data
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

    const cityKey = city.toLowerCase().replace('.', '');
    const cityInfo = cityData[cityKey] || cityData['delhi'];
    
    // Add time-based variation
    const hour = new Date().getHours();
    const timeVariation = hour < 6 ? -5 : hour < 12 ? 0 : hour < 18 ? 3 : -2;
    
    // Add random daily variation
    const dailyVariation = Math.sin(Date.now() / (1000 * 60 * 60 * 24)) * 3;
    
    const mockData = {
      city,
      weather: {
        temp: Math.round(cityInfo.baseTemp + timeVariation + dailyVariation + Math.floor(Math.random() * 3 - 1)),
        humidity: Math.max(20, Math.min(95, cityInfo.humidity + Math.floor(Math.random() * 8 - 4))),
        desc: cityInfo.desc,
        icon: cityInfo.icon,
        windSpeed: Math.floor(Math.random() * 12) + 3,
        pressure: 1013 + Math.floor(Math.random() * 15 - 7)
      },
      source: '📝 Realistic City Data',
      updatedAt: new Date().toISOString(),
    };

    console.log(`✅ SUCCESS! Mock data for ${city}:`);
    console.log(`   🌡️ Temperature: ${mockData.weather.temp}°C`);
    console.log(`   📝 Description: ${mockData.weather.desc}`);
    console.log(`   📊 Base temp: ${cityInfo.baseTemp}°C`);
    console.log(`   ⏰ Time variation: ${timeVariation}`);
    
    // Don't cache for testing - fresh data every time
    // cache.set(cacheKey, mockData);
    return res.json(mockData);

  } catch (err) {
    console.error(`❌ Error for ${city}:`, err.message);
    
    // Fallback data
    const fallbackData = {
      city,
      weather: { temp: 25, humidity: 65, desc: 'Partly cloudy', icon: '02d' },
      updatedAt: new Date().toISOString(),
    };
    
    res.json(fallbackData);
  }
};

module.exports = { getWeatherData };