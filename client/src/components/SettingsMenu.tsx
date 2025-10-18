'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SettingsMenuProps {
  onShowComparison: () => void;
}

const SettingsMenu = ({ onShowComparison }: SettingsMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { icon: '🏙️', label: 'Compare Cities', action: onShowComparison },
    { icon: '📊', label: 'Export Data', action: () => alert('Export feature coming soon!') },
    { icon: '🔔', label: 'Notifications', action: () => alert('Notification settings') },
    { icon: '📍', label: 'Location', action: () => alert('Location settings') },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: showMenu ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⚙️
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-slate-800/90 backdrop-blur-md border border-white/20 rounded-xl p-2 min-w-48 z-50"
          >
            <div className="text-xs text-gray-400 mb-2 px-3 pt-1">Quick Actions</div>
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  item.action();
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsMenu;