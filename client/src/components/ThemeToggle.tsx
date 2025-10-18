'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      const darkMode = saved === 'dark';
      setIsDark(darkMode);
      applyTheme(darkMode);
    }
  }, []);

  const applyTheme = (dark: boolean) => {
    const body = document.body;
    if (dark) {
      body.style.background = 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)';
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)';
      body.classList.add('light');
      body.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden"
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          {isDark ? '🌙' : '☀️'}
        </motion.span>
      </motion.div>
      
      <motion.div
        animate={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 rounded-full"
      />
    </motion.button>
  );
};

export default ThemeToggle;