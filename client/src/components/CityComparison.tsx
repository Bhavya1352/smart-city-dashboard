'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CityComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

const CityComparison = ({ isOpen, onClose }: CityComparisonProps) => {
  const [cities, setCities] = useState(['Delhi', 'Mumbai']);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const popularCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

  const fetchComparisonData = async () => {
    setLoading(true);
    const results: any = {};
    
    for (const city of cities) {
      try {
        const [weather, air, transport] = await Promise.all([
          fetch(`/api/weather?city=${city}`).then(r => r.json()),
          fetch(`/api/airquality?city=${city}`).then(r => r.json()),
          fetch(`/api/transport?city=${city}`).then(r => r.json())
        ]);
        results[city] = { ...weather, ...air, ...transport };
      } catch (error) {
        console.error(`Error fetching data for ${city}:`, error);
      }
    }
    
    setData(results);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchComparisonData();
  }, [isOpen, cities]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">City Comparison</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {cities.map((city, index) => (
                <select
                  key={index}
                  value={city}
                  onChange={(e) => {
                    const newCities = [...cities];
                    newCities[index] = e.target.value;
                    setCities(newCities);
                  }}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                >
                  {popularCities.map(c => (
                    <option key={c} value={c} className="bg-slate-800">{c}</option>
                  ))}
                </select>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin text-4xl mb-4">🌍</div>
                <p className="text-white">Comparing cities...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {cities.map((city, index) => (
                  <motion.div
                    key={city}
                    initial={{ x: index === 0 ? -50 : 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-white text-center">{city}</h3>
                    
                    {data[city] && (
                      <>
                        <div className="bg-blue-500/20 rounded-lg p-4">
                          <div className="text-sm text-blue-200">Temperature</div>
                          <div className="text-2xl font-bold text-white">
                            {data[city].weather?.temp}°C
                          </div>
                        </div>
                        
                        <div className="bg-purple-500/20 rounded-lg p-4">
                          <div className="text-sm text-purple-200">Air Quality</div>
                          <div className={`text-2xl font-bold ${getAQIColor(data[city].airQuality?.aqi)}`}>
                            {data[city].airQuality?.aqi} AQI
                          </div>
                        </div>
                        
                        <div className="bg-green-500/20 rounded-lg p-4">
                          <div className="text-sm text-green-200">Traffic</div>
                          <div className="text-lg font-bold text-white">
                            {data[city].transport?.traffic}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CityComparison;