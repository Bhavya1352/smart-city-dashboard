const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Try to initialize database (optional)
try {
  const { createTables } = require('./src/database/db');
  createTables().catch(err => {
    console.log('⚠️  Database not available - using mock data only');
    console.log('💡 Install PostgreSQL for full features');
  });
} catch (err) {
  console.log('⚠️  Database not configured - running in demo mode');
}

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const weatherRoutes = require('./src/routes/weatherRoutes');
const airQualityRoutes = require('./src/routes/airQualityRoutes');
const transportRoutes = require('./src/routes/transportRoutes');
const insightsRoutes = require('./src/routes/insightsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const alertsRoutes = require('./src/routes/alertsRoutes');

app.use('/api', weatherRoutes);
app.use('/api', airQualityRoutes);
app.use('/api', transportRoutes);
app.use('/api', insightsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', alertsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart City Dashboard API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📊 Dashboard API available at http://localhost:${port}`);
  console.log(`🌐 Frontend will be at http://localhost:3000`);
  console.log(`\n✅ Ready! Database errors are normal in demo mode.`);
});