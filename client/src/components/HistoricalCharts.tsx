'use client';

import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { useState } from 'react';

interface HistoricalChartsProps {
  city: string;
}

const HistoricalCharts = ({ city }: HistoricalChartsProps) => {
  const [activeTab, setActiveTab] = useState('temperature');

  // Generate mock historical data
  const generateData = (type: string) => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    let baseValue = type === 'temperature' ? 25 : type === 'aqi' ? 100 : 35;
    const data = days.map(() => {
      const variation = (Math.random() - 0.5) * 20;
      baseValue += variation * 0.1;
      return Math.max(0, Math.round(baseValue));
    });

    return { labels: days, data };
  };

  const getChartData = (type: string) => {
    const { labels, data } = generateData(type);
    
    const colors = {
      temperature: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      aqi: { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      transport: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
    };

    return {
      labels,
      datasets: [{
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data,
        borderColor: colors[type as keyof typeof colors].border,
        backgroundColor: colors[type as keyof typeof colors].bg,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)', maxTicksLimit: 6 },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const tabs = [
    { id: 'temperature', label: 'Temperature', icon: '🌡️' },
    { id: 'aqi', label: 'Air Quality', icon: '💨' },
    { id: 'transport', label: 'Transport', icon: '🚌' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">30-Day Trends</h3>
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="h-64"
      >
        <Line data={getChartData(activeTab)} options={chartOptions} />
      </motion.div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-400">Avg This Month</div>
          <div className="text-white font-semibold">
            {activeTab === 'temperature' ? '28°C' : activeTab === 'aqi' ? '95 AQI' : '42 Buses'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">Best Day</div>
          <div className="text-green-400 font-semibold">
            {activeTab === 'temperature' ? '22°C' : activeTab === 'aqi' ? '45 AQI' : '65 Buses'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">Trend</div>
          <div className="text-blue-400 font-semibold">
            {Math.random() > 0.5 ? '↗ Improving' : '↘ Declining'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoricalCharts;