'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AirQualityData {
  airQuality?: {
    aqi: number;
    pm25: number;
    pm10?: number;
    status: string;
    no2?: number;
    so2?: number;
    co?: number;
    o3?: number;
  };
  airQualityPredictions?: {
    nextHours: number[];
    trend: string;
    confidence: number;
  };
}

interface AirQualityCardProps {
  data: AirQualityData | null;
}

const AirQualityCard = ({ data }: AirQualityCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoaded(true);
    }
  }, [data]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'from-green-400 to-green-600';
    if (aqi <= 100) return 'from-yellow-400 to-yellow-600';
    if (aqi <= 150) return 'from-orange-400 to-orange-600';
    if (aqi <= 200) return 'from-red-400 to-red-600';
    return 'from-purple-400 to-purple-600';
  };

  const getAQIIcon = (aqi: number) => {
    if (aqi <= 50) return '🌱';
    if (aqi <= 100) return '😐';
    if (aqi <= 150) return '😷';
    if (aqi <= 200) return '🚨';
    return '☠️';
  };

  const getGlowColor = (aqi: number) => {
    if (aqi <= 50) return 'hover:shadow-green-500/30';
    if (aqi <= 100) return 'hover:shadow-yellow-500/30';
    if (aqi <= 150) return 'hover:shadow-orange-500/30';
    if (aqi <= 200) return 'hover:shadow-red-500/30';
    return 'hover:shadow-purple-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      whileHover={{ scale: 1.02, y: -8 }}
      className={`bg-gradient-to-br from-purple-400/20 to-pink-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group ${data?.airQuality ? getGlowColor(data.airQuality.aqi) : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">Air Quality</h3>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-3xl filter drop-shadow-lg"
        >
          {data?.airQuality ? getAQIIcon(data.airQuality.aqi) : '🌱'}
        </motion.div>
      </div>
      
      {data?.airQuality ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.span 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className={`text-3xl sm:text-4xl font-bold ${
                data.airQuality.aqi <= 50 ? 'text-green-400' :
                data.airQuality.aqi <= 100 ? 'text-yellow-400' :
                data.airQuality.aqi <= 150 ? 'text-orange-400' :
                data.airQuality.aqi <= 200 ? 'text-red-400' : 'text-purple-400'
              }`}
            >
              {data.airQuality.aqi}
            </motion.span>
            <div className="text-right">
              <span className="text-purple-200 text-sm block">
                {data.airQuality.status}
              </span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-3 h-3 rounded-full mt-1 ml-auto ${
                  data.airQuality.aqi <= 50 ? 'bg-green-400' :
                  data.airQuality.aqi <= 100 ? 'bg-yellow-400' :
                  data.airQuality.aqi <= 150 ? 'bg-orange-400' :
                  data.airQuality.aqi <= 200 ? 'bg-red-400' : 'bg-purple-400'
                }`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm text-purple-100">
              <div>
                <span>PM2.5: {data.airQuality.pm25} μg/m³</span>
              </div>
              <div>
                <span>PM10: {data.airQuality.pm10 || Math.round(data.airQuality.pm25 * 1.3)} μg/m³</span>
              </div>
            </div>

            <motion.div
              className="w-full bg-white/10 rounded-full h-3 overflow-hidden relative"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className={`h-full bg-gradient-to-r ${getAQIColor(data.airQuality.aqi)} relative`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((data.airQuality.aqi / 300) * 100, 100)}%` }}
                transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </motion.div>
          </div>

          <div className="text-xs text-purple-200 opacity-75">
            AQI Scale: 0-50 Good, 51-100 Moderate, 101-150 Unhealthy for Sensitive Groups
          </div>

          {/* Prediction Analysis */}
          {data.airQualityPredictions && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-semibold text-purple-200 mb-2 flex items-center">
                <span className="mr-2">🔮</span>
                6-Hour AQI Forecast
              </h4>
              <div className="flex items-center justify-between text-xs text-purple-100 mb-2">
                <span>Trend: {data.airQualityPredictions.trend === 'worsening' ? '📈 Worsening' :
                              data.airQualityPredictions.trend === 'improving' ? '📉 Improving' : '📊 Stable'}</span>
                <span className="text-purple-300">{data.airQualityPredictions.confidence}% confidence</span>
              </div>
              <div className="flex space-x-1">
                {data.airQualityPredictions.nextHours.slice(0, 6).map((aqi: number, index: number) => (
                  <div key={index} className="flex-1 text-center">
                    <div className="text-xs text-purple-200">{['1h', '2h', '3h', '4h', '5h', '6h'][index]}</div>
                    <div className={`text-sm font-semibold ${
                      aqi <= 50 ? 'text-green-400' :
                      aqi <= 100 ? 'text-yellow-400' :
                      aqi <= 150 ? 'text-orange-400' :
                      aqi <= 200 ? 'text-red-400' : 'text-purple-400'
                    }`}>{aqi}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-white/10 rounded shimmer"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 shimmer"></div>
          <div className="h-3 bg-white/10 rounded shimmer"></div>
        </div>
      )}
    </motion.div>
  );
};

export default AirQualityCard;