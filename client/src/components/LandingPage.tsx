'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

const LandingPage = ({ onEnterDashboard }: LandingPageProps) => {
  const [showContent, setShowContent] = useState(false);

  const leftImages = [
    { id: 1, src: '/img1.jpg', delay: 0 },
    { id: 2, src: '/img2.jpg', delay: 0.1 },
    { id: 3, src: '/img3.jpg', delay: 0.2 },
  ];

  const rightImages = [
    { id: 4, src: '/img4.jpg', delay: 0.05 },
    { id: 5, src: '/img5.jpg', delay: 0.15 },
    { id: 6, src: '/img6.jpg', delay: 0.25 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      
      <div className="absolute left-0 top-0 w-1/2 h-full">
        {leftImages.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ 
              x: -800,
              y: (index * (typeof window !== 'undefined' ? window.innerHeight : 800) / 3),
              scale: 0,
              rotate: -180
            }}
            animate={{ 
              x: 0,
              y: (index * (typeof window !== 'undefined' ? window.innerHeight : 800) / 3),
              scale: [0, 1.5, 1],
              rotate: [180, 0]
            }}
            transition={{ 
              duration: 0.6, 
              delay: img.delay,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              if (index === leftImages.length - 1) {
                setTimeout(() => setShowContent(true), 50);
              }
            }}
            className="absolute w-full h-1/3 overflow-hidden"
          >
            <img 
              src={img.src} 
              alt={`City image ${img.id}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute right-0 top-0 w-1/2 h-full">
        {rightImages.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ 
              x: 800,
              y: (index * (typeof window !== 'undefined' ? window.innerHeight : 800) / 3),
              scale: 0,
              rotate: 180
            }}
            animate={{ 
              x: 0,
              y: (index * (typeof window !== 'undefined' ? window.innerHeight : 800) / 3),
              scale: [0, 1.5, 1],
              rotate: [-180, 0]
            }}
            transition={{ 
              duration: 0.6, 
              delay: img.delay,
              ease: "easeOut"
            }}
            className="absolute w-full h-1/3 overflow-hidden"
          >
            <img 
              src={img.src} 
              alt={`City image ${img.id}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          scale: showContent ? 1 : 0.8 
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center z-10 bg-black/50 backdrop-blur-md rounded-3xl p-12 border border-white/20"
      >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ 
            y: showContent ? 0 : 50, 
            opacity: showContent ? 1 : 0 
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl md:text-7xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <motion.span
            animate={{ 
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.7)",
                "0 0 20px rgba(59, 130, 246, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            Apna City
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ 
            y: showContent ? 0 : 30, 
            opacity: showContent ? 1 : 0 
          }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-300 mb-8"
        >
          Your smart companion for real-time city insights
        </motion.p>

        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ 
            y: showContent ? 0 : 30, 
            opacity: showContent ? 1 : 0 
          }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterDashboard}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl px-12 py-4 rounded-full font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300"
        >
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Enter Dashboard →
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingPage;