'use client';

import React, { useState } from 'react';
// Import the Input component and Calendar from shadcn
import { Input } from '@/components/ui/input';
import { Calendar } from './ui/calendar';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const MissedFastsInput = () => {
  const [missedFasts, setMissedFasts] = useState<number | undefined>(undefined);
  const [slideUp, setSlideUp] = useState(false); // State to handle the sliding up of the div
  const [showText, setShowText] = useState(false); // State to toggle input field or text
  const [selectedToggle, setSelectedToggle] = useState<string | null>(null); // Selected fasting pattern
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]); // Days to highlight on the calendar

  // Handler function for input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      setMissedFasts(numValue);
    } else {
      setMissedFasts(undefined);
    }
  };

  // Function to handle the 'Enter' key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && missedFasts !== undefined) {
      setSlideUp(true); // Trigger the sliding up when Enter is pressed
      setShowText(true); // Show the text with the number of days
    }
  };

  // Function to handle toggle selection
  const handleToggle = (toggle: string) => {
    setSelectedToggle(toggle);
    let daysToHighlight: Date[] = [];
    const today = new Date();

    if (missedFasts !== undefined) {
      if (toggle === 'MonThu') {
        // Highlight Monday and Thursday
        let count = 0;
        let nextDate = new Date(today);
        while (count < missedFasts) {
          while (nextDate.getDay() !== 1 && nextDate.getDay() !== 4) {
            nextDate.setDate(nextDate.getDate() + 1); // Advance to Monday or Thursday
          }
          daysToHighlight.push(new Date(nextDate));
          nextDate.setDate(nextDate.getDate() + 1); // Move to the next day to continue
          count++;
        }
      } else if (toggle === 'EveryOther') {
        // Highlight every other day
        for (let i = 0; i < missedFasts; i++) {
          let nextDate = new Date(today);
          nextDate.setDate(today.getDate() + i * 2); // Every other day
          daysToHighlight.push(nextDate);
        }
      } else if (toggle === 'Consecutively') {
        // Highlight consecutive days
        for (let i = 0; i < missedFasts; i++) {
          let nextDate = new Date(today);
          nextDate.setDate(today.getDate() + i); // Consecutive days
          daysToHighlight.push(nextDate);
        }
      }
    }

    setHighlightedDays(daysToHighlight);
  };

  return (
    <div className="relative min-h-screen bg-[#FEFAF6] bg-cover bg-center bg-fixed">
      <h1 className='text-4xl font-extrabold text-center pt-10'>Missed Fasts Planner</h1>
      
      <div
        className={`flex items-center justify-center transition-transform duration-1000 absolute w-full ${
          slideUp ? 'top-20' : 'top-1/2 transform -translate-y-1/2'
        }`}
      >
        <div className="flex flex-col items-center mb-6 text-center">
          {showText ? (
            <div className="block text-lg font-medium">
              You have <b>{missedFasts} days</b> to make up.
            </div>
          ) : (
            <>
              <label htmlFor="missedFasts" className="block mb-4 text-lg font-medium">
                How many days do you need to make up?
              </label>
              <Input
                type="number"
                id="missedFasts"
                min="1"
                max="50"
                value={missedFasts ? missedFasts.toString() : ''}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress} // Listen for Enter key press
                className="flex h-9 w-full max-w-52 focus-visible:border-purple-300 mt-4 p-2 text-center border-purple-950 rounded-full"
              />
            </>
          )}
        </div>
      </div>

      {slideUp && (
        <>
          {/* Toggle Buttons */}
          <div className="relative flex flex-row max-w-screen-sm space-x-5 justify-center mt-16">
            <Button
              variant={selectedToggle === 'MonThu' ? 'outline' : 'solid'}
              onClick={() => handleToggle('MonThu')}
              className='w-24'
            >
              Mon + Thu
            </Button>
            <Button
              variant={selectedToggle === 'EveryOther' ? 'outline' : 'solid'}
              onClick={() => handleToggle('EveryOther')}
              className='w-32'
            >
              Every other day
            </Button>
            <Button
              variant={selectedToggle === 'Consecutively' ? 'outline' : 'solid'}
              onClick={() => handleToggle('Consecutively')}
              className='w-24'
            >
              Daily
            </Button>
          </div>

          {/* Calendar Component */}
          <div className="flex flex-col basis-0 items-stretch w-full p-10">
            <div className='flex grow items-center bg-orange-200 h-72 w-full justify-center rounded-3xl px-3 mt-6'>
              <Calendar
                highlightedDays={highlightedDays} // Assuming the Calendar accepts highlighted days as prop
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MissedFastsInput;
