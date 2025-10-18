'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RainAlertProps {
  weatherData: any;
}

const RainAlert = ({ weatherData }: RainAlertProps) => {
  const [showRainAlert, setShowRainAlert] = useState(false);

  useEffect(() => {
    // Check if weather description contains rain
    const desc = weatherData?.weather?.desc?.toLowerCase() || '';
    const isRaining = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower');
    
    setShowRainAlert(isRaining);
  }, [weatherData]);

  if (!showRainAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-blue-600/90 backdrop-blur-md border border-blue-400/50 rounded-2xl p-6 shadow-2xl max-w-md"
        >
          <div className="flex items-center space-x-4">
            {/* Rain GIF */}
            <div className="relative">
              <motion.div
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl"
              >
                🌧️
              </motion.div>
              
              {/* Animated Rain Drops */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, 40, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="absolute w-1 h-4 bg-blue-300 rounded-full"
                  style={{
                    left: `${10 + i * 8}px`,
                    top: '10px',
                  }}
                />
              ))}
            </div>

            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">
                🚨 Rain Alert!
              </h3>
              <p className="text-blue-100 text-sm mb-3">
                It's raining in {weatherData?.city}. Take an umbrella! ☂️
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-blue-200">
                <span>💧 {weatherData?.weather?.humidity}% Humidity</span>
                <span>🌡️ {weatherData?.weather?.temp}°C</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowRainAlert(false)}
              className="text-white/70 hover:text-white text-xl"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RainAlert;