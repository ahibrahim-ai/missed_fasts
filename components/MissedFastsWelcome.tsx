"use client";

import React, { useState } from "react";
import MissedFastsInput from "./MissedFastsInput"; // Assuming MissedFastsInput is in the same directory
import { Button } from "../components/ui/button"; // Import the button component

const MissedFastsWelcome = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  const handleStart = () => {
    setShowCalculator(true); // Show the MissedFastsInput form when the button is clicked
  };

  return (
    <div className="relative min-h-screen bg-[url('background.png')] bg-cover bg-center bg-fixed flex justify-center items-center">
      {!showCalculator ? (
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg text-center">
          <h1 className="text-3xl font-bold mb-4">Missed Fasts Calculator</h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome! This tool is designed to help Muslim women easily calculate
            the best days to make up for missed fasts. Whether you’ve missed
            fasts due to menstruation or other reasons, this calculator will
            guide you in planning your makeup fasts. Enter your details, and
            we’ll help you figure out the best days to complete your missed
            fasts.
          </p>
          <Button
            onClick={handleStart}
            className="bg-[#d39f8d] text-white px-6 py-3 rounded-full hover:bg-[#c18a7b]"
          >
            Start
          </Button>
        </div>
      ) : (
        <MissedFastsInput /> // Load the MissedFastsInput component after clicking Start
      )}
    </div>
  );
};

export default MissedFastsWelcome;
