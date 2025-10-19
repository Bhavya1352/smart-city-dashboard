'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WeatherCard from '@/components/WeatherCard';
import AirQualityCard from '@/components/AirQualityCard';
import TransportCard from '@/components/TransportCard';
import ChartCard from '@/components/ChartCard';
import MapCard from '@/components/MapCard';
import SmartInsights from '@/components/SmartInsights';
import HistoricalCharts from '@/components/HistoricalCharts';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';
import CityComparison from '@/components/CityComparison';
import LandingPage from '@/components/LandingPage';
import RainAlert from '@/components/RainAlert';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentCity, setCurrentCity] = useState('Delhi');
  const [showComparison, setShowComparison] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const fetchData = async (city: string) => {
    setLoading(true);
    try {
      const [weatherRes, airQualityRes, transportRes] = await Promise.all([
        fetch(`/api/weather?city=${city}`),
        fetch(`/api/airquality?city=${city}`),
        fetch(`/api/transport?city=${city}`)
      ]);

      const [weatherData, airQualityData, transportData] = await Promise.all([
        weatherRes.json(),
        airQualityRes.json(),
        transportRes.json()
      ]);

      setData({
        weather: weatherData.weather,
        airQuality: airQualityData.airQuality,
        transport: transportData.transport,
        weatherPredictions: weatherData.predictions,
        airQualityPredictions: airQualityData.predictions,
        transportPredictions: transportData.predictions,
        city: city,
        sources: {
          weather: weatherData.source,
          airQuality: airQualityData.source,
          transport: transportData.source,
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback mock data
      setData({
        city: city,
        weather: { temp: 28, humidity: 65, desc: 'Pleasant' },
        airQuality: { aqi: 95, pm25: 45, status: 'Moderate' },
        transport: { buses: 35, traffic: 'Moderate' },
        sources: { weather: 'mock', airQuality: 'mock', transport: 'mock' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentCity);
  }, [currentCity]);

  const handleCitySearch = (city: string) => {
    setCurrentCity(city);
  };

  if (showLanding) {
    return <LandingPage onEnterDashboard={() => setShowLanding(false)} />;
  }

 const isMockData = data?.sources && 
  Object.values(data.sources as Record<string, string>)
    .some(s => s?.toLowerCase().includes('mock'));


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative z-10">
        <Navbar 
          onCitySearch={handleCitySearch} 
          currentCity={currentCity}
          onShowComparison={() => setShowComparison(true)}
        />

        {isMockData && (
          <div className="bg-yellow-500 text-black p-4 text-center">
              You are currently viewing mock data. For real-time data, please add your API keys to a `.env` file in the `server` directory.
          </div>
        )}
        
        {/* Rain Alert */}
        <RainAlert weatherData={data} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <HeroSection currentCity={currentCity} />

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-6xl mb-4"
                >
                  🌍
                </motion.div>
                <p className="text-white text-xl">Loading city data...</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8 py-8">
              {/* Main Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <WeatherCard data={{ weather: data?.weather, weatherPredictions: data?.weatherPredictions }} />
                <AirQualityCard data={{ airQuality: data?.airQuality, airQualityPredictions: data?.airQualityPredictions }} />
                <TransportCard data={{ transport: data?.transport, transportPredictions: data?.transportPredictions }} />
              </div>

              {/* Predictive Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictiveAnalytics city={currentCity} data={data} />
                <HistoricalCharts city={currentCity} />
              </div>

              {/* Charts and Map */}
              <div className="grid grid-cols-1 gap-6">
                <MapCard city={currentCity} data={data} />
                <ChartCard data={data} />
              </div>

              {/* Smart Insights */}
              <SmartInsights city={currentCity} data={data} />

              {/* Quick Actions */}
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowComparison(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  🌆 Compare Cities
                </motion.button>
              </div>
            </div>
          )}
        </main>

        {/* City Comparison Modal */}
        <CityComparison 
          isOpen={showComparison} 
          onClose={() => setShowComparison(false)} 
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-20 py-8 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                animate={{
                  background: [
                    'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
                    'linear-gradient(45deg, #8b5cf6, #06b6d4, #3b82f6)',
                    'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="bg-gradient-to-r bg-clip-text text-transparent text-sm"
              >
                © 2024 Smart City Dashboard. Powered by real-time data APIs.
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}