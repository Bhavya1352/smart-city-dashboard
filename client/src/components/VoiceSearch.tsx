'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface VoiceSearchProps {
  onCitySearch: (city: string) => void;
}

const VoiceSearch = ({ onCitySearch }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        
        // Extract city name from speech
        const cityMatch = result.match(/(?:search|find|show|go to)\s+(.+)/i);
        if (cityMatch) {
          const city = cityMatch[1].trim();
          onCitySearch(city);
        } else {
          onCitySearch(result.trim());
        }
        
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onCitySearch]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!recognition) {
    return null; // Voice search not supported
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isListening ? stopListening : startListening}
      className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/20 border-red-400/50 text-red-400' 
          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
      }`}
    >
      <motion.div
        animate={isListening ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
      >
        {isListening ? '🔴' : '🎤'}
      </motion.div>
    </motion.button>
  );
};

export default VoiceSearch;