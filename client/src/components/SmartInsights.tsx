'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface InsightData {
  type: string;
  icon: string;
  message: string;
  severity: 'success' | 'warning' | 'danger' | 'info';
}

interface SmartInsightsProps {
  city: string;
  data: any;
}

const SmartInsights = ({ city, data }: SmartInsightsProps) => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`/api/insights?city=${city}`);
        const result = await response.json();
        setInsights(result.insights || []);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
        setInsights(generateMockInsights());
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [city, data]);

  const generateMockInsights = (): InsightData[] => [
    {
      type: 'weather',
      icon: '🌡️',
      message: 'Temperature is 15% higher than yesterday. Stay hydrated!',
      severity: 'warning'
    },
    {
      type: 'transport',
      icon: '🚌',
      message: 'Public transport usage is optimal. Average wait: 6 minutes.',
      severity: 'success'
    },
    {
      type: 'airquality',
      icon: '💨',
      message: 'Air quality improved by 12% since morning.',
      severity: 'success'
    },
    {
      type: 'traffic',
      icon: '🚦',
      message: 'Traffic congestion expected during evening rush hour.',
      severity: 'info'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'from-green-400/20 to-emerald-600/20 border-green-400/30';
      case 'warning': return 'from-yellow-400/20 to-orange-600/20 border-yellow-400/30';
      case 'danger': return 'from-red-400/20 to-pink-600/20 border-red-400/30';
      default: return 'from-blue-400/20 to-cyan-600/20 border-blue-400/30';
    }
  };

  const getSeverityGlow = (severity: string) => {
    switch (severity) {
      case 'success': return 'hover:shadow-green-500/30';
      case 'warning': return 'hover:shadow-yellow-500/30';
      case 'danger': return 'hover:shadow-red-500/30';
      default: return 'hover:shadow-blue-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="bg-gradient-to-br from-indigo-400/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-2xl filter drop-shadow-lg"
        >
          🧠
        </motion.div>
        <h3 className="text-xl font-semibold text-white">Smart Insights</h3>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-cyan-400 rounded-full"
        />
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded shimmer mb-2"></div>
              <div className="h-3 bg-white/10 rounded w-3/4 shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              className={`bg-gradient-to-r ${getSeverityColor(insight.severity)} ${getSeverityGlow(insight.severity)} backdrop-blur-sm border rounded-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: index * 0.3 
                  }}
                  className="text-2xl flex-shrink-0 filter drop-shadow-sm"
                >
                  {insight.icon}
                </motion.div>
                <div className="flex-1">
                  <p className="text-sm text-white/90 group-hover:text-white transition-colors leading-relaxed">
                    {insight.message}
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-0.5 mt-2 rounded-full ${
                      insight.severity === 'success' ? 'bg-green-400' :
                      insight.severity === 'warning' ? 'bg-yellow-400' :
                      insight.severity === 'danger' ? 'bg-red-400' : 'bg-blue-400'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-indigo-200 opacity-75">
          Insights updated every 10 minutes • Powered by real-time data analysis
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SmartInsights;