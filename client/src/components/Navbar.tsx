'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import VoiceSearch from './VoiceSearch';
import ThemeToggle from './ThemeToggle';
import FavoriteCities from './FavoriteCities';
import SettingsMenu from './SettingsMenu';

interface NavbarProps {
  onCitySearch: (city: string) => void;
  currentCity: string;
  onShowComparison: () => void;
}

const Navbar = ({ onCitySearch, currentCity, onShowComparison }: NavbarProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const popularCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur'
  ];

  const filteredCities = popularCities.filter(city => 
    city.toLowerCase().includes(searchInput.toLowerCase()) && 
    city.toLowerCase() !== currentCity.toLowerCase()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onCitySearch(searchInput.trim());
      setSearchInput('');
      setShowSuggestions(false);
      setIsSearchFocused(false);
    }
  };

  const handleCitySelect = (city: string) => {
    onCitySearch(city);
    setSearchInput('');
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="text-2xl"
            >
              🏙️
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Smart City Dashboard
            </span>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <motion.div
                animate={{ 
                  scale: isSearchFocused ? 1.02 : 1,
                  boxShadow: isSearchFocused ? '0 0 20px rgba(59, 130, 246, 0.3)' : '0 0 0px rgba(59, 130, 246, 0)'
                }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder={`Search cities... (Current: ${currentCity})`}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 pl-12 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                />
                <motion.div
                  animate={{ 
                    scale: isSearchFocused ? [1, 1.3, 1] : [1, 1.2, 1],
                    color: isSearchFocused ? '#06b6d4' : '#22d3ee'
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl"
                >
                  🔍
                </motion.div>
                {searchInput && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => {
                      setSearchInput('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    type="button"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            </form>
            
            {/* Auto-complete Suggestions */}
            <AnimatePresence>
              {showSuggestions && (searchInput || isSearchFocused) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
                >
                  {filteredCities.length > 0 ? (
                    <div className="p-2">
                      {filteredCities.slice(0, 6).map((city, index) => (
                        <motion.button
                          key={city}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center space-x-3"
                        >
                          <span className="text-lg">🏙️</span>
                          <span>{city}</span>
                        </motion.button>
                      ))}
                    </div>
                  ) : searchInput ? (
                    <div className="p-4 text-center text-gray-400">
                      <span className="text-2xl block mb-2">🔍</span>
                      No cities found matching "{searchInput}"
                    </div>
                  ) : (
                    <div className="p-2">
                      <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">Popular Cities</div>
                      {popularCities.slice(0, 6).map((city, index) => (
                        <motion.button
                          key={city}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center space-x-3"
                        >
                          <span className="text-lg">🏙️</span>
                          <span>{city}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <VoiceSearch onCitySearch={onCitySearch} />
            <FavoriteCities onCitySelect={onCitySearch} currentCity={currentCity} />
            <ThemeToggle />
            <SettingsMenu onShowComparison={onShowComparison} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;