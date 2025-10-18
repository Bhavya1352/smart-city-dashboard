const express = require('express');
const router = express.Router();

let pool;
try {
  pool = require('../database/db').pool;
} catch (err) {
  console.log('Database not available for insights');
  pool = null;
}

const getInsights = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    let result = { rows: [] };
    
    // Try to get data from database if available
    if (pool) {
      try {
        result = await pool.query(
          'SELECT data, updated_at FROM city_cache WHERE city_name = $1 ORDER BY updated_at DESC LIMIT 2',
          [city.toLowerCase()]
        );
      } catch (dbErr) {
        console.log('Database not available for insights, using mock insights');
      }
    }

    const insights = [];
    
    if (result.rows.length > 0) {
      const currentData = result.rows[0].data;
      const previousData = result.rows[1]?.data;

      // Weather insights
      if (currentData.weather) {
        const temp = currentData.weather.weather.temp;
        if (temp > 30) {
          insights.push({
            type: 'weather',
            icon: '🌡️',
            message: `High temperature of ${temp}°C. Stay hydrated and avoid outdoor activities during peak hours.`,
            severity: 'warning'
          });
        } else if (temp < 15) {
          insights.push({
            type: 'weather',
            icon: '🧥',
            message: `Cool temperature of ${temp}°C. Consider wearing warm clothing.`,
            severity: 'info'
          });
        }

        if (currentData.weather.weather.humidity > 80) {
          insights.push({
            type: 'weather',
            icon: '💧',
            message: `High humidity at ${currentData.weather.weather.humidity}%. Expect muggy conditions.`,
            severity: 'info'
          });
        }
      }

      // Air quality insights
      if (currentData.airQuality) {
        const aqi = currentData.airQuality.airQuality.aqi;
        if (aqi > 150) {
          insights.push({
            type: 'airquality',
            icon: '😷',
            message: `Poor air quality (AQI: ${aqi}). Limit outdoor activities and consider wearing a mask.`,
            severity: 'danger'
          });
        } else if (aqi > 100) {
          insights.push({
            type: 'airquality',
            icon: '⚠️',
            message: `Moderate air quality (AQI: ${aqi}). Sensitive individuals should limit prolonged outdoor exertion.`,
            severity: 'warning'
          });
        } else if (aqi <= 50) {
          insights.push({
            type: 'airquality',
            icon: '🌱',
            message: `Excellent air quality (AQI: ${aqi}). Perfect conditions for outdoor activities!`,
            severity: 'success'
          });
        }

        // Compare with previous data if available
        if (previousData?.airQuality) {
          const prevAQI = previousData.airQuality.airQuality.aqi;
          const change = ((aqi - prevAQI) / prevAQI * 100).toFixed(1);
          if (Math.abs(change) > 10) {
            insights.push({
              type: 'airquality',
              icon: change > 0 ? '📈' : '📉',
              message: `Air quality ${change > 0 ? 'worsened' : 'improved'} by ${Math.abs(change)}% since last update.`,
              severity: change > 0 ? 'warning' : 'success'
            });
          }
        }
      }

      // Transport insights
      if (currentData.transport) {
        const traffic = currentData.transport.transport.traffic;
        const buses = currentData.transport.transport.buses;
        const waitTime = currentData.transport.transport.avgWaitTime;

        if (traffic === 'High') {
          insights.push({
            type: 'transport',
            icon: '🚦',
            message: `Heavy traffic conditions. Consider using public transport or alternative routes.`,
            severity: 'warning'
          });
        } else if (traffic === 'Low') {
          insights.push({
            type: 'transport',
            icon: '🛣️',
            message: `Light traffic conditions. Great time for travel!`,
            severity: 'success'
          });
        }

        if (waitTime <= 5) {
          insights.push({
            type: 'transport',
            icon: '🚌',
            message: `Excellent public transport service with average wait time of ${waitTime} minutes.`,
            severity: 'success'
          });
        } else if (waitTime > 10) {
          insights.push({
            type: 'transport',
            icon: '⏰',
            message: `Longer wait times for public transport (${waitTime} minutes). Plan accordingly.`,
            severity: 'warning'
          });
        }
      }

      // Time-based insights
      const hour = new Date().getHours();
      if (hour >= 6 && hour <= 9) {
        insights.push({
          type: 'general',
          icon: '🌅',
          message: 'Morning rush hour. Public transport frequency is increased.',
          severity: 'info'
        });
      } else if (hour >= 17 && hour <= 20) {
        insights.push({
          type: 'general',
          icon: '🌆',
          message: 'Evening rush hour. Expect higher traffic and crowded public transport.',
          severity: 'info'
        });
      } else if (hour >= 22 || hour <= 5) {
        insights.push({
          type: 'general',
          icon: '🌙',
          message: 'Late night hours. Limited public transport services available.',
          severity: 'info'
        });
      }
    }

    // Default insights if no data available
    if (insights.length === 0) {
      insights.push(
        {
          type: 'general',
          icon: '📊',
          message: 'Gathering city data to provide personalized insights.',
          severity: 'info'
        },
        {
          type: 'general',
          icon: '🏙️',
          message: 'Welcome to the Smart City Dashboard! Real-time data will be available shortly.',
          severity: 'info'
        }
      );
    }

    res.json({
      city,
      insights,
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Error generating insights:', err.message);
    
    // Return basic insights even if database fails
    const basicInsights = [
      {
        type: 'general',
        icon: '🏙️',
        message: `Welcome to ${city} dashboard! Real-time data is being processed.`,
        severity: 'info'
      },
      {
        type: 'weather',
        icon: '🌤️',
        message: 'Weather conditions are being monitored for optimal recommendations.',
        severity: 'info'
      }
    ];
    
    res.json({
      city,
      insights: basicInsights,
      generatedAt: new Date().toISOString()
    });
  }
};

router.get('/insights', getInsights);

module.exports = router;