'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

interface WeatherData {
  weather?: {
    temp: number;
    humidity: number;
    desc: string;
    icon?: string;
    windSpeed?: number;
    pressure?: number;
  };
  weatherPredictions?: {
    nextHours: number[];
    trend: string;
    confidence: number;
  };
  city?: string;
}

interface WeatherCardProps {
  data: WeatherData | null;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoaded(true);
    }
  }, [data]);

  const getWeatherIcon = (desc: string) => {
    const description = desc?.toLowerCase() || '';
    if (description.includes('clear')) return '☀️';
    if (description.includes('cloud')) return '☁️';
    if (description.includes('rain')) return '🌧️';
    if (description.includes('snow')) return '❄️';
    if (description.includes('haze') || description.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const currentTemp = data?.weather?.temp || 25;
  const tempTrend = {
    labels: ['6AM', '12PM', '6PM'],
    datasets: [{
      data: [
        Math.round(currentTemp - 6), // Morning cooler
        Math.round(currentTemp + 2), // Afternoon hotter  
        Math.round(currentTemp - 1)  // Evening moderate
      ],
      borderColor: 'rgba(59, 130, 246, 0.8)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      className="bg-gradient-to-br from-blue-400/20 to-cyan-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">Weather</h3>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-3xl filter drop-shadow-lg"
        >
          {data?.weather ? getWeatherIcon(data.weather.desc) : '🌤️'}
        </motion.div>
      </div>
      
      {data?.weather ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              {data.weather.temp}°C
            </motion.span>
            <span className="text-blue-200 capitalize text-sm">
              {data.weather.desc}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs text-blue-100">
            <div className="flex items-center space-x-1">
              <span>💧</span>
              <span>{data.weather.humidity}%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💨</span>
              <span>{data.weather.windSpeed || 12} km/h</span>
            </div>
          </div>
          
          <motion.div
            className="w-full bg-white/10 rounded-full h-2 overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${data.weather.humidity}%` }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.div>

          <div className="h-16 mt-4">
            <Line
              data={tempTrend}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { display: false },
                  y: { display: false }
                },
                elements: { line: { borderWidth: 2 } }
              }}
            />
          </div>

          {/* Prediction Analysis */}
          {data.weatherPredictions && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-semibold text-blue-200 mb-2 flex items-center">
                <span className="mr-2">🔮</span>
                6-Hour Forecast
              </h4>
              <div className="flex items-center justify-between text-xs text-blue-100 mb-2">
                <span>Trend: {data.weatherPredictions.trend === 'warming' ? '🌡️ Rising' :
                              data.weatherPredictions.trend === 'cooling' ? '❄️ Falling' : '📊 Stable'}</span>
                <span className="text-blue-300">{data.weatherPredictions.confidence}% confidence</span>
              </div>
              <div className="flex space-x-1">
                {data.weatherPredictions.nextHours.slice(0, 6).map((temp: number, index: number) => (
                  <div key={index} className="flex-1 text-center">
                    <div className="text-xs text-blue-200">{['1h', '2h', '3h', '4h', '5h', '6h'][index]}</div>
                    <div className="text-sm font-semibold text-white">{temp}°</div>
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
          <div className="h-2 bg-white/10 rounded shimmer"></div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;