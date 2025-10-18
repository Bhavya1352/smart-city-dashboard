'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface MapCardProps {
  city: string;
  data: any;
}

const MapCard = ({ city, data }: MapCardProps) => {
  const [isClient, setIsClient] = useState(false);
  const [cityCoords, setCityCoords] = useState<[number, number]>([28.6139, 77.2090]);

  useEffect(() => {
    setIsClient(true);
    const coords: { [key: string]: [number, number] } = {
      'Delhi': [28.6139, 77.2090],
      'Mumbai': [19.0760, 72.8777],
      'Bangalore': [12.9716, 77.5946],
      'Chennai': [13.0827, 80.2707],
      'Kolkata': [22.5726, 88.3639],
      'Hyderabad': [17.3850, 78.4867],
      'Pune': [18.5204, 73.8567],
      'Ahmedabad': [23.0225, 72.5714],
      'Jaipur': [26.9124, 75.7873],
      'Goa': [15.2993, 74.1240],
      'Shimla': [31.1048, 77.1734],
      'Manali': [32.2396, 77.1887]
    };
    const searchedCity = city.toLowerCase().replace('.', '');
    const foundCoords = Object.keys(coords).find(key => 
      key.toLowerCase() === searchedCity
    );
    setCityCoords(foundCoords ? coords[foundCoords] : coords['Delhi']);
    console.log(`🗺️ Map centered on ${city}: [${foundCoords ? coords[foundCoords] : coords['Delhi']}]`);
  }, [city]);

  const busStops = [
    { id: 1, position: [cityCoords[0] + 0.01, cityCoords[1] + 0.01], name: `${city} Central Station`, type: 'bus' },
    { id: 2, position: [cityCoords[0] - 0.01, cityCoords[1] + 0.02], name: `${city} Metro Hub`, type: 'metro' },
    { id: 3, position: [cityCoords[0] + 0.02, cityCoords[1] - 0.01], name: `${city} Airport`, type: 'airport' },
    { id: 4, position: [cityCoords[0] - 0.015, cityCoords[1] - 0.015], name: `${city} Main Road`, type: 'traffic' },
  ];

  if (!isClient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-br from-emerald-400/20 to-teal-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl col-span-full"
      >
        <div className="h-80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-4xl"
          >
            🗺️
          </motion.div>
          <span className="ml-3 text-white">Loading interactive map...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      whileHover={{ scale: 1.01, y: -5 }}
      className="bg-gradient-to-br from-emerald-400/20 to-teal-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 col-span-full group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors">
          City Map - {city}
        </h3>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-2xl filter drop-shadow-lg"
        >
          🗺️
        </motion.div>
      </div>
      
      <motion.div 
        className="h-80 rounded-xl overflow-hidden relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <MapContainer
          key={city}
          center={cityCoords}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          className="rounded-xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {busStops.map((stop, index) => (
            <Marker key={stop.id} position={stop.position as [number, number]}>
              <Popup className="custom-popup">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-2"
                >
                  <div className="text-2xl mb-2">
                    {stop.type === 'bus' ? '🚌' : 
                     stop.type === 'metro' ? '🚇' : 
                     stop.type === 'airport' ? '✈️' : '🚦'}
                  </div>
                  <strong className="text-slate-800">{stop.name}</strong>
                  <br />
                  <span className="text-sm text-slate-600">
                    {stop.type === 'traffic' ? 'Heavy congestion' : 
                     `Active: ${Math.floor(Math.random() * 15) + 5}`}
                  </span>
                </motion.div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Pulsing overlay indicators */}
        <div className="absolute top-4 right-4 space-y-2">
          {['🚌', '🚇', '✈️', '🚦'].map((icon, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.5 
              }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-lg"
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-4 grid grid-cols-4 gap-4 text-sm text-emerald-100"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
        >
          <div className="text-lg font-bold">🚌</div>
          <div>Bus Stops</div>
          <div className="text-xs opacity-75">{data?.transport?.buses || 35} active</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
        >
          <div className="text-lg font-bold">🚇</div>
          <div>Metro</div>
          <div className="text-xs opacity-75">12 stations</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
        >
          <div className="text-lg font-bold">✈️</div>
          <div>Airport</div>
          <div className="text-xs opacity-75">Connected</div>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
        >
          <div className="text-lg font-bold">🚦</div>
          <div>Traffic</div>
          <div className="text-xs opacity-75">{data?.transport?.traffic || 'Moderate'}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MapCard;