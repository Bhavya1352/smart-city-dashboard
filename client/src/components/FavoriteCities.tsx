'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FavoriteCitiesProps {
  onCitySelect: (city: string) => void;
  currentCity: string;
}

const FavoriteCities = ({ onCitySelect, currentCity }: FavoriteCitiesProps) => {
  const [favorites, setFavorites] = useState(['Delhi', 'Mumbai', 'Bangalore']);
  const [showDropdown, setShowDropdown] = useState(false);

  const addToFavorites = () => {
    if (!favorites.includes(currentCity)) {
      setFavorites([...favorites, currentCity]);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        ⭐
      </motion.button>

      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-xl p-3 min-w-48 z-50"
        >
          <div className="text-xs text-gray-400 mb-2">Favorite Cities</div>
          {favorites.map((city) => (
            <button
              key={city}
              onClick={() => {
                onCitySelect(city);
                setShowDropdown(false);
              }}
              className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
            >
              🏙️ {city}
            </button>
          ))}
          <hr className="border-white/20 my-2" />
          <button
            onClick={() => {
              addToFavorites();
              setShowDropdown(false);
            }}
            className="w-full text-left px-3 py-2 text-cyan-400 hover:bg-white/10 rounded-lg transition-all text-sm"
          >
            + Add {currentCity}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FavoriteCities;