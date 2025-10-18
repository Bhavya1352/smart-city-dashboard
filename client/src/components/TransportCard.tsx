'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TransportData {
  transport?: {
    buses: number;
    traffic: string;
    metro?: number;
  };
}

interface TransportCardProps {
  data: TransportData | null;
}

const TransportCard = ({ data }: TransportCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoaded(true);
    }
  }, [data]);

  const getTrafficColor = (traffic: string) => {
    switch (traffic?.toLowerCase()) {
      case 'low': return 'from-green-400 to-green-600';
      case 'moderate': return 'from-yellow-400 to-yellow-600';
      case 'high': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTrafficIcon = (traffic: string) => {
    switch (traffic?.toLowerCase()) {
      case 'low': return '🟢';
      case 'moderate': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-green-400/20 to-teal-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Transport</h3>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl"
        >
          🚌
        </motion.div>
      </div>
      
      {data?.transport ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚍</span>
              <div>
                <div className="text-2xl font-bold text-white">
                  {data.transport.buses}
                </div>
                <div className="text-xs text-green-200">Active Buses</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span>{getTrafficIcon(data.transport.traffic)}</span>
                <span className="text-green-200 text-sm capitalize">
                  {data.transport.traffic} Traffic
                </span>
              </div>
            </div>
          </div>
          
          <motion.div
            className="w-full bg-white/10 rounded-full h-3 overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${getTrafficColor(data.transport.traffic)}`}
              initial={{ width: 0 }}
              animate={{ 
                width: data.transport.traffic?.toLowerCase() === 'low' ? '30%' : 
                       data.transport.traffic?.toLowerCase() === 'moderate' ? '60%' : '90%' 
              }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span>🚇</span>
              <span className="text-green-100">Metro: Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚕</span>
              <span className="text-green-100">Taxi: Active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/10 rounded"></div>
        </div>
      )}
    </motion.div>
  );
};

export default TransportCard;