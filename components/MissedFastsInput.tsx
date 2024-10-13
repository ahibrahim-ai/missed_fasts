"use client";

import * as React from "react";
import { useState } from "react";
import { Input } from "../components/ui/input"; 
import { Label } from "../components/ui/label"; 
import { Button } from "../components/ui/button"; 
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import 'react-day-picker/dist/style.css'; // Import react-day-picker styles

const MissedFastsInput = () => {
  const [missedFasts, setMissedFasts] = React.useState<number>(0);
  const [firstDay, setFirstDay] = React.useState<Date>(new Date());
  const [cycleLength, setCycleLength] = React.useState<number>(28);
  const [menstruationDuration, setMenstruationDuration] = React.useState<number>(7);
  const [selectedToggle, setSelectedToggle] = useState<string | null>(null); // Selected fasting pattern
  const [error, setError] = React.useState<string>("");

  // Handler for the missed fasts input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 1 && value <= 100) {
      setMissedFasts(value);
      setError("");
    } else {
      setError("Please input a valid number of missed fasts.");
    }
  };

  // Handle first day of last menstrual cycle change
  const handleFirstDayChange = (date: Date | undefined) => {
    setFirstDay(date ?? new Date());
    setError("");
  };

  // Handle cycle length change
  const handleCycleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCycleLength(value >= 1 ? value : cycleLength);
  };

  // Handle menstruation duration change
  const handleMenstruationDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setMenstruationDuration(value >= 1 ? value : menstruationDuration);
  };

  // Calculate menstruation days for each cycle
  const calculateMenstruationDays = (): Date[] => {
    if (!firstDay || missedFasts === 0) return [];

    const menstruationDays: Date[] = [];
    let currentCycleStart = dayjs(firstDay);

    // Calculate menstruation days for the given number of cycles
    for (let i = 0; i < Math.ceil(missedFasts / cycleLength); i++) {
      for (let j = 0; j < menstruationDuration; j++) {
        menstruationDays.push(currentCycleStart.add(j, 'day').toDate());
      }
      currentCycleStart = currentCycleStart.add(cycleLength, 'day');
    }

    return menstruationDays;
  };

  const calculateHighlightedDays = React.useMemo(() => {
    if (!firstDay || missedFasts === 0) return [];

    let highlightedDays: Date[] = [];
    let nextDate = new Date(); // Start from today
    const menstruationDays = calculateMenstruationDays();

    if (selectedToggle === 'MonThu') {
      // Highlight Monday and Thursday starting from today
      let count = 0;
      while (count < missedFasts) {
        while (nextDate.getDay() !== 1 && nextDate.getDay() !== 4) {
          nextDate.setDate(nextDate.getDate() + 1); // Advance to Monday or Thursday
        }

        // Skip if nextDate is a menstruation day
        if (!menstruationDays.find(date => dayjs(date).isSame(nextDate, 'day'))) {
          highlightedDays.push(new Date(nextDate));
          count++;
        }
        nextDate.setDate(nextDate.getDate() + 1); // Move to the next day to continue
      }
    } else if (selectedToggle === 'EveryOther') {
      // Highlight every other day starting from today
      let count = 0;
      while (count < missedFasts) {
        if (!menstruationDays.find(date => dayjs(date).isSame(nextDate, 'day'))) {
          highlightedDays.push(new Date(nextDate));
          count++;
        }
        nextDate.setDate(nextDate.getDate() + 2); // Every other day
      }
    } else if (selectedToggle === 'Consecutively') {
      // Highlight consecutive days starting from today
      let count = 0;
      while (count < missedFasts) {
        if (!menstruationDays.find(date => dayjs(date).isSame(nextDate, 'day'))) {
          highlightedDays.push(new Date(nextDate));
          count++;
        }
        nextDate.setDate(nextDate.getDate() + 1); // Consecutive days
      }
    }

    return highlightedDays;
  }, [selectedToggle, missedFasts, firstDay]);

  return (
    <div className="relative min-h-screen bg-[url('background.png.png')] bg-cover bg-center bg-fixed">
     
      <h1 className="text-4xl font-bold text-center mb-5 pt-10">Missed Fasts</h1>
      
      <div className="rounded-3xl mb-20 bg-white px-6 pt-10 pb-8 shadow-xl sm:mx-auto sm:max-w-lg sm:rounded-3xl sm:px-10">
        <div className="flex flex-col items-center text-center p-4">
          <Label className="block mb-2">How many days of fasting do you need to make up?</Label>
          <Input
            type="number"
            min="1"
            value={missedFasts || ''}
            onChange={handleInputChange}
            className="border rounded-2xl p-2 text-center mb-4"
          />
          <Label className="block mb-2">Normal length of cycle (28/30/31):</Label>
          <Input
            type="number"
            min="1"
            value={cycleLength}
            onChange={handleCycleLengthChange}
            className="border rounded-2xl p-2 text-center mb-4"
          />

          <Label className="block mb-2">How many days of prayers do you usually miss:</Label>
          <Input
            type="number"
            min="1"
            value={menstruationDuration}
            onChange={handleMenstruationDurationChange}
            className="border rounded-2xl p-2 text-center mb-4"
          />
  
          <Label className="block mb-0">What was the first day of your last period:</Label>
          <DayPicker 
            mode="single"
            selected={firstDay}
            onSelect={handleFirstDayChange}
            modifiers={{
              highlighted: calculateHighlightedDays, // Use the highlighted days based on toggle
            }}
            modifiersStyles={{
              highlighted: { backgroundColor: '#eeccbb', color: 'white' },
            }}
          />
      
          <div className="relative flex flex-row max-w-screen-sm space-x-5 justify-center mt-0">
            <Button
              onClick={() => setSelectedToggle('MonThu')}
              className={`w-24 ${selectedToggle === 'MonThu' ? 'rounded-3xl border border-black' : 'rounded-3xl bg-[#d39f8d]'}`}
            >
              Mon + Thu
            </Button>
            <Button
              onClick={() => setSelectedToggle('EveryOther')}
              className={`w-32 ${selectedToggle === 'EveryOther' ? 'rounded-3xl border border-black' : 'rounded-3xl bg-[#d39f8d]'}`}
            >
              Every other day
            </Button>
            <Button
              onClick={() => setSelectedToggle('Consecutively')}
              className={`w-24 ${selectedToggle === 'Consecutively' ? 'rounded-3xl border border-black' : 'rounded-3xl bg-[#d39f8d]'}`}
            >
              Daily
            </Button>
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
      </div>
    </div>
  );
};

export default MissedFastsInput;
