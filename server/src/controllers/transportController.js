const axios = require('axios');
const NodeCache = require('node-cache');
const { pool } = require('../database/db');

// Cache for 5 minutes (transport data changes more frequently)
const cache = new NodeCache({ stdTTL: 300 });

const getTransportData = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  console.log(`\n🚌 Transport request for: ${city}`);

  const cacheKey = `transport_${city.toLowerCase()}`;

  try {
    // Try to get real traffic data from TomTom API or similar
    const API_KEY = process.env.TOMTOM_API_KEY || process.env.OPENWEATHER_API_KEY;

    // For now, we'll use enhanced mock data with more realistic patterns
    // In production, integrate with TomTom Traffic API or Google Maps API

    const cityTransport = {
      'delhi': { baseBuses: 45, baseMetro: 18, trafficLevel: 'High', congestionIndex: 85 },
      'mumbai': { baseBuses: 52, baseMetro: 22, trafficLevel: 'Very High', congestionIndex: 95 },
      'bangalore': { baseBuses: 38, baseMetro: 12, trafficLevel: 'High', congestionIndex: 78 },
      'chennai': { baseBuses: 35, baseMetro: 8, trafficLevel: 'Moderate', congestionIndex: 65 },
      'kolkata': { baseBuses: 42, baseMetro: 15, trafficLevel: 'High', congestionIndex: 82 },
      'hyderabad': { baseBuses: 32, baseMetro: 10, trafficLevel: 'Moderate', congestionIndex: 70 },
      'pune': { baseBuses: 28, baseMetro: 6, trafficLevel: 'Moderate', congestionIndex: 68 },
      'ahmedabad': { baseBuses: 25, baseMetro: 4, trafficLevel: 'Moderate', congestionIndex: 72 },
      'jaipur': { baseBuses: 22, baseMetro: 2, trafficLevel: 'Low', congestionIndex: 45 },
      'goa': { baseBuses: 15, baseMetro: 0, trafficLevel: 'Low', congestionIndex: 35 },
      'shimla': { baseBuses: 8, baseMetro: 0, trafficLevel: 'Low', congestionIndex: 25 },
      'manali': { baseBuses: 5, baseMetro: 0, trafficLevel: 'Low', congestionIndex: 20 }
    };

    const cityKey = city.toLowerCase().replace('.', '');
    const cityInfo = cityTransport[cityKey] || cityTransport['delhi'];

    // Time-based patterns with more sophisticated logic
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    const isNight = hour >= 22 || hour <= 5;

    let busMultiplier = 1;
    let trafficMultiplier = 1;
    let trafficLevel = cityInfo.trafficLevel;

    if (isNight) {
      busMultiplier = 0.3;
      trafficMultiplier = 0.2;
      trafficLevel = 'Very Low';
    } else if (isRushHour && !isWeekend) {
      busMultiplier = 1.6;
      trafficMultiplier = 1.8;
      trafficLevel = cityInfo.trafficLevel === 'Low' ? 'Moderate' :
                    cityInfo.trafficLevel === 'Moderate' ? 'High' : 'Very High';
    } else if (isWeekend) {
      busMultiplier = 0.8;
      trafficMultiplier = 0.6;
      trafficLevel = cityInfo.trafficLevel === 'Very High' ? 'High' :
                    cityInfo.trafficLevel === 'High' ? 'Moderate' : 'Low';
    }

    const finalBuses = Math.round(cityInfo.baseBuses * busMultiplier + Math.floor(Math.random() * 6 - 3));
    const finalCongestion = Math.round(cityInfo.congestionIndex * trafficMultiplier + Math.floor(Math.random() * 10 - 5));
    const avgWaitTime = isRushHour ? Math.floor(Math.random() * 12) + 8 :
                       isNight ? Math.floor(Math.random() * 20) + 15 :
                       Math.floor(Math.random() * 8) + 3;

    const transportData = {
      transport: {
        buses: Math.max(3, finalBuses),
        metro: Math.max(0, cityInfo.baseMetro + Math.floor(Math.random() * 4 - 2)),
        traffic: trafficLevel,
        congestionIndex: Math.max(0, Math.min(100, finalCongestion)),
        avgWaitTime: avgWaitTime,
        activeRoutes: Math.round(cityInfo.baseBuses * busMultiplier * 0.85),
        speedKmh: trafficLevel === 'Very High' ? Math.floor(Math.random() * 15) + 10 :
                 trafficLevel === 'High' ? Math.floor(Math.random() * 20) + 20 :
                 trafficLevel === 'Moderate' ? Math.floor(Math.random() * 25) + 30 :
                 Math.floor(Math.random() * 30) + 40
      },
      predictions: generateTransportPredictions(cityInfo, hour, isWeekend),
      source: '📊 Enhanced Transport Analytics',
      updatedAt: new Date().toISOString(),
    };

    console.log(`✅ SUCCESS! Transport for ${city}: ${transportData.transport.buses} buses, ${transportData.transport.traffic} traffic (${transportData.transport.congestionIndex}% congestion)`);
    cache.set(cacheKey, transportData);
    return res.json(transportData);

  } catch (err) {
    console.error(`❌ Transport Error for ${city}:`, err.message);

    const fallbackData = {
      transport: {
        buses: 35,
        metro: 12,
        traffic: 'Moderate',
        congestionIndex: 65,
        avgWaitTime: 6,
        activeRoutes: 28,
        speedKmh: 35
      },
      predictions: { nextHours: ['Moderate', 'High', 'Moderate'], trend: 'stable' },
      updatedAt: new Date().toISOString(),
    };

    res.json(fallbackData);
  }
};

const generateTransportPredictions = (cityInfo, currentHour, isWeekend) => {
  const predictions = {
    nextHours: [],
    trend: 'stable',
    confidence: 75
  };

  // Generate predictions for next 6 hours
  for (let i = 1; i <= 6; i++) {
    const futureHour = (currentHour + i) % 24;
    const isFutureRushHour = (futureHour >= 7 && futureHour <= 10) || (futureHour >= 17 && futureHour <= 20);
    const isFutureNight = futureHour >= 22 || futureHour <= 5;

    let predictedLevel = cityInfo.trafficLevel;

    if (isFutureNight) {
      predictedLevel = 'Very Low';
    } else if (isFutureRushHour && !isWeekend) {
      predictedLevel = cityInfo.trafficLevel === 'Low' ? 'Moderate' :
                      cityInfo.trafficLevel === 'Moderate' ? 'High' : 'Very High';
    } else if (isWeekend) {
      predictedLevel = cityInfo.trafficLevel === 'Very High' ? 'High' :
                      cityInfo.trafficLevel === 'High' ? 'Moderate' : 'Low';
    }

    predictions.nextHours.push(predictedLevel);
  }

  // Determine overall trend
  const rushHours = predictions.nextHours.filter(level => level === 'High' || level === 'Very High').length;
  const lowTraffic = predictions.nextHours.filter(level => level === 'Low' || level === 'Very Low').length;

  if (rushHours > lowTraffic + 2) predictions.trend = 'worsening';
  else if (lowTraffic > rushHours + 2) predictions.trend = 'improving';
  else predictions.trend = 'stable';

  return predictions;
};

module.exports = { getTransportData };