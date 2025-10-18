-- Enhanced database schema for Smart City Dashboard

-- Existing tables (already created in db.js)
-- city_cache, users, user_sessions

-- New tables for enhanced features

-- User alerts and notifications
CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city VARCHAR(100) NOT NULL,
  alert_type VARCHAR(50) NOT NULL, -- 'aqi', 'temperature', 'traffic'
  threshold_value INTEGER NOT NULL,
  condition VARCHAR(10) NOT NULL, -- 'above', 'below'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history for analytics
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  city VARCHAR(100) NOT NULL,
  search_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address INET,
  user_agent TEXT
);

-- Historical city statistics
CREATE TABLE IF NOT EXISTS city_stats (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  avg_temp DECIMAL(5,2),
  avg_aqi INTEGER,
  avg_humidity INTEGER,
  traffic_level VARCHAR(20),
  transport_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(city, date)
);

-- User favorite cities (multiple)
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city VARCHAR(100) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, city)
);

-- Community reports and feedback
CREATE TABLE IF NOT EXISTS community_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  city VARCHAR(100) NOT NULL,
  report_type VARCHAR(50) NOT NULL, -- 'air_quality', 'traffic', 'weather'
  description TEXT,
  severity INTEGER CHECK (severity BETWEEN 1 AND 5),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User activity tracking for gamification
CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'search', 'report', 'login'
  points INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API usage tracking for rate limiting
CREATE TABLE IF NOT EXISTS api_usage (
  id SERIAL PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_city ON alerts(user_id, city);
CREATE INDEX IF NOT EXISTS idx_search_history_city ON search_history(city);
CREATE INDEX IF NOT EXISTS idx_city_stats_city_date ON city_stats(city, date);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_city ON community_reports(city);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_api_usage_ip_window ON api_usage(ip_address, window_start);