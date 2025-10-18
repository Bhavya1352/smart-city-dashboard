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
    // City-specific transport patterns
    const cityTransport = {
      'delhi': { baseBuses: 45, baseMetro: 18, trafficLevel: 'High' },
      'mumbai': { baseBuses: 52, baseMetro: 22, trafficLevel: 'Very High' },
      'bangalore': { baseBuses: 38, baseMetro: 12, trafficLevel: 'High' },
      'chennai': { baseBuses: 35, baseMetro: 8, trafficLevel: 'Moderate' },
      'kolkata': { baseBuses: 42, baseMetro: 15, trafficLevel: 'High' },
      'hyderabad': { baseBuses: 32, baseMetro: 10, trafficLevel: 'Moderate' },
      'pune': { baseBuses: 28, baseMetro: 6, trafficLevel: 'Moderate' },
      'ahmedabad': { baseBuses: 25, baseMetro: 4, trafficLevel: 'Moderate' },
      'jaipur': { baseBuses: 22, baseMetro: 2, trafficLevel: 'Low' },
      'goa': { baseBuses: 15, baseMetro: 0, trafficLevel: 'Low' },
      'shimla': { baseBuses: 8, baseMetro: 0, trafficLevel: 'Low' },
      'manali': { baseBuses: 5, baseMetro: 0, trafficLevel: 'Low' }
    };

    const cityKey = city.toLowerCase().replace('.', '');
    const cityInfo = cityTransport[cityKey] || cityTransport['delhi'];
    
    // Time-based patterns
    const hour = new Date().getHours();
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    
    let busMultiplier = 1;
    let trafficLevel = cityInfo.trafficLevel;
    
    if (isRushHour && !isWeekend) {
      busMultiplier = 1.4;
      trafficLevel = cityInfo.trafficLevel === 'Low' ? 'Moderate' : 
                   cityInfo.trafficLevel === 'Moderate' ? 'High' : 'Very High';
    } else if (isWeekend) {
      busMultiplier = 0.7;
      trafficLevel = cityInfo.trafficLevel === 'Very High' ? 'High' :
                   cityInfo.trafficLevel === 'High' ? 'Moderate' : 'Low';
    }
    
    const finalBuses = Math.round(cityInfo.baseBuses * busMultiplier + Math.floor(Math.random() * 8 - 4));
    const avgWaitTime = isRushHour ? Math.floor(Math.random() * 8) + 8 : Math.floor(Math.random() * 5) + 3;
    
    const transportData = {
      transport: {
        buses: Math.max(5, finalBuses),
        metro: cityInfo.baseMetro + Math.floor(Math.random() * 4 - 2),
        traffic: trafficLevel,
        avgWaitTime: avgWaitTime,
        activeRoutes: Math.round(cityInfo.baseBuses * 0.8)
      },
      updatedAt: new Date().toISOString(),
    };

    console.log(`✅ SUCCESS! Transport for ${city}: ${transportData.transport.buses} buses, ${transportData.transport.traffic} traffic`);
    console.log(`   📊 Base buses: ${cityInfo.baseBuses}, Rush hour: ${isRushHour}`);

    return res.json(transportData);

  } catch (err) {
    console.error(`❌ Transport Error for ${city}:`, err.message);
    
    const fallbackData = {
      transport: { 
        buses: 35, 
        metro: 12, 
        traffic: 'Moderate',
        avgWaitTime: 6,
        activeRoutes: 28
      },
      updatedAt: new Date().toISOString(),
    };
    
    res.json(fallbackData);
  }
};

module.exports = { getTransportData };