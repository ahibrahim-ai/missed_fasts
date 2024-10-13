'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'; // Import from framer-motion
import MissedFastsInput from '@/components/MissedFastsInput';
import { Button } from '@/components/ui/button'; // Adjust path if necessary

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleStart = () => {
    setShowCalculator(true); // Show calculator when start button is clicked
  };

  return (
    <div className="relative min-h-screen bg-background flex justify-center items-center">
      {/* Static Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('background.png.png')] z-0"></div>

      {/* Content that will be animated */}
      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!showCalculator ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: '-100vw' }} // Start from left of the screen
              animate={{ opacity: 1, x: 0 }}        // Slide into view
              exit={{ opacity: 0, x: '100vw' }}      // Slide out to the right
              transition={{ duration: 0.7 }}         // Set transition duration
              className="bg-white rounded-3xl shadow-lg p-8 text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Missed Fasts Calculator</h1>
              <p className="text-lg text-gray-700 mb-6">
                Welcome! This tool helps you calculate the best days to make up missed fasts. Enter your details, and we'll help plan the perfect days for fasting.
              </p>
              <Button
                onClick={handleStart}
                className="bg-[#d39f8d] text-white px-6 py-3 rounded-full hover:bg-[#c18a7b]"
              >
                Start
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: '100vw' }}  // Start from right of the screen
              animate={{ opacity: 1, x: 0 }}       // Slide into view
              exit={{ opacity: 0, x: '-100vw' }}   // Slide out to the left
              transition={{ duration: 0.7 }}       // Set transition duration
            >
              <MissedFastsInput />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
