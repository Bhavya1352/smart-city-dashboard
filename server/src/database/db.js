
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/smartcity',
  });
} catch (err) {
  console.log('Database not available');
  pool = null;
}

const createTables = async () => {
  if (!pool) {
    throw new Error('Database not available');
  }
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS city_cache (
        id SERIAL PRIMARY KEY,
        city_name VARCHAR(100) UNIQUE,
        data JSONB,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        favorite_city VARCHAR(100) DEFAULT 'Delhi',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT UNIQUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_city_cache_name ON city_cache(city_name);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
    `);
    console.log('✅ Database tables created successfully');
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
  } finally {
    client.release();
  }
};

// Test database connection
const testConnection = async () => {
  if (!pool) {
    console.log('⚠️  Database not configured - running in demo mode');
    return;
  }
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful');
  } catch (err) {
    console.log('⚠️  Database connection failed - using mock data');
    console.log('💡 Install PostgreSQL for full features');
  }
};

module.exports = { pool, createTables, testConnection };

