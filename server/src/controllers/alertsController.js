const { pool } = require('../database/db');

const createAlert = async (req, res) => {
  const { city, alertType, thresholdValue, condition } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO alerts (user_id, city, alert_type, threshold_value, condition) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, city, alertType, thresholdValue, condition]
    );

    res.status(201).json({
      message: 'Alert created successfully',
      alert: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating alert:', err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

const getUserAlerts = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM alerts WHERE user_id = $1 AND is_active = true ORDER BY created_at DESC',
      [userId]
    );

    res.json({ alerts: result.rows });
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

const checkAlerts = async (cityData) => {
  try {
    const alerts = await pool.query(
      'SELECT a.*, u.email FROM alerts a JOIN users u ON a.user_id = u.id WHERE a.city = $1 AND a.is_active = true',
      [cityData.city.toLowerCase()]
    );

    const triggeredAlerts = [];

    for (const alert of alerts.rows) {
      let currentValue;
      
      switch (alert.alert_type) {
        case 'aqi':
          currentValue = cityData.airQuality?.aqi;
          break;
        case 'temperature':
          currentValue = cityData.weather?.temp;
          break;
        default:
          continue;
      }

      if (!currentValue) continue;

      const shouldTrigger = alert.condition === 'above' 
        ? currentValue > alert.threshold_value
        : currentValue < alert.threshold_value;

      if (shouldTrigger) {
        triggeredAlerts.push({
          ...alert,
          currentValue,
          message: `${alert.alert_type} is ${currentValue} (threshold: ${alert.threshold_value})`
        });
      }
    }

    return triggeredAlerts;
  } catch (err) {
    console.error('Error checking alerts:', err);
    return [];
  }
};

module.exports = {
  createAlert,
  getUserAlerts,
  checkAlerts
};