'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PredictiveAnalyticsProps {
  city: string;
  data: any;
}

const PredictiveAnalytics = ({ city, data }: PredictiveAnalyticsProps) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    generateRecommendations();
  }, [city, data]);

  const generateRecommendations = () => {
    const hour = new Date().getHours();
    const aqi = data?.airQuality?.aqi || 100;
    const temp = data?.weather?.temp || 25;
    const traffic = data?.transport?.traffic || 'Moderate';

    const recs = [];

    // Best time to go out
    if (aqi <= 50) {
      recs.push({
        type: 'outdoor',
        icon: '🌱',
        title: 'Perfect for Outdoor Activities',
        message: 'Air quality is excellent. Great time for jogging or cycling!',
        time: 'Now',
        confidence: 95
      });
    } else if (aqi > 150) {
      recs.push({
        type: 'indoor',
        icon: '🏠',
        title: 'Stay Indoors',
        message: 'Air quality is poor. Consider indoor activities.',
        time: 'Until evening',
        confidence: 90
      });
    }

    // Traffic predictions
    if (hour >= 7 && hour <= 9) {
      recs.push({
        type: 'transport',
        icon: '🚌',
        title: 'Use Public Transport',
        message: 'Morning rush hour. Public transport is faster.',
        time: '7-10 AM',
        confidence: 85
      });
    } else if (hour >= 17 && hour <= 19) {
      recs.push({
        type: 'transport',
        icon: '🚗',
        title: 'Avoid Main Roads',
        message: 'Evening rush hour. Consider alternative routes.',
        time: '5-8 PM',
        confidence: 80
      });
    }

    // Weather-based recommendations
    if (temp > 35) {
      recs.push({
        type: 'weather',
        icon: '🌡️',
        title: 'Stay Hydrated',
        message: 'High temperature. Avoid outdoor activities 12-4 PM.',
        time: 'Afternoon',
        confidence: 88
      });
    }

    // Best commute time
    const bestHours = hour < 7 || (hour > 10 && hour < 17) || hour > 20;
    if (bestHours) {
      recs.push({
        type: 'commute',
        icon: '⏰',
        title: 'Optimal Travel Time',
        message: 'Low traffic and good air quality for commuting.',
        time: 'Now',
        confidence: 92
      });
    }

    setRecommendations(recs.slice(0, 3));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="bg-gradient-to-br from-cyan-400/20 to-blue-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-2xl"
        >
          🔮
        </motion.div>
        <h3 className="text-xl font-semibold text-white">Predictive Analytics</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                className="text-2xl flex-shrink-0"
              >
                {rec.icon}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white text-sm">{rec.title}</h4>
                  <span className={`text-xs ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence}% confident
                  </span>
                </div>
                
                <p className="text-cyan-100 text-sm mb-2">{rec.message}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyan-200 bg-white/10 px-2 py-1 rounded">
                    {rec.time}
                  </span>
                  
                  <motion.div
                    className="w-16 h-1 bg-white/20 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '4rem' }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.confidence}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center text-xs text-cyan-200 opacity-75"
      >
        Predictions based on historical data and current conditions
      </motion.div>
    </motion.div>
  );
};

export default PredictiveAnalytics;